from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# ============ Modèles MongoDB ============

class EmissionsData(BaseModel):
    co2: float
    co: float
    nox: float
    pmx: float
    noise: float
    fuel: float

class VehicleEmission(BaseModel):
    timestamp: int
    vehicule_id: str
    emissions: EmissionsData

class Position(BaseModel):
    x: float
    y: float
    angle: float

class VehicleGPS(BaseModel):
    timestamp: int
    vehicule_id: str
    position: Position
    speed: float
    emissions: EmissionsData

class Lieu(BaseModel):
    nom: str
    type: str
    x: float
    y: float
    osm_id: int

# ============ Modèles API Response ============

class TrafficDataPoint(BaseModel):
    zone: str
    latitude: float
    longitude: float
    speed_kmh: float
    vehicle_count: int
    congestion_level: str  # fluide, modéré, dense, très dense
    timestamp: str

class PollutionDataPoint(BaseModel):
    zone: str
    latitude: float
    longitude: float
    aqi: int
    pm25: float
    pm10: float
    co2: float
    no2: float
    quality: str  # Bon, Modéré, Mauvais, Dangereux
    timestamp: str

class NoiseDataPoint(BaseModel):
    zone: str
    latitude: float
    longitude: float
    decibels: float
    level: str  # Faible, Modéré, Élevé, Très Élevé
    timestamp: str

class Alert(BaseModel):
    id: str
    type: str  # traffic, pollution, noise
    title: str
    description: str
    severity: str  # low, medium, high, critical
    zone: str
    latitude: float
    longitude: float
    value: float
    threshold: float
    timestamp: str
    status: str = "active"  # active, acknowledged, resolved

class DashboardStats(BaseModel):
    traffic: dict
    pollution: dict
    noise: dict
    alerts: dict
    timestamp: str

class AnalyticsData(BaseModel):
    hourly_trends: List[dict]
    zone_distribution: List[dict]
    top_issues: List[dict]
    performance_metrics: List[dict]