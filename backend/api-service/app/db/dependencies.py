from fastapi import Depends, HTTPException, status

from schemas.user_schemas import UserDto

from utils.jwt import decode_jwt, oauth2_scheme

from services.user_service import get_user_by_id


async def get_current_user(
    access_token: str | None = Depends(oauth2_scheme),
) -> UserDto | None:
    """
    Получение текущего авторизованного пользователя.

    Эта функция позволяет получить информацию о текущем авторизованном пользователе на основе предоставленного токена доступа. Если токен не предоставлен или является недействительным, будет вызвано исключение HTTPException с кодом 401 (Неавторизован).

    Args:
        access_token (str | None): Токен доступа, используемый для аутентификации пользователя. Если токен не предоставлен, будет использован токен, полученный из `oauth2_scheme`.

    Returns:
        UserDto | None: Объект UserDto, содержащий информацию о текущем авторизованном пользователе. Если пользователь не найден, будет возвращено значение `None`.

    Raises:
        HTTPException: Если токен доступа не предоставлен или является недействительным.
    """
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated (current_user)",
    )
    
    user_id = decode_jwt(access_token)

    return UserDto.model_validate(await get_user_by_id(user_id))