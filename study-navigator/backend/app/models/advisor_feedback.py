from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.db import Base

class AdvisorFeedback(Base):
    __tablename__ = "advisor_feedback"

    id = Column(Integer, primary_key=True, index=True)
    chapter = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    action = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
