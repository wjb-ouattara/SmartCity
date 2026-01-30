#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Reducer: Agrégation finale par Zone et Timestamp
Calcule moyennes et statistiques
"""

import sys
import json

current_key = None
speeds = []
co2_values = []
noise_values = []
count = 0

def get_congestion_level(avg_speed):
    """Détermine le niveau de congestion"""
    if avg_speed < 15:
        return "très dense"
    elif avg_speed < 30:
        return "dense"
    elif avg_speed < 50:
        return "modéré"
    else:
        return "fluide"

def get_pollution_level(avg_co2):
    """Détermine le niveau de pollution"""
    if avg_co2 > 2000:
        return "Dangereux"
    elif avg_co2 > 1000:
        return "Mauvais"
    elif avg_co2 > 500:
        return "Modéré"
    else:
        return "Bon"

def get_noise_level(avg_noise):
    """Détermine le niveau de bruit"""
    if avg_noise > 85:
        return "Très Élevé"
    elif avg_noise > 70:
        return "Élevé"
    elif avg_noise > 55:
        return "Modéré"
    else:
        return "Faible"

def output_result():
    """Affiche le résultat agrégé"""
    global current_key, speeds, co2_values, noise_values, count
    
    if not current_key or count == 0:
        return
    
    zone, timestamp = current_key.split('|')
    
    # Calcul des moyennes
    avg_speed = sum(speeds) / len(speeds) if speeds else 0
    avg_co2 = sum(co2_values) / len(co2_values) if co2_values else 0
    avg_noise = sum(noise_values) / len(noise_values) if noise_values else 0
    
    # Construction du résultat JSON
    result = {
        'zone': zone,
        'timestamp': int(timestamp),
        'stats': {
            'avg_speed_kmh': round(avg_speed, 2),
            'vehicle_count': count,
            'congestion_level': get_congestion_level(avg_speed),
            'avg_co2': round(avg_co2, 2),
            'pollution_level': get_pollution_level(avg_co2),
            'avg_noise_db': round(avg_noise, 2),
            'noise_level': get_noise_level(avg_noise)
        }
    }
    
    print(json.dumps(result))

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    
    try:
        key, value = line.split('\t', 1)
        
        # Nouvelle clé, afficher résultat précédent
        if key != current_key:
            output_result()
            
            # Réinitialiser pour nouvelle clé
            current_key = key
            speeds = []
            co2_values = []
            noise_values = []
            count = 0
        
        # Parser la valeur: speed|co2|noise|count
        parts = value.split('|')
        if len(parts) != 4:
            continue
        
        speed = float(parts[0])
        co2 = float(parts[1])
        noise = float(parts[2])
        cnt = int(parts[3])
        
        speeds.append(speed)
        co2_values.append(co2)
        noise_values.append(noise)
        count += cnt
        
    except (ValueError, IndexError):
        continue

# Afficher le dernier résultat
output_result()