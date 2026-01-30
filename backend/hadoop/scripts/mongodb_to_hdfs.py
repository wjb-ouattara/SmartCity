#!/usr/bin/env python3
"""
Script d'export MongoDB vers HDFS
Exporte toutes les collections vers HDFS en format JSON
"""

import json
import subprocess
import sys
from pymongo import MongoClient
import logging

# Configuration
# Pour WSL: utiliser l'IP Windows au lieu de localhost
# Trouvez votre IP avec: ip route show | grep -i default | awk '{ print $3}'
MONGODB_URL = (
    "mongodb+srv://wahonjeanbaptisteouattara954_db_user:ftQhDdx9al31VFAh@voiture.onknxqh.mongodb.net/SumoBigData?retryWrites=true&w=majority&appName=voiture"
)

DB_NAME = "SumoBigData"
HDFS_BASE_PATH = "/urban_data/raw"

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def export_collection_to_hdfs(collection_name, hdfs_path):
    """
    Exporte une collection MongoDB vers HDFS
    
    Args:
        collection_name: Nom de la collection MongoDB
        hdfs_path: Chemin HDFS de destination
    """
    try:
        logger.info(f" Export de la collection '{collection_name}'...")
        
        # Connexion MongoDB
        client = MongoClient(MONGODB_URL)
        db = client[DB_NAME]
        collection = db[collection_name]
        
        # Compter les documents
        count = collection.count_documents({})
        logger.info(f"   {count} documents trouvés")
        
        if count == 0:
            logger.warning(f" Collection '{collection_name}' vide, skip")
            return
        
        # Créer fichier temporaire local
        local_file = f"/tmp/{collection_name}.json"
        
        with open(local_file, 'w') as f:
            cursor = collection.find({})
            for doc in cursor:
                # Supprimer _id MongoDB (non JSON sérialisable)
                if '_id' in doc:
                    del doc['_id']
                # Écrire une ligne par document
                f.write(json.dumps(doc) + '\n')
        
        logger.info(f" Fichier local créé: {local_file}")
        
        # Créer le répertoire HDFS si nécessaire
        subprocess.run(
            ['hdfs', 'dfs', '-mkdir', '-p', HDFS_BASE_PATH],
            check=False,
            capture_output=True
        )
        
        # Supprimer l'ancien fichier HDFS s'il existe
        subprocess.run(
            ['hdfs', 'dfs', '-rm', '-f', hdfs_path],
            check=False,
            capture_output=True
        )
        
        # Copier vers HDFS
        result = subprocess.run(
            ['hdfs', 'dfs', '-put', local_file, hdfs_path],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            logger.info(f" Copié vers HDFS: {hdfs_path}")
        else:
            logger.error(f" Erreur HDFS: {result.stderr}")
            return
        
        # Supprimer le fichier local temporaire
        subprocess.run(['rm', local_file], check=False)
        
        # Vérifier la copie
        check_result = subprocess.run(
            ['hdfs', 'dfs', '-ls', hdfs_path],
            capture_output=True,
            text=True
        )
        
        if check_result.returncode == 0:
            logger.info(f" Vérification OK")
        
    except Exception as e:
        logger.error(f" Erreur export '{collection_name}': {e}")
        raise

def main():
    """Fonction principale"""
    logger.info(" Démarrage export MongoDB → HDFS")
    logger.info(f"   MongoDB: {MONGODB_URL}")
    logger.info(f"   Database: {DB_NAME}")
    logger.info(f"   HDFS: {HDFS_BASE_PATH}")
    
    collections = [
        ('emissions', f'{HDFS_BASE_PATH}/emissions.json'),
        ('gps', f'{HDFS_BASE_PATH}/gps.json'),
        ('lieux', f'{HDFS_BASE_PATH}/lieux.json')
    ]
    
    for collection_name, hdfs_path in collections:
        export_collection_to_hdfs(collection_name, hdfs_path)
    
    logger.info(" Export terminé avec succès !")
    
    # Afficher la structure HDFS
    logger.info("\n Structure HDFS:")
    subprocess.run(['hdfs', 'dfs', '-ls', '-R', HDFS_BASE_PATH])

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        logger.error(f" Erreur fatale: {e}")
        sys.exit(1)