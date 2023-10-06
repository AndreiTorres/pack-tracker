from fastapi import APIRouter, HTTPException, status, Body
from typing import Annotated
from model.user_model import User
from service.user_service import UserService
from fastapi.responses import JSONResponse

userRouter = APIRouter()

@userRouter.post("/packs/login")
async def login(user: Annotated[User, Body()]):
    response = UserService.login(user)
    
    if response:
        return JSONResponse(response, status_code = 200)
    raise HTTPException(status.HTTP_400_BAD_REQUEST, detail = "Datos no válidos")
