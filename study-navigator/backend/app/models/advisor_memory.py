from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.db import Base


class AdvisorMemory(Base):
    __tablename__ = "advisor_memory"

    id = Column(Integer, primary_key=True, index=True)

    chapter = Column(String, index=True)
    student_level = Column(String)
    priority = Column(String)

    advice = Column(String)

    advice_type = Column(String)  # first_time | reminder | strict | cooldown

    created_at = Column(DateTime, default=datetime.utcnow)
