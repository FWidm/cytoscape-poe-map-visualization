import os
import json
from pprint import pprint
import urllib.request

def get_tier_string(tier):
    return str(tier).zfill(2)

def normalize_name(param):
    #print(param.replace(" ", "").replace("ö",'oe').replace("'",""))
    return param.replace(" ", "").replace("Ã¶",'oe').replace("'","").replace("The","")

def read_inputfile(filename):
    with open(filename) as data_file:
        jsonData = json.load(data_file)
        #pprint(jsonData)
        print("Processing ... found: {} items!".format(len(jsonData)))
        basepath = "/maps"
        for item in jsonData['maps']:
            #print("k={} | v={} ".format(item['mapId'],item['name']))

            if 'imageUrl' not in item:
                #print(item['name'])
                if item['unique']==True:
                    print("unique")
                    name = normalize_name(item['name'])
                    with os.scandir("maps/unique") as it:
                        for entry in it:
                            if name in entry.name and entry.is_file() and 'fated' not in entry.name:
                                print(entry.name)
                                item["imageUrl"]="img/maps/unique/"+entry.name
                if 'tier' in item:
                    tier = get_tier_string(item['tier'])
                    name = normalize_name(item['name'])
                    with os.scandir("maps/"+tier) as it:
                        for entry in it:
                            if name in entry.name and entry.is_file() and 'fated' not in entry.name:
                                print(entry.name)
                                item["imageUrl"]="img/maps/"+tier+"/"+entry.name

        with open('atlas-2.6.json', 'w') as outfile:
            json.dump(jsonData, outfile, sort_keys=True, indent=4,
                      ensure_ascii=False)



read_inputfile("in/atlas-2.6.json")

