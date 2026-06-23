from datetime import datetime, timedelta, UTC
from jose import jwt, JWTError
from app.setting import get_setting

setting = get_setting()

SECRET_KEY = setting.secret_key
ALGORITHM = "HS256"
EXPIRE_TIME = 30

def encode_access_token(user : dict):

    to_encode = user.copy()
    expire = datetime.now(UTC) + timedelta(minutes= EXPIRE_TIME)
    to_encode.update({"exp" : expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):

    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    
    except JWTError:
        return None