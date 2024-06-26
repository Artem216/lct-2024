from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm


from schemas.auth_schemas import AccessToken, Signup
from services.user_service import add_user, get_user_by_email
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
) -> AccessToken:
    """
    Регистрация нового пользователя.

    Данный эндпойнт служит для регистрации нового пользователя в системе. Принимает на вход объект Signup,
    содержащий данные для регистрации, и возвращает объект AccessToken, содержащий JWT-токен доступа.

    Args:
        signup_data (Signup): Данные для регистрации нового пользователя.

    Returns:
        AccessToken: Объект, содержащий JWT-токен доступа.

    Raises:
        HTTPException: Если произошла ошибка при регистрации пользователя.
    """
    try:
        signup_data.password = get_password_hash(signup_data.password)
        user = await add_user(signup_data)
        return AccessToken(access_token=create_access_jwt(user.id), is_admin= user.is_admin)
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=AccessToken, status_code=status.HTTP_200_OK)
async def login(
    login_data: OAuth2PasswordRequestForm = Depends(),
) -> AccessToken:
    """
    Вход в систему.

    Данный эндпойнт служит для входа пользователя в систему. Принимает на вход объект OAuth2PasswordRequestForm,
    содержащий данные для входа (email и пароль), и возвращает объект AccessToken, содержащий JWT-токен доступа.

    Args:
        login_data (OAuth2PasswordRequestForm): Данные для входа в систему.

    Returns:
        AccessToken: Объект, содержащий JWT-токен доступа.

    Raises:
        HTTPException:
            - Если пользователь с указанным email не найден.
            - Если пароль пользователя неверен.
    """

    user = await get_user_by_email(email=login_data.username)
    if not user:
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
    return AccessToken(access_token=access_token, is_admin= user.is_admin)