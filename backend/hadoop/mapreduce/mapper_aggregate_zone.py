#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Mapper: Agrégation par Zone et Timestamp
Input: Résultat de reducer_fusion.py (avec CO, NOx, PMx)
Output: (zone, timestamp) -> (speed, co2, noise, co, nox, pmx, count)
"""

import sys
import math

# Zones de Casablanca (coordonnées SUMO converties)
ZONES = {
    'Maarif': {'x_min': 7500, 'x_max': 8500, 'y_min': 6000, 'y_max': 7000},
    'Anfa': {'x_min': 6500, 'x_max': 7500, 'y_min': 6500, 'y_max': 7500},
    'Ain Diab': {'x_min': 5500, 'x_max': 6500, 'y_min': 6000, 'y_max': 7000},
    'Bourgogne': {'x_min': 8500, 'x_max': 9500, 'y_min': 6000, 'y_max': 7000},
    'Hay Hassani': {'x_min': 7000, 'x_max': 8000, 'y_min': 5000, 'y_max': 6000},
}

def get_zone(x, y):
    """Détermine la zone selon les coordonnées"""
    for zone_name, bounds in ZONES.items():
        if (bounds['x_min'] <= x <= bounds['x_max'] and 
            bounds['y_min'] <= y <= bounds['y_max']):
            return zone_name
    return 'Autre'

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    
    # Format attendu en entrée : 
    # vehicule_id | timestamp | x,y | co2,noise,fuel,co,nox,pmx
    parts = line.split('\t')
    
    # Ignorer les lignes LIEU (traitées séparément) ou incomplètes
    if parts[0] == 'LIEU' or len(parts) != 4:
        continue
    
    try:
        vehicule_id = parts[0]
        timestamp = int(parts[1])
        
        # Position (x,y)
        x, y = parts[2].split(',')
        x = float(x)
        y = float(y)
        
        # Emissions (Parsing Robuste)
        # On découpe la partie droite
        emi_parts = parts[3].split(',')
        
        # Les 3 classiques
        co2 = float(emi_parts[0])
        noise = float(emi_parts[1])
        fuel = float(emi_parts[2])
        
        # Les 3 nouveaux (avec sécurité si jamais ils manquent dans de vieilles données)
        co = 0.0
        nox = 0.0
        pmx = 0.0
        
        if len(emi_parts) >= 6:
            co = float(emi_parts[3])
            nox = float(emi_parts[4])
            pmx = float(emi_parts[5])
        
        # Déterminer la zone
        zone = get_zone(x, y)
        
        # Calculer vitesse approximative (Heuristique basée sur fuel)
        estimated_speed = min(fuel * 0.1, 100) if fuel > 0 else 0
        
        # Clé: zone|timestamp
        key = "{}|{}".format(zone, timestamp)
        
        # Valeur: speed|co2|noise|co|nox|pmx|1 (count)
        # On passe TOUTES les infos au reducer
        value = "{:.2f}|{:.2f}|{:.2f}|{:.2f}|{:.2f}|{:.2f}|1".format(
            estimated_speed, co2, noise, co, nox, pmx
        )
        
        print("{}\t{}".format(key, value))
        
    except (ValueError, IndexError) as e:
        # Ignorer les lignes mal formées (texte au lieu de nombre, etc.)
        continue