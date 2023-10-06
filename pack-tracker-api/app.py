from fastapi import FastAPI
from controller.pack_controller import router
from fastapi.middleware.cors import CORSMiddleware
from controller.user_controller import userRouter

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],     
    allow_headers=["*"], 
    expose_headers=["*"]    
)

app.include_router(router)
app.include_router(userRouter)
