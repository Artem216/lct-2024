from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from schemas.auth_schemas import AccessToken, Signup
# from src.db.dependencies import get_user_repository
from services.user_service import add_user, get_user

# from src.user.repository import UserRepository
# from src.utils.logger import conf_logger as logger

from utils.jwt import create_access_jwt, get_password_hash, verify_password



CredentialException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)



router = APIRouter(prefix="", tags=["auth"])


@router.post("/signup", response_model=AccessToken, status_code=status.HTTP_201_CREATED)
async def signup(
    signup_data: Signup,
    # repository: UserRepository = Depends(get_user_repository),
) -> AccessToken:
    try:
        print(123123123)
        signup_data.password = get_password_hash(signup_data.password)
        user = await add_user(signup_data)
        print(user.id)
        # user = repository.add(signup_data)
        return AccessToken(access_token=create_access_jwt(user.id))
    except Exception as e:
        # logger.debug(str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=AccessToken, status_code=status.HTTP_200_OK)
async def login(
    login_data: OAuth2PasswordRequestForm = Depends(),
    # repository: UserRepository = Depends(get_user_repository),
) -> AccessToken:
    # logger.debug("loggingx attempt %s", login_data.username)
    user = await get_user(email=login_data.username)
    # user = repository.get(email=login_data.username)
    if not user:
        # logger.debug("User with this email does not exist")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with this email does not exist",
        )
    if not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
        )
    access_token = create_access_jwt(user.id)
    return AccessToken(access_token=access_token)