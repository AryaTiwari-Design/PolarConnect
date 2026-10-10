from pydantic import BaseModel, Field

class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: str = Field(min_length=5, max_length=254)
    password: str = Field(min_length=8, max_length=128)

class LoginRequest(BaseModel):
    email: str
    password: str

class PolarDataCreate(BaseModel):
    observation_date: str
    location: str = Field(min_length=1, max_length=120)
    latitude: float | None = None
    longitude: float | None = None
    temperature_c: float | None = None
    wind_speed_m_s: float | None = None
    source: str = "manual entry"
