from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.db import Base

class Explanation(Base):
    __tablename__ = "explanations"

    id = Column(Integer, primary_key=True, index=True)
    chapter = Column(String(100), index=True)
    student_level = Column(String(20))
    explanation = Column(Text)

    times_requested = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_requested_at = Column(DateTime, default=datetime.utcnow)
