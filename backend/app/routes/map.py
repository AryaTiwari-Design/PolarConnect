from fastapi import APIRouter, Depends, HTTPException

from ..database import load_json_data
from ..deps import current_user

router = APIRouter(prefix="/stations", tags=["stations"])


@router.get("")
def stations(user=Depends(current_user)):
    return load_json_data("stations.json")


@router.get("/{station_id}")
def station(station_id: int, user=Depends(current_user)):
    match = next((item for item in load_json_data("stations.json") if item["id"] == station_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Station not found")
    return match
