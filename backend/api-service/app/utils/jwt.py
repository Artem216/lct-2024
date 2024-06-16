from datetime import timedelta, datetime

from fastapi import  HTTPException, status

from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from config import cfg



CredentialException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    hashed_password = pwd_context.hash(password)
    return hashed_password


def create_access_jwt(user_id: int, expires_delta: timedelta | None = None) -> str:
    """Creating access JWT token Creating access JWT token for user with id"""
    to_encode = {"sub": str(user_id)}
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=cfg.access_token_expire_minutes
        )
    to_encode["exp"] = expire
    encoded_jwt = jwt.encode(
        to_encode, cfg.secret_key, algorithm=cfg.algorithm
    )
    return encoded_jwt



def decode_jwt(token: str | None = None) -> int | None:
    if token is None:
        raise CredentialException
    try:
        payload = jwt.decode(
            token, cfg.secret_key, algorithms=cfg.algorithm
        )
        user_id = payload.get("sub")
        expire_time = payload.get("exp")

        if user_id is None:
            raise CredentialException
            
        return int(user_id)
    except JWTError:
        # logger.debug("JWTError")
        raise CredentialException