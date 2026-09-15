from pymongo import MongoClient

MONGO_URI = "mongodb://127.0.0.1:27017/"
DATABASE_NAME = "ai_code_review"

client = MongoClient(MONGO_URI)

db = client[DATABASE_NAME]

reviews_collection = db["reviews"]


def test_database_connection():
    try:
        client.admin.command("ping")
        print("MongoDB connected successfully!")
        return True
    except Exception as e:
        print("MongoDB connection failed:", e)
        return False