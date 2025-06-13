from logging import info, error, debug, warning, basicConfig, DEBUG
from database import Solar, Wind, Battery, Measure, engine
from sqlmodel import Session, select
from time import sleep

from serial import Serial
import enum

from config import settings

basicConfig(level=DEBUG)

class Cmd(enum.Enum):
    SOLAR_SW = 'S'
    WIND_SW = 'W'
    BATTERY_SW = 'B'
    LOAD_SW = 'L'
    VCA_SW = 'V'
    SOLAR_PWM = 'X'
    WIND_PWM = 'Y'

class Command():
    def __init__(self, cmd: Cmd, arg: int):
        self.cmd = cmd
        self.arg = arg
        self.serial = Serial(
                port=settings.serial_port,
                baudrate=settings.serial_baudrate,
                timeout=settings.serial_timeout
                )
    
    def __str__(self):
        if self.cmd == Cmd.SOLAR_SW:
            return f"Command: Solar Switch {bool(self.arg)}"
        elif self.cmd == Cmd.WIND_SW:
            return f"Command: Wind Switch {bool(self.arg)}"
        elif self.cmd == Cmd.BATTERY_SW:
            return f"Command: Battery Switch {bool(self.arg)}"
        elif self.cmd == Cmd.LOAD_SW:
            return f"Command: Load Switch {bool(self.arg)}"
        elif self.cmd == Cmd.VCA_SW:
            return f"Command: VCA Switch {bool(self.arg)}"
        elif self.cmd == Cmd.SOLAR_PWM:
            return f"Command: Solar Duty Cycle {self.arg}%"
        elif self.cmd == Cmd.WIND_PWM:
            return f"Command: Wind Duty Cycle {self.arg}%"

    def send(self) -> bool: 
        if self.cmd in [Cmd.SOLAR_SW, Cmd.WIND_SW, Cmd.BATTERY_SW, Cmd.LOAD_SW, Cmd.VCA_SW]:
            if self.arg not in [0,1]:
                error(f"Bad switch arg: {self.arg}")
                return False
        elif self.cmd in [Cmd.SOLAR_PWM, Cmd.WIND_PWM]:
            if self.arg < 0 or self.arg > 100:
                error(f"PWM not in range: {self.arg}")
                return False
        payload = f"{self.cmd.value} {self.arg}\r"
        debug(f"Payload: {payload}")
        self.serial.write(payload.encode())
        return True

    def validate(self, new_measure: Measure) -> bool:
#        debug(f"===VALIDATION===: {self.cmd} {self.arg}")
        if self.cmd == Cmd.SOLAR_SW:
#            debug(f"+++ SOLAR SW: {new_measure.solar.status}")
            return new_measure.solar.status == bool(self.arg)
        elif self.cmd == Cmd.WIND_SW:
#            debug(f"+++ WIND SW: {new_measure.wind.status}")
            return new_measure.wind.status == bool(self.arg)
        elif self.cmd == Cmd.BATTERY_SW:
#            debug(f"+++ BATTERY SW: {new_measure.battery.status}")
            return new_measure.battery.status == bool(self.arg)
        elif self.cmd == Cmd.LOAD_SW:
#            debug(f"+++ LOAD SW: {new_measure.load_status}")
            return new_measure.load_status == bool(self.arg)
        elif self.cmd == Cmd.VCA_SW:
#            debug(f"+++ VCA SW: {new_measure.vca_status}")
            return new_measure.vca_status == bool(self.arg)
        elif self.cmd == Cmd.SOLAR_PWM:
#            debug(f"+++ SOLAR PWM: {new_measure.solar.duty_cycle}")
            return new_measure.solar.duty_cycle == self.arg
        elif self.cmd == Cmd.WIND_PWM:
#            debug(f"+++ WIND PWM: {new_measure.wind.duty_cycle}")
            return new_measure.wind.duty_cycle == self.arg
#        debug("==================================")
    
    def execute(self) -> bool:
        for i in range(settings.cmd_max_retry):
            sleep(settings.cmd_sleep_ms/1000)
            if not self.send():
                return False
            for j in range(settings.cmd_max_check_retry):
                with Session(engine) as session:
                    statement = select(Measure).order_by(Measure.id.desc()).limit(1)
#                    debug(statement)
                    new_measure = session.exec(statement).one()
                    debug(f"Measure id: {new_measure.id}")
#                    debug(f"Solar: {new_measure.solar}")
#                    debug(f"Wind: {new_measure.wind}")
#                    debug(f"Battery: {new_measure.battery}")
                    if self.validate(new_measure):
                        debug(f"Command executed: {self}")
                        self.serial.close()
                        return True
                    else:
                        debug(f"Command failed: {self}")
                        debug(f"Retry number: {j}")
                        sleep((settings.cmd_sleep_ms + j * 50)/1000)

def select_source(measure: Measure) -> Command:
    if measure.solar.voltage >= settings.voltage_threshold and measure.wind.voltage <= (settings.voltage_threshold*1.2):
        return Command(Cmd.SOLAR_SW, 1)
    elif measure.wind.voltage >= settings.voltage_threshold:
        return Command(Cmd.WIND_SW, 1)
    else:
        return None

def adjusted_voltage_factor(voltage: float) -> int:
    if voltage < settings.voltage_threshold:
        return 0
    else:
        return round(100 * settings.voltage_threshold / voltage)

def connect_load(measure: Measure) -> Command:
    if measure.solar.status or measure.wind.status:
        return Command(Cmd.LOAD_SW, 1)
    elif measure.battery.voltage >= settings.battery_voltage_threshold:
        return Command(Cmd.LOAD_SW, 1)
    else:
        return Command(Cmd.LOAD_SW, 0)

def protect_battery(measure: Measure) -> Command:
    mean_temp = measure.battery.temp_a
    mean_temp += measure.battery.temp_b
    mean_temp += measure.battery.temp_c
    mean_temp /= 3
    if mean_temp >= settings.battery_max_temp:
        return Command(Cmd.BATTERY_SW, 0)
    else:
        return Command(Cmd.BATTERY_SW, 1)
    
def start_oversee():
    set_source_A = None
    adjust_solar_A = None
    adjust_wind_A = None
    with Session(engine) as session:
        statement = select(Measure).order_by(Measure.id.desc()).limit(1)
#        debug(statement)
        measure = session.exec(statement).one()
        debug(f"Measure id: {measure.id}")
        set_source_A = select_source(measure)
        adjust_solar_A = Command(Cmd.SOLAR_PWM,
                                 adjusted_voltage_factor(measure.solar.voltage))
        adjust_wind_A = Command(Cmd.WIND_PWM,
                                adjusted_voltage_factor(measure.wind.voltage))
    # If not source has enought voltage then turn them both off
    if set_source_A == None:
        Command(Cmd.SOLAR_SW, 0).execute()
        Command(Cmd.WIND_SW, 0).execute()
    set_battery_A = Command(Cmd.BATTERY_SW, 1)
    set_load_A = Command(Cmd.LOAD_SW, 1)
    set_vca_A = Command(Cmd.VCA_SW, 0)
    set_source_B = None
    set_battery_B = None
    set_load_B = None
    set_vca_B = None
    adjust_solar_B = None
    adjust_wind_B = None
    while True:
        if set_source_A != set_source_B:
            set_source_B = set_source_A
            set_source_A.execute()
        if set_battery_A != set_battery_B:
            set_battery_B = set_battery_A
            set_battery_A.execute()
        if set_load_A != set_load_B:
            set_load_B = set_load_A
            set_load_A.execute()
        if set_vca_A != set_vca_B:
            set_vca_B = set_vca_A
            set_vca_A.execute()
        if adjust_solar_A != adjust_solar_B:
            adjust_solar_B = adjust_solar_A
            adjust_solar_A.execute()
        if adjust_wind_A != adjust_wind_B:
            adjust_wind_B = adjust_wind_A
            adjust_wind_A.execute()

        with Session(engine) as session:
            statement = select(Measure).order_by(Measure.id.desc()).limit(1)
#            debug(statement)
            measure = session.exec(statement).one()
            debug(f"Measure id: {measure.id}")
            set_source_A = select_source(measure)
            set_battery_A = protect_battery(measure)
            set_load_A = connect_load(measure)
            adjust_solar_A = Command(Cmd.SOLAR_PWM,
                                   adjusted_voltage_factor(measure.solar.voltage))
            adjust_wind_A = Command(Cmd.WIND_PWM,
                                  adjusted_voltage_factor(measure.wind.voltage))
            if measure.load_status == False:
                set_vca_A = Command(Cmd.VCA_SW, 1)
    # If not source has enought voltage then turn them both off
    if set_source_A == None:
        Command(Cmd.SOLAR_SW, 0).execute()
        Command(Cmd.WIND_SW, 0).execute()

start_oversee()
