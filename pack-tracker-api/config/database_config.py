from pymongo import MongoClient
from pymongo.collection import Collection

client = MongoClient('mongodb://localhost:27017')

database = client['tracker']

packs_collection: Collection = database['packs']

tracking_collection: Collection = database['tracking']