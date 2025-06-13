#!/usr/bin/env python3

import string
import tkinter
from Cryptodome.Random import get_random_bytes
from database import engine, Token
from sqlmodel import Session
from datetime import datetime, timedelta

from config import settings

def generate_random_string(length):
    # Generate random bytes
    random_bytes = get_random_bytes(length)
    
    # Convert bytes to a human-readable string
    characters = string.ascii_letters + string.digits
    random_string = ''.join(characters[byte % len(characters)] for byte in random_bytes)
    
    return random_string

def generate_token():
    return generate_random_string(settings.token_size)

def show_token(my_token: str):
    window = tkinter.Tk()
    window.title("Token")
    window.minsize(width=200, height=50)
    msg = tkinter.Label(window, text=my_token, font=("",16))
    msg.pack()
    window.mainloop()

my_token = generate_token()
with Session(engine) as session:
    token_reg = Token(
            token=my_token,
            expired_at=datetime.now() + timedelta(days=settings.token_lifespan)
            )
    session.add(token_reg)
    session.commit()
print(my_token)
show_token(my_token)
