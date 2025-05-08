from models import Solar, Wind, Battery, Measure, Token
from sqlmodel import SQLModel, create_engine

from config import settings


engine = create_engine(settings.db_url, echo=settings.db_echo)

def create_db():
    SQLModel.metadata.create_all(engine)
