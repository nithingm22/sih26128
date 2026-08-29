from typing import Optional
from pydantic import BaseModel


class AnimalCreate(BaseModel):
    owner_id: int
    name: str
    species: str
    breed: Optional[str] = None
    age: Optional[int] = None
    vaccination_status: Optional[str] = "unknown"


class AnimalOut(BaseModel):
    id: int
    owner_id: int
    name: str
    species: str
    breed: Optional[str] = None
    age: Optional[int] = None
    vaccination_status: str

    class Config:
        from_attributes = True