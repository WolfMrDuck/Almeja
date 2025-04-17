from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

ruta_dist = os.path.abspath("../frontend/dist")

# Montar la carpeta `dist` generada por Vue
app.mount("/", StaticFiles(directory=ruta_dist, html=True), name="vue")