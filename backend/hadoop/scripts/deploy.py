import subprocess
import os
import sys
import platform

# ====================================================================
# CONFIGURATION
# ====================================================================

MODE_INSTALLATION = "NATIVE"  # "NATIVE" ou "DOCKER" (uniquement pour Linux/WSL)
CONTAINER_NAME = "namenode"   # si DOCKER
HDFS_PATH = "/urban_data/aggregated/part-00000"
UPLOADER_SCRIPT = "supabase_imp.py"
LOCAL_FILE = "final_data.json"

# ====================================================================
# FONCTIONS UTILES
# ====================================================================

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

# ====================================================================
# MAIN
# ====================================================================

def main():
    print("\nDÉPLOIEMENT AUTOMATISÉ\n")

    # Supprimer ancien fichier
    if os.path.exists(LOCAL_FILE):
        os.remove(LOCAL_FILE)
        print(f"Suppression de l'ancien '{LOCAL_FILE}' local.")

    # Détection OS pour savoir si Hadoop peut être utilisé
    current_os = platform.system()
    if current_os.lower() in ["linux"]:

        # Linux/WSL : on peut récupérer depuis Hadoop
        if MODE_INSTALLATION == "DOCKER":
            cmd_extract = f"docker cp {CONTAINER_NAME}:{HDFS_PATH} ./{LOCAL_FILE}"
        elif MODE_INSTALLATION == "NATIVE":
            cmd_extract = f"hdfs dfs -get {HDFS_PATH} ./{LOCAL_FILE}"
        else:
            print(" ERREUR CONFIG : MODE_INSTALLATION doit être 'DOCKER' ou 'NATIVE'")
            sys.exit(1)

        run_step("Récupération des données Hadoop", cmd_extract)

    else:
        # Windows : on suppose que le fichier est déjà copié
        if not os.path.exists(LOCAL_FILE):
            print(f"  Attention : '{LOCAL_FILE}' introuvable. Copie-le depuis Hadoop.")
        else:
            print(f" Fichier '{LOCAL_FILE}' trouvé. Passage à Supabase...")

    # Vérifier que le fichier existe
    if not os.path.exists(LOCAL_FILE) or os.path.getsize(LOCAL_FILE) == 0:
        print(f" Le fichier '{LOCAL_FILE}' est vide ou introuvable.")
        sys.exit(1)

    # Lancer le script d'upload vers Supabase
    cmd_upload = f'"{sys.executable}" {UPLOADER_SCRIPT}'
    run_step("Injection vers Supabase", cmd_upload)

    print("\n Données envoyées avec succès !")

if __name__ == "__main__":
    main()
