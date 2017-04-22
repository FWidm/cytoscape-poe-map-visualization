import os
import json
from pprint import pprint
import urllib.request

def read_inputfile(filename):
    with open(filename) as data_file:
        jsonData = json.load(data_file)
        #pprint(data)
        print("Processing ... found: {} items!".format(len(jsonData)))
        for item in jsonData:
            print("k={} | url={} ".format(item['id'],item['imageUrl']))
            subfolder=""

            if 'isUnique' in item and item['isUnique']==False:
                subfolder=str(item['tier']).zfill(2)
            else:
                subfolder="unique"
            print(subfolder)
            if not os.path.exists("out/"+subfolder):
                os.makedirs("out/"+subfolder)
            urllib.request.urlretrieve(item['imageUrl'], "out/"+subfolder+"/"+item['name'].replace(" ", "")+".png")
            if 'fatedImageUrl'  in item:
                urllib.request.urlretrieve(item['fatedImageUrl'], "out/"+subfolder+"/"+item['name'].replace(" ", "")+ "_fated.png")
                print()
read_inputfile("../json-prototypes/_maps.json")