import json
import sys
import os
import argparse
import csv

DESIRED_KEYS = ["_songName", "_songAuthorName", "_beatsPerMinute", "_levelAuthorName"]
DIFFICULTY_INFO = ["_difficulty", "_noteJumpMovementSpeed"]

def getInfo(dat, difficulty=None):
    assert type(dat) == dict, "Dat must be a dictionary!"
    o = []
    for item in DESIRED_KEYS:
        o.append(str(dat[item]))
    if difficulty == -1:
        difficulty = None
    for bm in dat['_difficultyBeatmapSets']:
        if bm['_beatmapCharacteristicName'] == "Standard":
            d = bm['_difficultyBeatmaps'][-1]
            if difficulty:
                for d in bm['_difficultyBeatmaps']:
                    if difficulty in d['_difficulty'].lower() or ('_customData' in d.keys() and difficulty in d['_customData']['_difficultyLabel']):
                        break
            for item in DIFFICULTY_INFO:
                o.append(str(d[item]))
    
    # Insert empty key as first element of array to resolve offset issue with HTML
    o.insert(0, o[0])
    return ','.join(o)

def collect(string, outcsv, filter=None, verbose=False):
    assert type(string) == str, "Can only collect information on strings! See getInfo for JSON objects!"
    if os.path.exists(string):
        if os.path.isfile(string):
            diff = -1 # -1 for not found, no filter
            if filter:
                for k in filter.keys():
                    if k in string:
                        diff = filter[k]
                        break
                if diff == -1:
                    return
            with open(string, "r") as f:
                dat = json.load(f)
            q = getInfo(dat, difficulty=diff) + "\n"
            outcsv.write(q)
            print(q[:-2])
        else:
            for p in os.listdir(string):
                path = os.path.abspath(os.path.join(string, p))
                if "info.dat" in p or os.path.isdir(path):
                    collect(path, outcsv, filter=filter, verbose=verbose)
    else:
        if verbose:
            print("SKIPPING: " + string + " BECAUSE IT IS NOT A VALID FILE OR PATH!")

def parse_hash(s):
    assert type(s) == str, "Can only parse hash from strings!"
    return s.split("/")[-1]

def parse_difficulty(name):
    assert type(name) == str, "Can only parse difficulty from strings!"
    if "(" in name:
        # Could contain difficulty
        roi = name.split("(")[-1].split(")")[0]
        return roi.lower()
    return None

def parse_csv(f):
    filt = {}
    reader = csv.reader(f)
    # next(reader)
    for row in reader:
        if ''.join(row):
            h = parse_hash(row[1])
            if len(h) < 1 or len(h) > 6:
                # Probably not a valid hash
                continue
            filt[h] = parse_difficulty(row[0])
    return filt

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("songdir", help="Directory of custom songs that are already downloaded and unzipped")
    parser.add_argument("--output", help="Location of the file CSV to create and write the information to", default="res/maps.csv")
    parser.add_argument("--csv", type=argparse.FileType('r'), help="The CSV file to provide (downloaded from the official map pool)", default=None)
    parser.add_argument("--verbose", help="Provide better logging", default=False)

    args = parser.parse_args()

    # filter custom songs to search based off of csv from official mappool
    filtered_csv = None
    if (args.csv):
        filtered_csv = parse_csv(args.csv)
    with open(args.output, 'w') as fout:
        fout.write(','.join([DESIRED_KEYS[0]] + DESIRED_KEYS + DIFFICULTY_INFO) + "\n")
        collect(args.songdir, fout, filter=filtered_csv, verbose=args.verbose)
    
