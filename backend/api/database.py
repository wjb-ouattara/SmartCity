from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from config import settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None
    
    # Collections
    emissions = None
    gps = None
    lieux = None

# Instance globale
mongodb = MongoDB()

async def connect_to_mongodb():
    """Connexion à MongoDB au démarrage"""
    try:
        logger.info(" Connexion à MongoDB...")
        
        # Client asynchrone pour FastAPI
        mongodb.client = AsyncIOMotorClient(settings.MONGODB_URL)
        mongodb.db = mongodb.client[settings.MONGODB_DB_NAME]
        
        # Collections
        mongodb.emissions = mongodb.db[settings.COLLECTION_EMISSIONS]
        mongodb.gps = mongodb.db[settings.COLLECTION_GPS]
        mongodb.lieux = mongodb.db[settings.COLLECTION_LIEUX]
        
        # Test de connexion
        await mongodb.client.admin.command('ping')
        logger.info(" Connecté à MongoDB avec succès")
        
        # Afficher les stats
        emissions_count = await mongodb.emissions.count_documents({})
        gps_count = await mongodb.gps.count_documents({})
        lieux_count = await mongodb.lieux.count_documents({})
        
        logger.info(f" Collections:")
        logger.info(f"  - Emissions: {emissions_count} documents")
        logger.info(f"  - GPS: {gps_count} documents")
        logger.info(f"  - Lieux: {lieux_count} documents")
        
    except Exception as e:
        logger.error(f" Erreur connexion MongoDB: {e}")
        raise

async def close_mongodb_connection():
    """Fermeture de la connexion"""
    try:
        if mongodb.client:
            mongodb.client.close()
            logger.info(" Connexion MongoDB fermée")
    except Exception as e:
        logger.error(f" Erreur fermeture MongoDB: {e}")

def get_database():
    """Dépendance pour obtenir la base de données"""
    return mongodb.db