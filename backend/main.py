from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db, Solar, Wind, Battery, Measure, engine
from sqlmodel import Session, select
from ingester import start_ingest
from datetime import datetime

create_db()
start_ingest()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/measures/")
async def read_measure(start_date: str = "2025-05-08T12:00:00"):
    date = datetime.fromisoformat(start_date)
    payload = {
            "voltmeters": {
                "solar": [],
                "wind": [],
                "battery": []
                },
            "ammeters": {
                "source": [],
                "battery": []
                },
            "thermometers": {
                "temp1": [],
                "temp2": [],
                "temp3": []
                },
            }

    with Session(engine) as session:
        print(date)
        statement = select(Measure).where(Measure.date >= date)
        measures = session.exec(statement).all()
        for measure in measures:
            payload['voltmeters']['solar'].append(measure.solar.voltage)
            payload['voltmeters']['wind'].append(measure.wind.voltage)
            payload['voltmeters']['battery'].append(measure.battery.voltage)
            payload['ammeters']['source'].append(measure.source_current)
            payload['ammeters']['battery'].append(measure.battery.current)
            payload['thermometers']['temp1'].append(measure.battery.temp_a)
            payload['thermometers']['temp2'].append(measure.battery.temp_b)
            payload['thermometers']['temp3'].append(measure.battery.temp_c)

    return payload
