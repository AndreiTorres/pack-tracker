from pydantic import BaseModel
from model.person_model import Person

class Pack(BaseModel):
    description: str
    width: float
    length: float
    weight: float
    sender: Person
    receiver: Person
    destination: str
    status: str = "Pendiente"
    