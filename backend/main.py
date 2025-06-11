from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import create_db, Solar, Wind, Battery, Measure, Token, engine
from sqlmodel import Session, select
from ingester import start_ingest
from datetime import datetime

create_db()
#start_ingest()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_credencial(credential: str):
    valid_credencial = []
    with Session(engine) as session:
        statement = select(Token).where(Token.expired_at >= datetime.now())
        tokens = session.exec(statement).all()
        for token in tokens:
            valid_credencial.append(token.token)
    if not credential in valid_credencial:
        raise HTTPException(status_code=401, detail="Invalid Token")
    return True

@app.get("/measures/")
async def read_measure_interval(start_date: str = "2025-05-08T12:00:00", credential: bool = Depends(verify_credencial)):
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

@app.get("/live/")
async def read_last_measure(credential: bool = Depends(verify_credencial)):
    payload = {
            "measure": int,
            "voltage": {
                "solar": float,
                "wind": float,
                "battery": float
                },
            "current": {
                "source": float,
                "battery": float
                },
            "temperature": {
                "temp1": float,
                "temp2": float,
                "temp3": float
                },
            "status": {
                "solar": bool,
                "wind": bool,
                "battery": bool,
                "load": bool,
                "vca": bool
                },
            }

    with Session(engine) as session:
        statement = select(Measure).order_by(Measure.id.desc()).limit(1)
        measure = session.exec(statement).one()
        payload['measure'] = measure.id
        payload['voltage']['solar'] = measure.solar.voltage
        payload['voltage']['wind'] = measure.wind.voltage
        payload['voltage']['battery'] = measure.battery.voltage
        payload['current']['source'] = measure.source_current
        payload['current']['battery'] = measure.battery.current
        payload['temperature']['temp1'] = measure.battery.temp_a
        payload['temperature']['temp2'] = measure.battery.temp_b
        payload['temperature']['temp3'] = measure.battery.temp_c
        payload['status']['solar'] = measure.solar.status
        payload['status']['wind'] = measure.wind.status
        payload['status']['battery'] = measure.battery.status
        payload['status']['load'] = measure.load_status
        payload['status']['vca'] = measure.vca_status

    return payload
