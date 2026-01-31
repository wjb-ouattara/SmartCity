"""
Upload vers Supabase via API REST
Contourne tous les problèmes de réseau, SSL, et IP bloquée
"""

import json
import requests
import os
from typing import List, Dict

INPUT_FILE = "final_data.json"

# ============================================
# CONFIGURATION SUPABASE
# ============================================
SUPABASE_URL = "https://jwkgaeqhfdjucldrbcqa.supabase.co"

#la clé publique (anon) - à ne pas partager publiquement si possible
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3a2dhZXFoZmRqdWNsZHJiY3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3Nzc4NjMsImV4cCI6MjA4NTM1Mzg2M30.Z1BPa_QI1dnE9WMbUWNAuIB0w47S7T6d9Os3VvFX-fI"

# ============================================
# FONCTIONS
# ============================================

def get_zones_map() -> Dict[str, int]:
    """Récupère les zones depuis Supabase via API REST"""
    print(" Récupération des zones via API REST...")
    
    url = f"{SUPABASE_URL}/rest/v1/zones?select=id,name"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        zones = response.json()
        zones_map = {zone['name']: zone['id'] for zone in zones}
        
        print(f" {len(zones_map)} zones récupérées")
        print(f"   Zones: {list(zones_map.keys())}")
        
        return zones_map
        
    except requests.exceptions.RequestException as e:
        print(f" Erreur récupération zones: {e}")
        print(f" Response: {e.response.text if hasattr(e, 'response') and e.response else 'N/A'}")
        print(" Vérifiez que SUPABASE_KEY est correcte")
        return {}
    except Exception as e:
        print(f" Erreur: {e}")
        return {}


def upload_batch(data_batch: List[Dict]) -> bool:
    """Upload un lot de données vers Supabase"""
    url = f"{SUPABASE_URL}/rest/v1/traffic_stats"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    try:
        response = requests.post(url, json=data_batch, headers=headers, timeout=60)
        
        if response.status_code == 201:
            return True
        elif response.status_code == 409:
            print(f" Doublons détectés (ignorés)")
            return True
        else:
            print(f" Erreur HTTP {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print(f" Timeout - Réessayer avec batch plus petit")
        return False
    except Exception as e:
        print(f" Erreur upload: {e}")
        return False


def upload_to_supabase_rest():
    """Upload vers Supabase via API REST"""
    print("="*60)
    print("UPLOAD VERS SUPABASE VIA API REST")
    print("="*60)
    print()
    
    # Afficher la clé (premiers caractères seulement)
    print(f" Clé API: {SUPABASE_KEY[:30]}...{SUPABASE_KEY[-10:]}")
    print()
    
    # Récupérer les zones
    zones_map = get_zones_map()
    if not zones_map:
        print(" Impossible de récupérer les zones")
        print()
        print("Vérifications à faire:")
        print("   1. La table 'zones' existe dans Supabase")
        print("   2. La clé API est correcte")
        print("   3. Vous avez une connexion internet")
        return
    
    # Lecture du fichier
    print()
    print(f"Lecture de {INPUT_FILE}...")
    
    if not os.path.exists(INPUT_FILE):
        print(f" Fichier {INPUT_FILE} introuvable!")
        print(f" Assurez-vous d'être dans le bon répertoire:")
        print(f"   cd /mnt/c/Users/lenovo/Desktop/SmartCity/backend/hadoop/scripts")
        return
    
    data_to_insert = []
    line_count = 0
    errors = 0
    
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                if not line.strip():
                    continue
                
                line_count += 1
                try:
                    record = json.loads(line)
                    stats = record.get('stats', {})
                    zone_name = record.get('zone')
                    zone_id = zones_map.get(zone_name, zones_map.get('Autre'))
                    
                    if zone_id:
                        row = {
                            "zone_id": zone_id,
                            "timestamp": record.get('timestamp'),
                            "avg_speed": stats.get('avg_speed_kmh', 0),
                            "avg_co2": stats.get('avg_co2', 0),
                            "avg_noise": stats.get('avg_noise_db', 0),
                            "congestion_level": stats.get('congestion_level', 'Inconnu'),
                            "pollution_level": stats.get('pollution_level', 'Inconnu'),
                            "noise_level": stats.get('noise_level', 'Inconnu'),
                            "vehicle_count": stats.get('vehicle_count', 0),
                            "avg_co": stats.get('avg_co', 0),
                            "avg_nox": stats.get('avg_nox', 0),
                            "avg_pmx": stats.get('avg_pmx', 0)
                        }
                        data_to_insert.append(row)
                    else:
                        errors += 1
                        
                except json.JSONDecodeError as e:
                    errors += 1
                    if errors <= 5:
                        print(f"Ligne {line_count} invalide: {e}")
                    continue
                except Exception as e:
                    errors += 1
                    if errors <= 5:
                        print(f"  Erreur ligne {line_count}: {e}")
                    continue
        
        print(f" {len(data_to_insert)} enregistrements valides")
        if errors > 0:
            print(f" {errors} lignes ignorées (erreurs)")
        
    except Exception as e:
        print(f"Erreur lecture fichier: {e}")
        return
    
    if not data_to_insert:
        print("⚠️  Rien à insérer")
        return
    
    # Upload par lots
    print()
    print(f" Upload de {len(data_to_insert)} enregistrements vers Supabase...")
    print()
    
    # Taille des lots (API REST a limite ~1000 lignes)
    batch_size = 500
    total_inserted = 0
    failed_batches = 0
    
    for i in range(0, len(data_to_insert), batch_size):
        batch = data_to_insert[i:i + batch_size]
        batch_num = (i // batch_size) + 1
        total_batches = (len(data_to_insert) + batch_size - 1) // batch_size
        
        print(f"  Lot {batch_num}/{total_batches} ({len(batch)} enregistrements)...", end=" ")
        
        if upload_batch(batch):
            total_inserted += len(batch)
            print(f"✅")
        else:
            failed_batches += 1
            print(f"❌")
            
            # Si trop d'échecs, arrêter
            if failed_batches >= 3:
                print()
                print(f" Trop d'échecs consécutifs, arrêt de l'upload")
                break
    
    # Résumé
    print()
    print("="*60)
    if total_inserted == len(data_to_insert):
        print("✅ UPLOAD TERMINÉ AVEC SUCCÈS!")
    elif total_inserted > 0:
        print("⚠️  UPLOAD PARTIEL")
    else:
        print("❌ ÉCHEC DE L'UPLOAD")
    print("="*60)
    print(f"   Total traité: {len(data_to_insert)} enregistrements")
    print(f"   Insérés: {total_inserted}")
    print(f"   Échecs: {len(data_to_insert) - total_inserted}")
    print("="*60)


if __name__ == "__main__":
    # Vérifier que requests est installé
    try:
        import requests
    except ImportError:
        print("❌ Module 'requests' non installé")
        print("📦 Installation: pip install requests")
        exit(1)
    
    upload_to_supabase_rest()