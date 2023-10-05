from pydantic import BaseModel
from datetime import date, time
from bson import ObjectId

class TrackingEvent(BaseModel):
    pack_id: ObjectId
    ubication: str
    date: date
    hour: time