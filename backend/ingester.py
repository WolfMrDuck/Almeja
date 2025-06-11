import serial
import json
from logging import info, error, debug, warning
from database import Solar, Wind, Battery, Measure, engine
from sqlmodel import Session

from config import settings

def ingest_data(json_data):
    charging_status = json_data["switches"]["solar"] | json_data["switches"]["wind"]
    with Session(engine) as session:
        solar_measure = Solar(
                status=json_data["switches"]["solar"],
                voltage=json_data["voltmeters"]["solar"],
                duty_cycle=int(json_data["controllers"]["solar"])
                )
        wind_measure = Wind(
                status=json_data["switches"]["wind"],
                voltage=json_data["voltmeters"]["wind"],
                duty_cycle=int(json_data["controllers"]["wind"])
                )
        batt_measure = Battery(
                status=json_data["switches"]["battery"],
                voltage=json_data["voltmeters"]["batt"],
                charging_status=charging_status,
                current=json_data["ammeters"]["batt"],
                temp_a=json_data["thermometers"]["therm1"],
                temp_b=json_data["thermometers"]["therm2"],
                temp_c=json_data["thermometers"]["therm3"]
                )
        measure  = Measure(
                source_current=json_data["ammeters"]["source"],
                load_status=json_data["switches"]["load"],
                vca_status=json_data["switches"]["vca"],
                solar=solar_measure,
                wind=wind_measure,
                battery=batt_measure
                )
        session.add(measure)
        session.commit()

def start_ingest():
    try:
        ser = serial.Serial(
                port=settings.serial_port,
                baudrate=settings.serial_baudrate,
                timeout=settings.serial_timeout
                )
        info(f"Connected to {settings.serial_port} at {settings.serial_baudrate} baud.")
    except serial.SerialException as e:
        error(f"Error opening serial port: {e}")
        exit()
    
    while True:
        try:
            # Read a line from the serial port
            line = ser.readline().decode('ascii', errors='ignore').strip()
            
            if line:  # Check if the line is not empty
                # Parse the JSON data
                json_data = json.loads(line)
                ingest_data(json_data)
                # Print the JSON data in a pretty format
                debug(json.dumps(json_data, indent=4))
            
        except json.JSONDecodeError as e:
           # print(f"JSON decode error: {e}")
            error(f"Wrong DATA: {line}")
        except KeyboardInterrupt:
            warning("Ingester exiting...")
            break
        except Exception as e:
            error(f"An error occurred: {e}")
    
    # Close the serial port
    ser.close()
    info("Serial connection ended")
