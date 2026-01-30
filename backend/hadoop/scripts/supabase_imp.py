import json
import psycopg2
import os

DB_URI = "postgresql://postgres:smartcity1234@db.jwkgaeqhfdjucldrbcqa.supabase.co:5432/postgres"
INPUT_FILE = "final_data.json"


def upload_to_supabase():
    print("🔌 Connexion à Supabase...")
    try:
        conn = psycopg2.connect(DB_URI)
        cur = conn.cursor()
        print("Connecté")
    except Exception as e:
        print(f" Erreur connexion  {e}")
        return

    # on recupe les donner des zones et on mets dans un tableau
    print(" Récupération des zones...")
    cur.execute("SELECT name, id FROM zones")
    zones_map = {row[0]: row[1] for row in cur.fetchall()}
    print(f"   -> Zones chargées : {len(zones_map)} trouvées.")

    #  LECTURE DU FICHIER HADOOP
    data_to_insert = []
    print(f"Lecture de {INPUT_FILE}...")
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                if not line.strip(): continue
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
                            # --- AJOUT DES NOUVEAUX POLLUANTS ICI ---
                            stats.get('avg_co', 0),
                            stats.get('avg_nox', 0),
                            stats.get('avg_pmx', 0)
                        )
                        data_to_insert.append(row)
                except json.JSONDecodeError:
                    continue
    except FileNotFoundError:
        print("Fichier introuvable")
        return

    # insertion
    if not data_to_insert:
        print(" Rien à insérer")
        return

    print(f"Envoi de {len(data_to_insert)} stats vers Supabase...")

    # On a ajouté les colonnes avg_co, avg_nox, avg_pmx à la fin
    sql = """
        INSERT INTO traffic_stats 
        (zone_id, timestamp, avg_speed, avg_co2, avg_noise, congestion_level, pollution_level, noise_level, vehicle_count, avg_co, avg_nox, avg_pmx) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    try:
        cur.executemany(sql, data_to_insert)
        conn.commit()
        print(" SUCCÈS")
    except Exception as e:
        print(f" Erreur SQL  {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    upload_to_supabase()