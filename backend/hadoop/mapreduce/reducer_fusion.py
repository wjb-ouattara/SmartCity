#!/usr/bin/env python
import sys

current_key = None
gps_data = None
emi_data = None

for line in sys.stdin:
    line = line.strip()
    if not line: continue

    try:
        key, value = line.split('\t', 1)

        if key == "LIEU":
            print(line)
            continue

        if key != current_key:
            if current_key and gps_data and emi_data:
                v_id, ts = current_key.split('_')
                print("{}\t{}\t{}\t{}".format(v_id, ts, gps_data, emi_data))

            current_key = key
            gps_data = None
            emi_data = None

        if value.startswith("GPS|"):
            gps_data = value.replace("GPS|", "")
        elif value.startswith("EMI|"):
            emi_data = value.replace("EMI|", "")

    except ValueError:
        continue

if current_key and gps_data and emi_data:
    v_id, ts = current_key.split('_')
    print("{}\t{}\t{}\t{}".format(v_id, ts, gps_data, emi_data))