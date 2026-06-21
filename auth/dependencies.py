from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from auth.jwt_handler import decode_access_token

security = HTTPBearer()

def get_current_user(credetials : HTTPAuthorizationCredentials = Depends(security)):

    token = credetials.credentials

    try:

        payload = decode_access_token(token)
        username = payload.get("sub")

        if not username:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Token"
            )
        
        return username
    
    except Exception:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired or invalid"
        )
    
    