from fastapi import FastAPI
from controller.pack_controller import router

app = FastAPI()

app.include_router(router)
