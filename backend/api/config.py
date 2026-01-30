from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "SmartCity API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017/"  # Votre cluster MongoDB
    MONGODB_DB_NAME: str = "SumoBigData"
    
    # Collections MongoDB
    COLLECTION_EMISSIONS: str = "emissions"
    COLLECTION_GPS: str = "gps"
    COLLECTION_LIEUX: str = "lieux"
    
    # HDFS
    HDFS_URL: str = "http://localhost:9870"
    HDFS_USER: str = "hadoop"
    HDFS_BASE_PATH: str = "/urban_data"
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    # Seuils d'alerte
    ALERT_THRESHOLDS: dict = {
        "traffic": {
            "speed_low": 20,      # km/h - trafic très dense
            "speed_medium": 40,   # km/h - trafic modéré
        },
        "pollution": {
            "co2_high": 1000,     # ppm
            "co_high": 50,        # ppm
            "nox_high": 1.0,      # ppm
            "pmx_high": 100,      # µg/m³
        },
        "noise": {
            "low": 55,            # dB
            "medium": 70,         # dB
            "high": 85,           # dB
        }
    }
    
    # Zones de Casablanca (coordonnées approximatives)
    ZONES: dict = {
        "maarif": {"name": "Maarif", "lat": 33.5731, "lon": -7.6298},
        "anfa": {"name": "Anfa", "lat": 33.5822, "lon": -7.6394},
        "ain_diab": {"name": "Ain Diab", "lat": 33.5892, "lon": -7.6856},
        "bourgogne": {"name": "Bourgogne", "lat": 33.5731, "lon": -7.5898},
        "hay_hassani": {"name": "Hay Hassani", "lat": 33.5628, "lon": -7.5898},
    }
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()