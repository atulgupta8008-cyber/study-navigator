from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.db import Base


class ChapterSignal(Base):
    __tablename__ = "chapter_signals"

    id = Column(Integer, primary_key=True, index=True)
    chapter = Column(String, unique=True, index=True)

    effort_score = Column(Integer, default=0, nullable=False)
    resistance_score = Column(Integer, default=0, nullable=False)
    trust_score = Column(Integer, default=50, nullable=False)  # start neutral

    last_action_at = Column(DateTime, default=datetime.utcnow)

    
