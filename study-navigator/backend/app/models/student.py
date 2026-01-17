from sqlalchemy import Column, Integer, String, JSON
from app.db import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    survey_data = Column(JSON)
    roadmap_data = Column(JSON)
