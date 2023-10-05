from model.pack_model import Pack
from model.tracking_model import TrackingEvent
from config.database_config import packs_collection
from config.database_config import tracking_collection
from bson import ObjectId
from datetime import datetime

class PackService:

    @staticmethod
    def register_pack(pack: Pack):
        pack_dict = dict(pack)
        pack_dict['sender'] = dict(pack.sender)
        pack_dict['receiver'] = dict(pack.receiver)

        result = packs_collection.insert_one(pack_dict)

        if result.acknowledged:
            return result.inserted_id
        else:
            return None
        

    @staticmethod
    def find_by_id(id: str):
        result = packs_collection.find_one({"_id": ObjectId(id)})

        return result
    
    @staticmethod
    def get_all_packs():
        result = packs_collection.find({})

        packs = []
        for pack in result:
            pack_dict = dict(pack)
            pack_dict["_id"] = str(pack["_id"])
            packs.append(pack_dict)
    
        return packs
    
    @staticmethod
    def update_pack(id: str, updated_pack: Pack):
        pack_optional = packs_collection.find_one({"_id": ObjectId(id)})

        if pack_optional:
            pack_dict = dict(updated_pack)
            pack_dict['sender'] = dict(updated_pack.sender)
            pack_dict['receiver'] = dict(updated_pack.receiver)
            packs_collection.update_one({"_id": ObjectId(id)}, {"$set": pack_dict})
            
            return pack_optional
        else:
            return None
        
    @staticmethod
    def register_tracking(tracking: TrackingEvent):
        pack_optional = packs_collection.find_one({"_id": ObjectId(tracking.pack_id)})

        if pack_optional:
            tracking_dict = dict(tracking)
            current_time = datetime.now()
            tracking_dict['date'] = current_time
            tracking_dict['time'] = current_time.strftime('%H:%M:%S') 
            result = tracking_collection.insert_one(tracking_dict)
            
            if result.acknowledged:
                return result.inserted_id
            else:
                return None
        else: 
            None


    @staticmethod
    def find_trackings_by_id(id: str):
        trackings = tracking_collection.find({"pack_id": id})

        trackings_list = []

        if trackings:
            for tracking in trackings:
                tracking_dict = dict(tracking)
                tracking_dict["_id"] = str(tracking["_id"])
                trackings_list.append(tracking_dict)
    
            return trackings_list

        return trackings_list