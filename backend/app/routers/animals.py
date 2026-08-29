from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Animal
from app.schemas.animal import AnimalCreate, AnimalOut
from app.core.deps import get_current_user

router = APIRouter(prefix="/animals", tags=["animals"])


@router.get("", response_model=List[AnimalOut])
def list_animals(
    owner_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    query = db.query(Animal)
    if owner_id is not None:
        query = query.filter(Animal.owner_id == owner_id)
    return query.all()


@router.post("", response_model=AnimalOut, status_code=status.HTTP_201_CREATED)
def create_animal(
    payload: AnimalCreate,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    animal = Animal(**payload.model_dump())
    db.add(animal)
    db.commit()
    db.refresh(animal)
    return animal