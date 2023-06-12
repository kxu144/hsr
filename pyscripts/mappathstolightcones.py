import json
import os

lightcone_dir = "../hsr-website/data/lightcones"
paths = ["Destruction", "The Hunt", "Erudition", "Harmony", "Nihility", "Preservation", "Abundance"]

def main():
    res = {}
    for p in paths:
        res[p] = []
    files = os.listdir(lightcone_dir)
    files.sort(reverse=True)
    for filename in files:
        with open(os.path.join(lightcone_dir, filename), "r") as json_file:
            data = json.load(json_file)
            path = data["baseType"]["name"]
            if path not in paths:
                print(filename, "failed to have a valid path")
            res[path].append(data["name"])

    print(json.dumps(res, indent=4))

main()
