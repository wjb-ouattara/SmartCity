import subprocess
import os
import sys

# ==============================================================================
#  ZONE DE CONFIGURATION
# ==============================================================================

# QUESTION 1 : Comment as-tu installé Hadoop ?
# Mets "DOCKER" si tu utilises des conteneurs (comme moi).
# Mets "NATIVE" si tu as installé Hadoop directement sur ton Ubuntu.
MODE_INSTALLATION = "NATIVE"

# QUESTION 2 : Si tu es en mode DOCKER, quel est le nom du conteneur ?
# (Laisse tel quel si tu es en mode NATIVE, on s'en fiche)
CONTAINER_NAME = "namenode"

# QUESTION 3 : Où se trouve le fichier RÉSULTAT dans HDFS ?
# C'est le chemin à l'intérieur d'Hadoop.
# Exemple : /user/ton_nom/output/part-00000
HDFS_PATH = "/urban_data/aggregated/part-00000"

# QUESTION 4 : Où est ton script Python qui envoie vers Supabase ?
# Si le fichier est dans le même dossier, laisse juste le nom.
UPLOADER_SCRIPT = "supabase_imp.py"

# ==============================================================================
# FIN DE LA CONFIG (NE TOUCHE PLUS A RIEN EN DESSOUS SANS AVIS MÉDICAL)
# ==============================================================================

LOCAL_FILE = "final_data.json"


def run_step(description, command):
    print(f" {description}...")
    print(f"   [Commande] : {command}")
    try:
        subprocess.run(command, shell=True, check=True)
        print("OK.")
    except subprocess.CalledProcessError:
        print(f"\n ERREUR CRITIQUE lors de : {description}")
        print(" Vérifie tes chemins et si Hadoop est bien lancé !")
        sys.exit(1)


def main():
    print("\nDÉPLOIEMENT AUTOMATISÉ ")


    if os.path.exists(LOCAL_FILE):
        os.remove(LOCAL_FILE)
        print(f"Suppression de l'ancien '{LOCAL_FILE}' local.")
    cmd_extract = ""

    if MODE_INSTALLATION == "DOCKER":
        cmd_extract = f"docker cp {CONTAINER_NAME}:{HDFS_PATH} ./{LOCAL_FILE}"
    elif MODE_INSTALLATION == "NATIVE":
        cmd_extract = f"hdfs dfs -get {HDFS_PATH} ./{LOCAL_FILE}"
    else:
        print("ERREUR CONFIG : Le MODE_INSTALLATION doit être 'DOCKER' ou 'NATIVE'")
        sys.exit(1)
    run_step("Récupération des données Hadoop", cmd_extract)

    if not os.path.exists(LOCAL_FILE) or os.path.getsize(LOCAL_FILE) == 0:
        print(f"ERREUR : Le fichier '{LOCAL_FILE}' est vide ou introuvable après l'extraction.")
        sys.exit(1)
    cmd_upload = f'"{sys.executable}" {UPLOADER_SCRIPT}'
    run_step("Injection vers Supabase", cmd_upload)
    print("\nDonnées envoyée")
if __name__ == "__main__":
    main()