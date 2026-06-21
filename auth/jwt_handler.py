from datetime import datetime, timedelta, UTC
from jose import jwt
from app.setting import get_setting


setting = get_setting()

SECRET_KEY = setting.secret_key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES = 30

def encode_access_token(data : dict):

    to_encode = data.copy()

    expire = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRES)

    to_encode.update({"exp" : expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token : str):

    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])