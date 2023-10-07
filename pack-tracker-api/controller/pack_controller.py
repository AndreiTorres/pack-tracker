from fastapi import APIRouter, Body, status, HTTPException, Response
from fastapi.responses import JSONResponse
from typing import Annotated
from model.pack_model import Pack
from model.tracking_model import TrackingEvent
from service.pack_service import PackService
from bson import errors

router = APIRouter()

@router.post("/packs/tracking", status_code = 201)
async def register_tracking(tracking: Annotated[TrackingEvent, Body()], response: Response):
    try:
        id = PackService.register_tracking(tracking)
    except errors.InvalidId:
        raise HTTPException(status_code = 400, detail = "Solicitud incorrecta: El formato del ID es incorrecto")
    except Exception as e:
        raise HTTPException(status_code = 500, detail = "Error en el servidor")
    
    if id:
        response.headers["Location"] = f"/packs/tracking/{id}"
        response.status_code = status.HTTP_201_CREATED
        return response
    else:
        raise HTTPException(status.HTTP_409_CONFLICT, detail = "Error al registrar el seguimiento")


@router.get("/packs/tracking/{id}", status_code = 200)
async def find_trackings_by_id(id: str):
    try:
        trackings = PackService.find_trackings_by_id(id)
    except Exception as e:
        raise HTTPException(status_code = 500, detail = "Error en el servidor")
    
    return trackings


@router.post("/packs", status_code = 201)
async def register_pack(pack: Annotated[Pack, Body(...)], response: Response):
    result = PackService.register_pack(pack)
    
    if result:
        response.headers["Location"] = f"/packs/{result}"
        response.status_code = status.HTTP_201_CREATED
        return response
    else:
        raise HTTPException(status.HTTP_409_CONFLICT, detail = "Error al registrar paquete")
    

@router.get("/packs/{id}", status_code = 200)
async def find_by_id(id: str):

    try:
        result = PackService.find_by_id(id)
    except errors.InvalidId:
        raise HTTPException(status_code = 400, detail = "Solicitud incorrecta: El formato del ID es incorrecto")
    except Exception as e:
        raise HTTPException(status_code = 500, detail = "Error interno del servidor")

    if result:
        result_dict = dict(result)
        result_dict["_id"] = str(result_dict["_id"])
        return JSONResponse(result_dict, status_code = 200)
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail = "Paquete no encontrado")


@router.get("/packs", status_code = 200)
async def get_all_packs():
    packs = PackService.get_all_packs()

    return packs


@router.put("/packs/{id}", status_code = 204)
async def update_pack(id: str, updated_pack: Annotated[Pack, Body()], response:Response):

    try:
        update_pack = PackService.update_pack(id, updated_pack)
    except errors.InvalidId:
        raise HTTPException(status_code = 400, detail = "Solicitud incorrecta: El formato del ID es incorrecto")
    except Exception as e:
        raise HTTPException(status_code = 500, detail = "Error interno del servidor")

    if update_pack:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response 
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail = "Paquete no encontrado")

@router.delete("/packs/{id}", status_code = 204)
async def delete_pack_by_id(id: str, response: Response):

    try:
        result = PackService.delete_pack_by_id(id)
    except errors.InvalidId:
        raise HTTPException(status_code = 400, detail = "Solicitud incorrecta: El formato del ID es incorrecto")
    except Exception as e:
        raise HTTPException(status_code = 500, detail = e)
    
    if result:
        response.status_code = status.HTTP_204_NO_CONTENT
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail = "Paquete no encontrado")