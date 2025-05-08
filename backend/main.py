from database import create_db
from ingester import start_ingest
from fastapi import FastAPI
import json

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

@app.get("/")
def testo():
    payload = json.dumps(data)
    return data
