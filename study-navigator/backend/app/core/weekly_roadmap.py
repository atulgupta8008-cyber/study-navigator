def generate_weekly_roadmap(roadmap, survey):
    hours = survey.get("daily_self_study_hours", 3)
    burnout = survey.get("burnout_level", 2)

    max_primary = 2 if burnout >= 4 or hours <= 2 else 3
    max_secondary = 2

    primary = []
    secondary = []
    optional = []

    for item in roadmap:
        label = item["priority_label"]
        chapter = item["chapter"]

        if label == "must_do" and len(primary) < max_primary:
            primary.append({
                "chapter": chapter,
                "reason": "High priority + weak area"
            })
        elif label == "should_do" and len(secondary) < max_secondary:
            secondary.append({
                "chapter": chapter,
                "reason": "Important if time permits"
            })
        else:
            optional.append({
                "chapter": chapter,
                "reason": "Low urgency this week"
            })

    return {
        "primary": primary,
        "secondary": secondary,
        "optional": optional
    }
