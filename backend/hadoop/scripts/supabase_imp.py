import json
import psycopg2
import os

INPUT_FILE = "final_data.json"

def upload_to_supabase():
    print("🔌 Connexion à Supabase...")
    
    # UTILISER L'IP DIRECTEMENT au lieu du hostname
    # Cette IP a été résolue depuis un système qui fonctionne
    supabase_ip = "102.50.246.206"  # IP IPv4 de db.jwkgaeqhfdjucldrbcqa.supabase.co
    
    print(f"📍 Connexion directe à l'IP: {supabase_ip}")
    
    try:
        # Connexion avec l'adresse IP directe
        conn = psycopg2.connect(
            host=supabase_ip,
            port=5432,
            user="postgres",
            password="smartcity1234",
            database="postgres",
            connect_timeout=30,
            keepalives=1,
            keepalives_idle=30,
            keepalives_interval=10,
            keepalives_count=5
        )
        cur = conn.cursor()
        print("✅ Connecté à Supabase")
        
    except psycopg2.OperationalError as e:
        print(f"❌ Erreur de connexion PostgreSQL: {e}")
        print("💡 Solutions possibles:")
        print("   1. Vérifier que votre IP est autorisée dans Supabase Dashboard")
        print("   2. Aller sur: https://supabase.com/dashboard/project/jwkgaeqhfdjucldrbcqa/settings/database")
        print("   3. Désactiver 'SSL enforcement' ou ajouter votre IP publique")
        print("   4. Vérifier le mot de passe")
        return
    except Exception as e:
        print(f"❌ Erreur connexion: {e}")
        return

    # Récupérer les zones
    print("📍 Récupération des zones...")
    try:
        cur.execute("SELECT name, id FROM zones")
        zones_map = {row[0]: row[1] for row in cur.fetchall()}
        print(f"✅ Zones chargées: {len(zones_map)} trouvées")
        print(f"   Zones: {list(zones_map.keys())}")
    except Exception as e:
        print(f"❌ Erreur récupération zones: {e}")
        cur.close()
        conn.close()
        return

    # Lecture du fichier Hadoop
    data_to_insert = []
    print(f"📄 Lecture de {INPUT_FILE}...")
    
    if not os.path.exists(INPUT_FILE):
        print(f"❌ Fichier {INPUT_FILE} introuvable!")
        cur.close()
        conn.close()
        return
    
    try:
        line_count = 0
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
                        row = (
                            zone_id,
                            record.get('timestamp'),
                            stats.get('avg_speed_kmh', 0),
                            stats.get('avg_co2', 0),
                            stats.get('avg_noise_db', 0),
                            stats.get('congestion_level', 'Inconnu'),
                            stats.get('pollution_level', 'Inconnu'),
                            stats.get('noise_level', 'Inconnu'),
                            stats.get('vehicle_count', 0),
                            stats.get('avg_co', 0),
                            stats.get('avg_nox', 0),
                            stats.get('avg_pmx', 0)
                        )
                        data_to_insert.append(row)
                except json.JSONDecodeError as e:
                    print(f"⚠️  Ligne {line_count} invalide: {e}")
                    continue
                    
        print(f"✅ {len(data_to_insert)} enregistrements prêts à être insérés")
        
    except Exception as e:
        print(f"❌ Erreur lecture fichier: {e}")
        cur.close()
        conn.close()
        return

    # Insertion
    if not data_to_insert:
        print("⚠️  Rien à insérer")
        cur.close()
        conn.close()
        return

    print(f"📤 Envoi de {len(data_to_insert)} stats vers Supabase...")

    sql = """
        INSERT INTO traffic_stats 
        (zone_id, timestamp, avg_speed, avg_co2, avg_noise, 
         congestion_level, pollution_level, noise_level, vehicle_count, 
         avg_co, avg_nox, avg_pmx) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    try:
        # Insertion par lots pour de meilleures performances
        batch_size = 1000
        total_inserted = 0
        
        for i in range(0, len(data_to_insert), batch_size):
            batch = data_to_insert[i:i + batch_size]
            cur.executemany(sql, batch)
            conn.commit()
            total_inserted += len(batch)
            print(f"   ✓ {total_inserted}/{len(data_to_insert)} insérés...")
        
        print(f"✅ SUCCÈS - {total_inserted} enregistrements insérés")
        
    except psycopg2.IntegrityError as e:
        print(f"⚠️  Erreur d'intégrité (doublons?): {e}")
        conn.rollback()
    except Exception as e:
        print(f"❌ Erreur SQL: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()
        print("🔌 Connexion fermée")


if __name__ == "__main__":
    upload_to_supabase()