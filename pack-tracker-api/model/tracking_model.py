from pydantic import BaseModel

class TrackingEvent(BaseModel):
    pack_id: str
    ubication: str
