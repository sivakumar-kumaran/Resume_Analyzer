"""
MongoDB User Repository Layer
-----------------------------
Handles MongoDB persistence for Users, candidate profiles, and auth sessions
with in-memory dictionary fallback when MongoDB Atlas connection is pending.
"""

from typing import Dict, Any, Optional
import uuid
from datetime import datetime
from app.core.config import settings

mongo_available = False
users_collection = None

try:
    from pymongo import MongoClient
    import certifi

    client = MongoClient(
        settings.MONGODB_URI,
        tlsCAFile=certifi.where(),
        tlsAllowInvalidCertificates=True,
        serverSelectionTimeoutMS=2000
    )
    client.server_info()
    db = client[settings.DATABASE_NAME]
    users_collection = db["users"]
    mongo_available = True
    print(f"[UserRepository] Successfully connected to MongoDB Users collection.")
except Exception as e:
    mongo_available = False
    users_collection = None
    print(f"[UserRepository Notice] Using resilient in-memory session store (Atlas IP whitelist pending: {e}).")

# In-memory dictionary fallback store: { email: dict }
_in_memory_users: Dict[str, Dict[str, Any]] = {}


class UserRepository:
    @staticmethod
    def create_user(name: str, email: str, password: str, profile_pic: Optional[str] = None) -> Dict[str, Any]:
        user_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()
        
        user_doc = {
            "_id": user_id,
            "id": user_id,
            "name": name,
            "email": email.lower(),
            "password": password,
            "profile_pic": profile_pic,
            "created_at": created_at,
            "analysis_history": []
        }

        if mongo_available and users_collection is not None:
            try:
                users_collection.replace_one({"email": email.lower()}, user_doc, upsert=True)
                return user_doc
            except Exception as e:
                print(f"[UserRepository Error] MongoDB insert failed: {e}")

        _in_memory_users[email.lower()] = user_doc
        return user_doc

    @staticmethod
    def find_by_email(email: str) -> Optional[Dict[str, Any]]:
        if mongo_available and users_collection is not None:
            try:
                doc = users_collection.find_one({"email": email.lower()})
                if doc:
                    doc["id"] = doc.pop("_id", doc.get("id"))
                    return doc
            except Exception as e:
                print(f"[UserRepository Error] MongoDB fetch failed: {e}")

        return _in_memory_users.get(email.lower())

    @staticmethod
    def update_profile_pic(email: str, profile_pic: str) -> Optional[Dict[str, Any]]:
        user = UserRepository.find_by_email(email)
        if not user:
            return None

        user["profile_pic"] = profile_pic
        if mongo_available and users_collection is not None:
            try:
                users_collection.update_one(
                    {"email": email.lower()},
                    {"$set": {"profile_pic": profile_pic}}
                )
            except Exception as e:
                print(f"[UserRepository Error] MongoDB update failed: {e}")

        _in_memory_users[email.lower()] = user
        return user

    @staticmethod
    def add_analysis_to_user(email: str, analysis_id: str) -> None:
        user = UserRepository.find_by_email(email)
        if not user:
            return

        if "analysis_history" not in user:
            user["analysis_history"] = []
        user["analysis_history"].append(analysis_id)

        if mongo_available and users_collection is not None:
            try:
                users_collection.update_one(
                    {"email": email.lower()},
                    {"$push": {"analysis_history": analysis_id}}
                )
            except Exception as e:
                print(f"[UserRepository Error] MongoDB push failed: {e}")

        _in_memory_users[email.lower()] = user
