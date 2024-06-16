import pytest
from httpx import AsyncClient
from fastapi import status
from app.main import app

@pytest.mark.asyncio
async def test_signup_success():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/signup", json={
            "email": "pytest@example.com",
            "password": "pytest",
            "name": "pytestClient"
        })
    assert response.status_code == status.HTTP_201_CREATED
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_signup_failure():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/signup", json={
            "email": "test@example.com",
            "password": "short"
        })
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.asyncio
async def test_login_success():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        await ac.post("/signup", json={
            "email": "login@example.com",
            "password": "string"
        })
        response = await ac.post("/login", data={
            "username": "login@example.com",
            "password": "string"
        })
    assert response.status_code == status.HTTP_200_OK
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_login_user_not_found():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/login", data={
            "username": "notfound@example.com",
            "password": "string"
        })
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.asyncio
async def test_login_incorrect_password():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        await ac.post("/signup", json={
            "email": "wrongpass@example.com",
            "password": "string"
        })
        response = await ac.post("/login", data={
            "username": "wrongpass@example.com",
            "password": "wrongpassword"
        })
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
