from typing import Optional
from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    phone: str
    role: str
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    phone: str
    role: str

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    phone: str
    password: str


class LoginResponse(BaseModel):
    token: str
    role: str
    user_id: int