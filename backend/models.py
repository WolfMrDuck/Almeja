from sqlmodel import SQLModel, Field, Relationship, TIMESTAMP, Column, text
from datetime import datetime

class Source(SQLModel):
    id: int | None = Field(default=None, primary_key=True)
    status: bool | None = None
    voltage: float | None = None

class Solar(Source, table=True):
    duty_cycle: int | None = None
    measure: "Measure" = Relationship(back_populates="solar")

class Wind(Source, table=True):
    duty_cycle: int | None = None
    measure: "Measure" = Relationship(back_populates="wind")

class Battery(Source, table=True):
    charging_status: bool | None = None
    current: float | None = None
    temp_a: float | None = None
    temp_b: float | None = None
    temp_c: float | None = None
    measure: "Measure" = Relationship(back_populates="battery")

class Measure(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    source_current: float | None = None
    date: datetime | None = Field(sa_column=Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
        ))

    load_status: bool | None = None
    vca_status: bool | None = None

    solar_id: int | None = Field(default=None, foreign_key="solar.id")
    solar: Solar | None = Relationship(back_populates="measure", sa_relationship_kwargs={'uselist': False})

    wind_id: int | None = Field(default=None, foreign_key="wind.id")
    wind: Wind | None = Relationship(back_populates="measure", sa_relationship_kwargs={'uselist': False})

    battery_id: int | None = Field(default=None, foreign_key="battery.id")
    battery: Battery | None = Relationship(back_populates="measure", sa_relationship_kwargs={'uselist': False})

class Token(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    token: str
    created_at: datetime | None = None
    expired_at: datetime
