#!/bin/bash

# Pipeline MapReduce complet pour SmartCity
# Exécute tous les jobs dans l'ordre


set -e  # Arrêter si erreur

echo " ===== PIPELINE MAPREDUCE SMARTCITY ====="
echo ""

# Variables
HADOOP_HOME=${HADOOP_HOME:-/usr/local/hadoop}
PROJECT_DIR=$(dirname $(dirname $(realpath $0)))
MAPREDUCE_DIR="$PROJECT_DIR/mapreduce"
SCRIPTS_DIR="$PROJECT_DIR/scripts"

# Chemins HDFS
HDFS_RAW="/urban_data/raw"
HDFS_CLEANED="/urban_data/cleaned"
HDFS_AGGREGATED="/urban_data/aggregated"
HDFS_ALERTS="/urban_data/alerts"

echo "   Répertoires:"
echo "   Project: $PROJECT_DIR"
echo "   MapReduce: $MAPREDUCE_DIR"
echo ""


# ÉTAPE 1: Export MongoDB → HDFS

echo " ÉTAPE 1/3: Export MongoDB → HDFS"
echo "────────────────────────────────────"

python3 "$SCRIPTS_DIR/mongodb_to_hdfs.py"

if [ $? -eq 0 ]; then
    echo "Export MongoDB terminé"
else
    echo " Erreur lors de l'export MongoDB"
    exit 1
fi

echo ""


# ÉTAPE 2: Job MapReduce - Nettoyage & Fusion

echo " ÉTAPE 2/3: MapReduce - Nettoyage & Fusion"
echo "──────────────────────────────────────────"

# Supprimer ancien output
hdfs dfs -rm -r -f $HDFS_CLEANED

# Exécuter Hadoop Streaming
hadoop jar $HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-*.jar \
    -files "$MAPREDUCE_DIR/mapper_clean.py,$MAPREDUCE_DIR/reducer_fusion.py" \
    -mapper "python mapper_clean.py" \
    -reducer "python reducer_fusion.py" \
    -input "$HDFS_RAW/*.json" \
    -output "$HDFS_CLEANED"

if [ $? -eq 0 ]; then
    echo " Job 1 terminé: Données nettoyées"
    echo "   Output: $HDFS_CLEANED"
else
    echo " Erreur Job 1"
    exit 1
fi

echo ""


# ÉTAPE 3: Job MapReduce - Agrégation par Zone

echo " ÉTAPE 3/3: MapReduce - Agrégation par Zone"
echo "───────────────────────────────────────────"

# Supprimer ancien output
hdfs dfs -rm -r -f $HDFS_AGGREGATED

# Exécuter Hadoop Streaming
hadoop jar $HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-*.jar \
    -files "$MAPREDUCE_DIR/mapper_aggregate_zone.py,$MAPREDUCE_DIR/reducer_aggregate_zone.py" \
    -mapper "python mapper_aggregate_zone.py" \
    -reducer "python reducer_aggregate_zone.py" \
    -input "$HDFS_CLEANED/part-*" \
    -output "$HDFS_AGGREGATED"

if [ $? -eq 0 ]; then
    echo " Job 2 terminé: Agrégation par zone"
    echo "   Output: $HDFS_AGGREGATED"
else
    echo " Erreur Job 2"
    exit 1
fi

echo ""


# Afficher les résultats

echo "RÉSULTATS FINAUX"
echo "────────────────────────────────────"
echo ""
echo "Structure HDFS:"
hdfs dfs -ls -R /urban_data

echo ""
echo "Exemple de résultats (10 premières lignes):"
hdfs dfs -cat "$HDFS_AGGREGATED/part-*" | head -10

echo ""
echo " ===== PIPELINE TERMINÉ AVEC SUCCÈS ====="
echo ""
echo "Les résultats sont disponibles dans:"
echo "   $HDFS_AGGREGATED"
echo ""
echo " L'API peut maintenant les lire pour alimenter le frontend"