#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Reducer: Agrégation Zone/Timestamp (Version Simple & Directe)
Input attendu: speed|co2|noise|co|nox|pmx|count
"""

import sys
import json

current_key = None
speeds = []
co2_values = []
noise_values = []
co_values = []
nox_values = []
pmx_values = []
count = 0

def get_congestion_level(avg_speed):
    if avg_speed < 15: return "très dense"
    if avg_speed < 30: return "dense"
    if avg_speed < 50: return "modéré"
    return "fluide"

def get_pollution_level(co2, nox, pmx):
    """
    Calcule l'Indice de Qualité de l'Air (IQA) basé sur le pire polluant.
    Seuils approximatifs inspirés des normes européennes.
    """
    # C'est le critère le plus strict
    if pmx > 50:
        return "Toxique"      
    if pmx > 25:
        return "Dangereux"    
    if nox > 120:
        return "Très Mauvais"
    if nox > 60:
        return "Mauvais"
    if co2 > 2500:
        return "Médiocre"
    return "Bon"

def get_noise_level(avg_noise):
    if avg_noise > 85: return "Très Élevé"
    if avg_noise > 70: return "Élevé"
    if avg_noise > 55: return "Modéré"
    return "Faible"

def output_result():
    global current_key, speeds, co2_values, noise_values, co_values, nox_values, pmx_values, count
    
    if not current_key or count == 0:
        return
    
    zone, timestamp = current_key.split('|')
    
    # Calcul des moyennes simple
    avg_speed = sum(speeds) / len(speeds)
    avg_co2 = sum(co2_values) / len(co2_values)
    avg_noise = sum(noise_values) / len(noise_values)
    avg_co = sum(co_values) / len(co_values)
    avg_nox = sum(nox_values) / len(nox_values)
    avg_pmx = sum(pmx_values) / len(pmx_values)
    
    result = {
        'zone': zone,
        'timestamp': int(timestamp),
        'stats': {
            'avg_speed_kmh': round(avg_speed, 2),
            'vehicle_count': count,
            'congestion_level': get_congestion_level(avg_speed),
            'avg_co2': round(avg_co2, 2),
            'pollution_level': get_pollution_level(avg_co2, avg_nox, avg_pmx),
            'avg_noise_db': round(avg_noise, 2),
            'noise_level': get_noise_level(avg_noise),
            # Les nouveaux
            'avg_co': round(avg_co, 2),
            'avg_nox': round(avg_nox, 2),
            'avg_pmx': round(avg_pmx, 2)
        }
    }
    print(json.dumps(result))

for line in sys.stdin:
    line = line.strip()
    if not line: continue
    
    try:
        key, value = line.split('\t', 1)
        
        if key != current_key:
            output_result()
            current_key = key
            speeds, co2_values, noise_values = [], [], []
            co_values, nox_values, pmx_values = [], [], []
            count = 0
        
        # On suppose que le format est TOUJOURS complet (7 valeurs)
        # speed|co2|noise|co|nox|pmx|count
        parts = value.split('|')
        
        speeds.append(float(parts[0]))
        co2_values.append(float(parts[1]))
        noise_values.append(float(parts[2]))
        co_values.append(float(parts[3]))
        nox_values.append(float(parts[4]))
        pmx_values.append(float(parts[5]))
        count += int(parts[6])
        
    except (ValueError, IndexError):
        continue

output_result()