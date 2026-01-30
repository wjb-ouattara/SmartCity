from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from config import settings
from database import connect_to_mongodb, close_mongodb_connection

# Import routes
from routes import traffic, pollution, noise, alerts, analytics

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(" Démarrage de l'API SmartCity...")
    await connect_to_mongodb()
    yield
    # Shutdown
    logger.info(" Arrêt de l'API SmartCity...")
    await close_mongodb_connection()

# Application FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API Big Data pour SmartCity Casablanca - Surveillance urbaine intelligente",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(traffic.router, prefix="/api/traffic", tags=["Traffic"])
app.include_router(pollution.router, prefix="/api/pollution", tags=["Pollution"])
app.include_router(noise.router, prefix="/api/noise", tags=["Noise"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

# Route santé
@app.get("/")
async def root():
    return {
        "message": "SmartCity API - Système de surveillance urbaine",
        "version": settings.APP_VERSION,
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mongodb": "connected",
        "hadoop": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        log_level="info"
    )