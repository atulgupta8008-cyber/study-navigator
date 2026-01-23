def calculate_weekly_capacity(
    daily_self_study_hours: int,
    burnout_level: int
):
    """
    Returns usable study minutes for the week
    """

    base_daily_minutes = daily_self_study_hours * 60

    burnout_penalty_map = {
        1: 0.0,
        2: 0.1,
        3: 0.2,
        4: 0.3,
        5: 0.4
    }

    penalty = burnout_penalty_map.get(burnout_level, 0.2)

    effective_daily_minutes = int(
        base_daily_minutes * (1 - penalty)
    )

    weekly_minutes = effective_daily_minutes * 6  # 1 buffer day

    return {
        "daily_minutes": effective_daily_minutes,
        "weekly_minutes": weekly_minutes
    }

def allocate_weekly_minutes(
    chapters: list,
    signals: dict,
    weekly_minutes: int,
    months_left: int
):
    """
    chapters: list of dicts with keys:
      - chapter
      - priority_label

    signals: dict keyed by chapter name → ChapterSignal

    Returns list with allocated minutes per chapter
    """

    priority_weights = {
        "high": 3.0,
        "medium": 2.0,
        "low": 1.0
    }

    if months_left <= 3:
        priority_multiplier = 1.3
    elif months_left <= 6:
        priority_multiplier = 1.15
    else:
        priority_multiplier = 1.0

    weighted_chapters = []
    total_weight = 0.0

    for ch in chapters:
        name = ch["chapter"]
        priority = ch["priority_label"]

        base_weight = priority_weights.get(priority, 1.0)
        signal = signals.get(name)

        resistance = signal.resistance_score if signal else 0
        trust = signal.trust_score if signal else 50

        resistance_penalty = min(resistance * 0.05, 0.5)
        trust_boost = (trust - 50) * 0.01

        final_weight = (
            base_weight
            * priority_multiplier
            * (1 - resistance_penalty)
            * (1 + trust_boost)
        )

        final_weight = max(final_weight, 0.2)

        weighted_chapters.append({
            "chapter": name,
            "weight": final_weight
        })

        total_weight += final_weight

    # Allocate minutes
    allocation = []

    for ch in weighted_chapters:
        minutes = int((ch["weight"] / total_weight) * weekly_minutes)
        allocation.append({
            "chapter": ch["chapter"],
            "weekly_minutes": minutes
        })

    return allocation

def generate_weekly_schedule(
    weekly_allocations: list,
    session_minutes: int = 60
):
    """
    weekly_allocations:
      [{ chapter, weekly_minutes }]

    Returns:
      dict → day -> list of study blocks
    """

    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    # Build session pool
    sessions = []

    for item in weekly_allocations:
        count = max(1, item["weekly_minutes"] // session_minutes)
        for _ in range(count):
            sessions.append({
                "chapter": item["chapter"],
                "minutes": session_minutes
            })

    schedule = {day: [] for day in days}

    day_index = 0

    for session in sessions:
        placed = False
        attempts = 0

        while not placed and attempts < 7:
            day = days[day_index % 7]

            # Constraints:
            # 1. max 2 sessions/day
            # 2. no same chapter twice
            chapters_today = [s["chapter"] for s in schedule[day]]

            if (
                len(schedule[day]) < 2
                and session["chapter"] not in chapters_today
            ):
                schedule[day].append(session)
                placed = True

            day_index += 1
            attempts += 1

        # fallback (rare, but safe)
        if not placed:
            schedule[days[day_index % 7]].append(session)
            day_index += 1

    return schedule
