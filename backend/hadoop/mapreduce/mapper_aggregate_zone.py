#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Mapper: Agrégation par Zone et Timestamp
Input: Résultat de reducer_fusion.py
Output: (zone, timestamp) -> (speed, co2, noise, count)
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

def calculate_speed_kmh(x1, y1, x2, y2, time_diff):
    """Calcule la vitesse en km/h entre 2 points"""
    if time_diff <= 0:
        return 0
    distance = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
    # Conversion mètres/seconde en km/h (approximation)
    speed_ms = distance / time_diff
    return speed_ms * 3.6

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    
    # Format: vehicule_id | timestamp | x,y | co2,noise,fuel
    parts = line.split('\t')
    
    # Ignorer les lignes LIEU (traitées séparément)
    if parts[0] == 'LIEU':
        continue
    
    if len(parts) != 4:
        continue
    
    try:
        vehicule_id = parts[0]
        timestamp = int(parts[1])
        
        # Position
        x, y = parts[2].split(',')
        x = float(x)
        y = float(y)
        
        # Emissions
        co2, noise, fuel = parts[3].split(',')
        co2 = float(co2)
        noise = float(noise)
        fuel = float(fuel)
        
        # Déterminer la zone
        zone = get_zone(x, y)
        
        # Calculer vitesse approximative (on utilise le déplacement)
        # Pour simplifier, on suppose une vitesse basée sur le fuel consommé
        # Plus de fuel = plus de vitesse (approximation)
        estimated_speed = min(fuel * 0.1, 100) if fuel > 0 else 0
        
        # Clé: zone|timestamp
        # Valeur: speed|co2|noise|1 (count)
        key = "{}|{}".format(zone, timestamp)
        value = "{:.2f}|{:.2f}|{:.2f}|1".format(estimated_speed, co2, noise)
        
        print("{}\t{}".format(key, value))
        
    except (ValueError, IndexError) as e:
        # Ignorer les lignes mal formées
        continue