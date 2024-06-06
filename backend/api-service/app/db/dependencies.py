from fastapi import Depends, HTTPException, status

from schemas.user_schemas import UserDto

from utils.jwt import decode_jwt, oauth2_scheme

from services.user_service import get_user_by_id


async def get_current_user(
    access_token: str | None = Depends(oauth2_scheme),
) -> UserDto | None:
    
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated (current_user)",
    )
    
    user_id = decode_jwt(access_token)

    return UserDto.model_validate(await get_user_by_id(user_id))