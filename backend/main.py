from database import create_db
from ingester import start_ingest
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#create_db()
#start_ingest()

data = {
        "voltmeters": {
            "solar": 0.0,
            "wind": 0.0,
            "battery": 0.0
            },
        "ammeters": {
            "source": 0.0,
            "battery": 0.0
            },
        "thermometers": {
            "temp1": 0.0,
            "temp2": 0.0,
            "temp3": 0.0
            },
        "switches": {
            "solar": False,
            "wind": False,
            "battery": True
            }
        }

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def testo():
    return data
