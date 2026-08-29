from datetime import datetime, timezone

from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON, Text
)
from sqlalchemy.orm import relationship

from app.db.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False)  # "farmer" | "vet" | "admin"
    password_hash = Column(String, nullable=False)

    animals = relationship("Animal", back_populates="owner")


class Animal(Base):
    __tablename__ = "animals"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    species = Column(String, nullable=False)
    breed = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    vaccination_status = Column(String, default="unknown")  # up_to_date | overdue | unknown

    owner = relationship("User", back_populates="animals")
    reports = relationship("Report", back_populates="animal")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    animal_id = Column(Integer, ForeignKey("animals.id"), nullable=False)
    symptoms = Column(JSON, nullable=False, default=list)
    duration_days = Column(Integer, nullable=True)
    other_animals_affected = Column(Boolean, default=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    created_at = Column(DateTime, default=utcnow)
    synced = Column(Boolean, default=True)

    ranked_diseases = Column(JSON, nullable=True)
    breed_note = Column(Text, nullable=True)
    age_note = Column(Text, nullable=True)

    immediate_care = Column(JSON, nullable=True)
    prevention = Column(JSON, nullable=True)
    vet_urgency = Column(String, nullable=True)
    avoid = Column(JSON, nullable=True)

    animal = relationship("Animal", back_populates="reports")
    case = relationship("Case", back_populates="report", uselist=False)


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), unique=True, nullable=False)
    status = Column(String, default="reported")
    assigned_vet_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    lab_result = Column(String, nullable=True)

    report = relationship("Report", back_populates="case")


class Cluster(Base):
    __tablename__ = "clusters"

    id = Column(Integer, primary_key=True, index=True)
    disease_name = Column(String, nullable=False)
    case_ids = Column(JSON, nullable=False, default=list)
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    radius_km = Column(Float, default=5.0)
    window_days = Column(Integer, default=7)
    created_at = Column(DateTime, default=utcnow)