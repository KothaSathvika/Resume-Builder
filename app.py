from flask import Flask
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import hashlib
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, current_user
import datetime
import hashlib
from dotenv import load_dotenv
from flask_cors import CORS
import os

load_dotenv()

username = os.getenv("DB_USERNAME")
password = os.getenv("DB_PASSWORD")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")


uri = f"mongodb://{username}:{password}@localhost:27017/"

client = MongoClient(uri, server_api=ServerApi('1'))
# client = MongoClient(uri)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.user_details
collection = db.login_details

app = Flask(__name__)
CORS(app)

cors = CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})


jwt = JWTManager(app)
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)


@app.route("/me", methods=["get"])
@jwt_required()  # flask decorator
def test():
    try:
        current_user = get_jwt_identity()
        user_from_db = collection.find_one({"email": current_user})
        if user_from_db:
            return jsonify(firstname=user_from_db['firstname'],
                           email=user_from_db['email']), 200
        else:
            return jsonify({'msg': 'Access Token Expired'}), 404

    except jwt.ExpiredSignatureError:
        return jsonify({'msg': 'Signature expired. Please log in again.'}), 404
    except jwt.InvalidTokenError:
        return jsonify({'msg': 'Invalid token. Please log in again.'}), 422


@app.route("/register", methods=["POST"])
def register():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json' and request.method == "POST"):
        new_user = request.get_json()  # store the json body request
        # Creating Hash of password to store in the database
        new_user["password"] = hashlib.sha256(
            new_user["password"].encode("utf-8")).hexdigest()  # encrpt password
        new_user["password1"] = hashlib.sha256(
            new_user["password1"].encode("utf-8")).hexdigest()
        # Checking if user already exists
        doc = collection.find_one(
            {"email": new_user["email"]})  # check if user exist
        # If not exists than create one
        if not doc:
            # Creating user
            collection.insert_one(new_user)
            return jsonify({'msg': 'User created successfully'}), 201
        else:
            return jsonify({'msg': 'Username already exists'}), 409
    else:
        return {"message": 'Content-Type not supported!'}


@app.route("/login", methods=["post"])
def login():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json' and request.method == "POST"):
        # Getting the login Details from payload
        login_details = request.get_json()  # store the json body request
        # Checking if user exists in database or not
        user_from_db = collection.find_one(
            {'email': login_details['email']})  # search for user in database
        print("user from db is ", user_from_db)
        # If user exists
        if user_from_db:
            # Check if password is correct
            hashed_password = hashlib.sha256(
                login_details['password'].encode("utf-8")).hexdigest()
            if hashed_password == user_from_db['password']:
                # Create JWT Access Token
                access_token = create_access_token(
                    identity=user_from_db['email'])  # create jwt token
                # Return Token
                return jsonify(access_token=access_token), 200
        return jsonify({'msg': 'The username or password is incorrect'}), 401
    else:
        return {"message": 'Content-Type not supported!'}


if __name__ == "__main__":
    app.run(debug=True)
