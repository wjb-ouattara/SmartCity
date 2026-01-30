#!/usr/bin/env python
import sys
import json
import random

# --- CONSTANTES ---
MAX_SPEED_KMH = 200.0
MIN_CO2 = 0.0
MAX_CO2 = 10000.0
MAX_NOISE_DB = 140.0
MIN_COORD = -1000.0
MAX_COORD = 20000.0


def get_ambiance_noise(lieu_type):
    t = lieu_type.lower()
    if t in ['restaurant', 'cafe', 'bar', 'fast_food']:
        return random.uniform(60, 85)
    elif t in ['school', 'university', 'college']:
        return random.uniform(50, 75)
    else:
        return random.uniform(40, 60)


for line in sys.stdin:
    line = line.strip()
    if not line: continue

    try:
        data = json.loads(line)

        # CAS 1 : LIEUX
        if 'osm_id' in data:
            nom = data.get('nom', 'Lieu Inconnu').replace('\t', ' ')
            if len(nom) < 2: continue
            type_lieu = data.get('type', 'autre')
            x = data.get('x', 0)
            y = data.get('y', 0)

            if not (MIN_COORD <= x <= MAX_COORD and MIN_COORD <= y <= MAX_COORD): continue

            decibel = get_ambiance_noise(type_lieu)
            # UTILISATION DE .format() POUR PYTHON 2
            print("LIEU\t{}\t{}\t{}\t{}\t{:.2f}".format(nom, type_lieu, x, y, decibel))

        # CAS 2 : GPS
        elif 'position' in data and 'vehicule_id' in data:
            v_id = data['vehicule_id']
            ts = data['timestamp']
            pos = data['position']
            x = float(pos.get('x', 0))
            y = float(pos.get('y', 0))
            speed = float(data.get('speed', 0))

            if (0 <= speed <= MAX_SPEED_KMH) and (MIN_COORD <= x <= MAX_COORD) and (MIN_COORD <= y <= MAX_COORD):
                key = "{}_{}".format(v_id, ts)
                print("{}\tGPS|{},{}".format(key, x, y))

        # CAS 3 : EMISSIONS
        elif 'emissions' in data and 'vehicule_id' in data and 'position' not in data:
            v_id = data['vehicule_id']
            ts = data['timestamp']
            emi = data['emissions']
            co2 = float(emi.get('co2', 0))
            noise = float(emi.get('noise', 0))
            fuel = float(emi.get('fuel', 0))

            if (MIN_CO2 <= co2 <= MAX_CO2) and (0 <= noise <= MAX_NOISE_DB) and (fuel >= 0):
                key = "{}_{}".format(v_id, ts)
                print("{}\tEMI|{},{},{}".format(key, co2, noise, fuel))

    except (ValueError, KeyError, TypeError):
        continue