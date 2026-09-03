"""
MongoDB Analysis Repository Layer
----------------------------------
Handles persistence of match scores, analysis results, and generated interview questions in MongoDB
with an in-memory dictionary fallback.
"""

from typing import Dict, Any, Optional
from app.core.config import settings

mongo_available = False
analysis_collection = None

try:
    from pymongo import MongoClient
    import certifi
    
    # Try connecting with standard TLS config
    client = MongoClient(
        settings.MONGODB_URI,
        tlsCAFile=certifi.where(),
        tlsAllowInvalidCertificates=True,
        serverSelectionTimeoutMS=2000
    )
    client.server_info()
    db = client[settings.DATABASE_NAME]
    analysis_collection = db["analysis_results"]
    mongo_available = True
    print(f"[AnalysisRepository] Successfully connected to MongoDB Database: {settings.DATABASE_NAME}")
except Exception as e:
    mongo_available = False
    analysis_collection = None
    print(f"[AnalysisRepository Notice] MongoDB Atlas connection pending IP whitelist ({e}). Using in-memory fallback store.")

# In-memory dictionary fallback store: { analysis_id: dict }
_in_memory_store: Dict[str, Dict[str, Any]] = {}


class AnalysisRepository:
    @staticmethod
    def save_analysis(analysis_id: str, data: Dict[str, Any]) -> None:
        data["_id"] = analysis_id
        if mongo_available and analysis_collection is not None:
            try:
                analysis_collection.replace_one({"_id": analysis_id}, data, upsert=True)
                return
            except Exception as e:
                print(f"[AnalysisRepository Error] MongoDB save failed: {e}")

        _in_memory_store[analysis_id] = data

    @staticmethod
    def get_analysis_by_id(analysis_id: str) -> Optional[Dict[str, Any]]:
        if mongo_available and analysis_collection is not None:
            try:
                doc = analysis_collection.find_one({"_id": analysis_id})
                if doc:
                    doc["id"] = doc.pop("_id", analysis_id)
                    return doc
            except Exception as e:
                print(f"[AnalysisRepository Error] MongoDB fetch failed: {e}")

        return _in_memory_store.get(analysis_id)
