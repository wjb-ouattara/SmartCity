import json
import sys

# On lit tout le fichier d'un coup (si c'est un tableau JSON [...] ou des objets a la suite)
try:
    content = sys.stdin.read()
    # Cas 1: C'est une liste JSON standard [{}, {}]
    data = json.loads(content)
    if isinstance(data, list):
        for entry in data:
            print(json.dumps(entry))
    # Cas 2: C'est un objet unique ou autre
    elif isinstance(data, dict):
        print(json.dumps(data))
except:
    # Cas 3: C'est peut-être déjà du "faux" json collé, on tente de réparer manuellement
    # (Méthode brutale pour les fichiers mongo dumpés salement)
    content = content.replace('}\n{', '},{')
    if not content.startswith('['): content = '[' + content
    if not content.endswith(']'): content = content + ']'
    try:
        data = json.loads(content)
        for entry in data:
            print(json.dumps(entry))
    except Exception as e:
        sys.stderr.write(str(e))
