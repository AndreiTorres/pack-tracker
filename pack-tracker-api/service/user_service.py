from config.database_config import users_collection
from passlib.context import CryptContext

from model.user_model import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:

    @staticmethod
    def login(user: User):
        
        userOptional = users_collection.find_one({"email": user.email})

        if userOptional:
            if pwd_context.verify(user.password, userOptional['password']):
                user_dict = dict()
                user_dict['email'] = user.email
                token = UserService.generateToken()  
                response = {"user": user_dict, "token": token}
                return response
        return None
    
    @staticmethod
    def generateToken():
        return "token_valido"
