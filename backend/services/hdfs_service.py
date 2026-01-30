"""
Service pour lire les résultats MapReduce depuis HDFS
"""

import subprocess
import json
import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

class HDFSService:
    """Service pour interagir avec HDFS"""
    
    @staticmethod
    def read_hdfs_file(hdfs_path: str) -> str:
        """
        Lit un fichier HDFS et retourne son contenu
        
        Args:
            hdfs_path: Chemin HDFS du fichier
            
        Returns:
            Contenu du fichier en string
        """
        try:
            result = subprocess.run(
                ['hdfs', 'dfs', '-cat', hdfs_path],
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout
        except subprocess.CalledProcessError as e:
            logger.error(f" Erreur lecture HDFS {hdfs_path}: {e.stderr}")
            raise Exception(f"Impossible de lire {hdfs_path}")
    
    @staticmethod
    def read_aggregated_data(timestamp: Optional[int] = None) -> List[Dict]:
        """
        Lit les données agrégées par zone depuis HDFS
        
        Args:
            timestamp: Timestamp spécifique (optionnel)
            
        Returns:
            Liste des statistiques par zone
        """
        try:
            # Lire tous les fichiers résultats du MapReduce
            hdfs_path = "/urban_data/aggregated/part-*"
            content = HDFSService.read_hdfs_file(hdfs_path)
            
            # Parser les lignes JSON
            results = []
            for line in content.strip().split('\n'):
                if line:
                    try:
                        data = json.loads(line)
                        # Filtrer par timestamp si spécifié
                        if timestamp is None or data.get('timestamp') == timestamp:
                            results.append(data)
                    except json.JSONDecodeError:
                        logger.warning(f" Ligne JSON invalide: {line[:50]}...")
                        continue
            
            logger.info(f" {len(results)} résultats lus depuis HDFS")
            return results
            
        except Exception as e:
            logger.error(f" Erreur lecture données agrégées: {e}")
            return []
    
    @staticmethod
    def get_available_timestamps() -> List[int]:
        """
        Récupère la liste de tous les timestamps disponibles
        
        Returns:
            Liste triée des timestamps
        """
        try:
            data = HDFSService.read_aggregated_data()
            timestamps = sorted(set(d.get('timestamp', 0) for d in data))
            return timestamps
        except Exception as e:
            logger.error(f" Erreur récupération timestamps: {e}")
            return []
    
    @staticmethod
    def get_latest_timestamp() -> int:
        """
        Récupère le timestamp le plus récent
        
        Returns:
            Timestamp le plus récent
        """
        timestamps = HDFSService.get_available_timestamps()
        return timestamps[-1] if timestamps else 0
    
    @staticmethod
    def get_zone_stats_by_timestamp(timestamp: int) -> Dict[str, Dict]:
        """
        Récupère les stats de toutes les zones pour un timestamp donné
        
        Args:
            timestamp: Le timestamp
            
        Returns:
            Dict avec zone comme clé et stats comme valeur
        """
        data = HDFSService.read_aggregated_data(timestamp)
        
        # Réorganiser par zone
        zone_stats = {}
        for item in data:
            zone = item.get('zone')
            if zone:
                zone_stats[zone] = item.get('stats', {})
        
        return zone_stats

# Instance globale
hdfs_service = HDFSService()