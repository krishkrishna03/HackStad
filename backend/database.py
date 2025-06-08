import asyncio
from datetime import datetime, timedelta
from email.message import EmailMessage
from mimetypes import guess_type
import os
import re
import smtplib
from typing import Any, Dict, List
from urllib.parse import urlparse
from aiohttp import ClientError
import boto3
from fastapi.responses import StreamingResponse
import motor.motor_asyncio
from model import Usersdata ,UserResponse ,TokenData,TokenData1,TokenData2
from bson import ObjectId
from passlib.context import CryptContext
from fastapi import  HTTPException,Depends, Query, UploadFile ,status
from jose import JWTError, jwt
from pymongo import MongoClient
import certifi
import gridfs
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 30  # 30 days

from pydantic import BaseModel,EmailStr

from dotenv import load_dotenv
load_dotenv()



client12 =  AsyncIOMotorClient("mongodb+srv://hackathonsite:Team-6@cluster0.tllxu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&connectTimeoutMS=30000"
                        ,tls=True,
                        tlsCAFile=certifi.where())

try:
    client12.admin.command('ping')
    print("Connection successful!")
except Exception as e:
    print("Connection failed:", e)
# Use Motor's GridFS
from motor.motor_asyncio import AsyncIOMotorGridFSBucket


#client1 = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017/')
database = client12['Hackathonsite']
fs = AsyncIOMotorGridFSBucket(database)
userdata = database['users']
CollegeData = database['college']
FacultyData = database['faculty']
MentorData = database['mentor']
Hackathon_data = database['hackthon_data']
registrations = database["hackthon_registrations"]
TeamData = database['hackthon_teams']
TeamInvites = database['team_invites']
CollegeBankDetails = database['college_bankdetails']
HackathonSubmissions = database['hackathon_submissions']
EvaluationData = database['evaluation_data']
HackathonWinners = database['hackathon_winners']
TeamChatMessages = database['team_chat_messages']
async def get_upcoming_hackathons():
    current_time = datetime.utcnow()  # Current time in UTC
    # Fetch the hackathons
    hackathons_cursor = Hackathon_data["hackathons"].find({"date": {"$gte": current_time}})
    hackathons_list = await hackathons_cursor.to_list(length=None)  # Await only if it's a cursor
    return {"upcoming_hackathons": hackathons_list}



async def create_user(user_data):
    user  = await userdata.find_one({"email": user_data['email']})
    if user:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    else:
        data = user_data
        userdata.insert_one(data)
    return data

async def get_user_by_email(email: str):
    """ Fetch user by email from the database, ensuring case normalization. """
    user = await userdata.find_one({"email": email})

    if user:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string for JSON compatibility
        return user
    return None


async def check_user(email):
    # List all databases in the cluster
    databases1 = await client12.list_database_names()
    
    for db_name in databases1:
        db = client12[db_name]
        
        # List all collections in the current database
        collections = await db.list_collection_names()
        
        for collection_name in collections:
            collection = db[collection_name]
            
            # Search for the email in the current collection
            user_ = await collection.find_one({"email": email})
            
            if user_:
                raise HTTPException(status_code=400, detail="User with this email already exists")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    print("Token: ##############################", token)
    try:
        payload =  jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        print("Email: ##############################", email)
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Await the database call to fetch the user
    user = await get_user_by_email(email)
    print("User: ##############################", user)
    if user is None:
        raise credentials_exception
    return user







async def fetch_hackathon(id: str):
    hackathon = await Hackathon_data.find_one({"_id": ObjectId(id)})
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")
    return hackathon

async def update_user_by_email(email: str, updated_data: dict):
    result = userdata.update_one({"email": email}, {"$set": updated_data})
    if result.matched_count:
        updated_user = userdata.find_one({"email": email})
        return updated_user
    else:
        raise HTTPException(status_code=404, detail="User not found")


async def create_faculty(faculty):
    existing_faculty = await FacultyData.find_one({"email": faculty['email']})
    if existing_faculty:
        raise HTTPException(status_code=400, detail="Faculty with this email already exists")
    else:
        data = faculty
        FacultyData.insert_one(data)
    return data



async def create_college(college):
    existing_college = await CollegeData.find_one({"email":college['college_email']})
    if existing_college:
        raise HTTPException(status_code=400,detail="college email already exists")
    else:
        data = college
        CollegeData.insert_one(data)
    return data


async def create_hackthon_data(hackathon):
    existing_hackathon = await Hackathon_data.find_one({"title":hackathon['title']})
    if existing_hackathon:
        raise HTTPException(status_code=400,detail="College email already exists")
    else:
        data = hackathon
        Hackathon_data.insert_one(data)
    return data



async def get_college_by_email(email: str):
    """
    Fetch a college document by its email asynchronously.
    """
    college_email =  await CollegeData.find_one({"college_email": email})
    return college_email

async def get_current_college(token: str = Depends(oauth2_scheme)):
    """
    Decode JWT token to fetch the college associated with the email.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")  # Extract email from the token payload
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Fetch the college details using the email
    college = await get_college_by_email(email)
    if college is None:
        raise credentials_exception
    return college

async def get_Faculty_by_email(email: str):
    faculty = FacultyData.find_one({"email": email})
    return faculty


async def get_Mentor_by_email(email: str):
    mentor = await MentorData.find_one({"email": email})
    print(f"get_Mentor_by_email result 213: {mentor}")  # Debugging line
    return mentor


async def get_current_faculty(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        facultyid: str = payload.get("sub")
        if facultyid is None:
            raise credentials_exception
        token_data = TokenData1(facultyid=facultyid)
    except JWTError:
        raise credentials_exception
    faculty = get_Faculty_by_email(facultyid=token_data.facultyid)
    if faculty is None:
        raise credentials_exception
    return faculty


async def get_current_mentor(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    print(f'Mentor token received: {token}')
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        exp: int = payload.get("exp")
        
        print(f'Decoded Payload: {payload}')
        print(f'Extracted email: {email}')
        
        if email is None:
            print("No email found in payload!")
            raise credentials_exception
        
    except JWTError as e:
        print(f'JWT Error: {e}')
        raise credentials_exception

    mentor = await get_Mentor_by_email(email)
    
    if mentor is None:
        print("Mentor not found in database!")
        raise credentials_exception
    
    print(f'Authenticated Mentor: {mentor}')
    return mentor


    # Ensure mentor is a proper dictionary and not a Mongo object
    # mentor_data = mentor.dict() if hasattr(mentor, "dict") else dict(mentor)

    # # Debugging: print mentor data to check what's missing
    # print(f'Mentor data: {mentor_data}')

    # # Ensure all expected fields exist
    # required_fields = ["email", "name", "role", "phone", "department"]
    # missing_fields = [field for field in required_fields if field not in mentor_data]
    # if missing_fields:
    #     raise HTTPException(
    #         status_code=500,
    #         detail=f"Mentor data is missing required fields: {missing_fields}"
    #     )

    # return mentor_data



async def create_mentor(mentor):
    print(f"Checking if mentor with email {mentor['email']} already exists...")
    existing_mentor = await MentorData.find_one({"email": mentor["email"]})
    if existing_mentor:
        print(f"Mentor with email {mentor['email']} already exists.")
        raise HTTPException(status_code=400, detail="Mentor with this email already exists")
    
    print(f"Inserting new mentor: {mentor}")
    result = await MentorData.insert_one(mentor)
    print(f"Mentor inserted with ID: {result.inserted_id}")
    return mentor


async def get_mentor_by_email(email: str):
    mentor = await MentorData.find_one({"email": email})
    print(f"get_mentor_by_email result: {mentor}")  # Debugging line
    return mentor




##################   get hakcthon by id   ###############################
# Assuming Hackathon_data is your MongoDB collection
async def get_hackathon_by_id(hackathon_id: str):
    # Convert the hackathon_id to an ObjectId
    try:
        hackathon_object_id = ObjectId(hackathon_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid hackathon ID format")
    
    # Fetch the hackathon details by ID
    hackathon = await Hackathon_data["hackathons"].find_one({"_id": hackathon_object_id})
    
    # Raise an exception if the hackathon is not found
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    # Construct the response dictionary
    hackathon_details = {
        "id": str(hackathon["_id"]),
        "title": hackathon["title"],
        "description": hackathon.get("description", ""),
        "start_date": hackathon["start_date"],
        "end_date": hackathon["end_date"],
        "register_deadline": hackathon["register_deadline"],
        "location": hackathon["location"],
        "max_participants_for_team": hackathon.get("max_participants_for_team", None),
        "hackathon_mode": hackathon.get("hackathon_mode", "individual"),
        "registration_fee": hackathon.get("registration_fee", 0),
        "payment_qr": hackathon.get("payment_qr", None),
    }

    return hackathon_details






s3 = boto3.client(
    's3',
    aws_access_key_id='AKIAZKDIC6TSTGUGD3YK',
    aws_secret_access_key='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',
    region_name='eu-north-1',  # Add the bucket's region
    config=boto3.session.Config(signature_version='s3v4')  # Explicitly specify Signature Version 4
)





def upload_profile_picture(profile_picture: UploadFile = None) -> str:
    """
    Uploads a profile picture to AWS S3 and returns the URL.

    Args:
        profile_picture (UploadFile, optional): The uploaded profile picture file. Defaults to None.

    Returns:
        str: The URL of the uploaded profile picture in S3, or None if no picture is uploaded.
    """

    if not profile_picture:
        return None  # Handle optional profile picture

    try:
        filename = profile_picture.filename
        s3.upload_fileobj(profile_picture.file, 'hackathonsite', filename)
        profile_picture_url = f'https://s3.amazonaws.com/hackathonsite /{filename}'
        return profile_picture_url
    except ClientError as e:
        raise Exception(f"Error uploading profile picture: {str(e)}")
    

async def static_image(input_key: str):
    """
    Fetches an image from S3 and returns it as a streaming response.
    Accepts either a full S3 URL or an object key.
    """
    if not input_key:  # Check if the input key is None or empty
        return {"error": "Invalid input URL or key"}

    bucket_name = "hackathonsite"
    
    # Extract key if input is a full URL
    if input_key.startswith("http"):  # Check if the input starts with 'http'
        parsed_url = urlparse(input_key)
        key = parsed_url.path.lstrip("/")  # Removes leading "/" from the path
    else:
        key = input_key  # Assume it's a direct key
    
    try:
        # Fetch the object from S3
        response = s3.get_object(Bucket=bucket_name, Key=key)
        
        # Stream the image as a response
        return StreamingResponse(response['Body'], media_type="image/png")
    except Exception as e:
        return {"error": str(e)}


# sender_email = "onlineseller277@gmail.com"
# sender_password = "cnkp iyfy wuht ihtk"

def send_otp_email(email: str, otp: int):
    sender_email = "hackathons.hackstad@gmail.com"
    sender_password = "huxn oxkg swmz oqis"

    if not sender_email or not sender_password:
        raise HTTPException(status_code=500, detail="Email credentials are not set. Please configure MAIN_EMAIL and MAIN_EMAIL_PASSWORD.")

    message = f"Subject: Your OTP for registration\n\nYour OTP is: {otp}"

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, message)
        server.quit()
        print(f"OTP sent to {email}")
    except Exception as e:
        print(f"Failed to send OTP email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send OTP email. Please try again later.")
    
def send_team_invitations_email(email: str, otp: int):
    sender_email = "hackathons.hackstad@gmail.com"
    sender_password = "huxn oxkg swmz oqis"
    message = f"Subject: You Got an invitation\n\nYour OTP is: {otp}"

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, message)
        server.quit()
        print(f"OTP sent to {email}")
    except Exception as e:
        print(f"Failed to send OTP email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send OTP email. Please try again later.")
    
def send_message_to_mentor_email(emails: list, files: List[UploadFile]):
    sender_email = "hackathons.hackstad@gmail.com"
    sender_password = "huxn oxkg swmz oqis"  # Handle passwords securely!

    for email in emails:
        try:
            # Create a new email message
            msg = EmailMessage()
            msg['Subject'] = 'Check out! Notification from HACKSTAD'
            msg['From'] = sender_email
            msg['To'] = email
            msg.set_content("YOU are assigned to the upcoming hackathon")

            # Attach each file
            for file in files:
                if not file or not file.filename:
                    print(f"Skipping invalid or empty file: {file}")
                    continue

                file_name = file.filename
                mime_type, encoding = guess_type(file_name)
                if mime_type is None:
                    mime_type = "application/octet-stream"
                
                app_type, sub_type = mime_type.split("/")
                file_data = file.file.read()

                if app_type == "application" and sub_type == "pdf":
                    print(f"Attaching PDF: {file_name}")
                elif app_type == "image":
                    print(f"Attaching Image: {file_name}")
                else:
                    print(f"Attaching Other File: {file_name}")

                msg.add_attachment(
                    file_data, maintype=app_type, subtype=sub_type, filename=file_name
                )

            # Connect to the SMTP server and send the email
            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                server.send_message(msg)

            print(f"Email sent to {email}")
        except Exception as e:
            print(f"Failed to send email to {email}: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to send email to {email}. Please try again later.")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta if expires_delta else datetime.utcnow() + timedelta(hours=10)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt



def str_to_objectid(id: str):
    try:
        return ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")
####


team_chats: Dict[str, Dict[str, Any]] = {}

# Chat data is stored for 10 minutes.
TEAM_CHAT_DURATION = timedelta(minutes=10)

async def expire_team_chat(chat_id: str):
    """Wait for TEAM_CHAT_DURATION and then clean up the team chat."""
    await asyncio.sleep(TEAM_CHAT_DURATION.total_seconds())
    if chat_id in team_chats:
        # Optionally close all connections.
        for ws in team_chats[chat_id].get("connections", []):
            try:
                await ws.close()
            except Exception:
                pass
        del team_chats[chat_id]
        print(f"Team chat {chat_id} expired and removed.")

async def get_current_user_ws(token: str = Query(...)):
    print("Received token:", token)
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials for WebSocket connection",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("Decoded payload:", payload)
        email: str = payload.get("sub")
        if email is None:
            print("No email found in token")
            raise credentials_exception
    except JWTError as e:
        print(f"JWT decoding error: {e}")
        raise credentials_exception

    user = await get_user_by_email(email)
    print("User lookup result:", user)
    if user is None:
        print("User not found")
        raise credentials_exception
    return user

def validate_password_strength(password: str):
    # Password length: at least 8 characters
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")
    
    # Check for at least one uppercase letter, one lowercase letter, one digit, and one special character
    if not re.search(r'[A-Z]', password):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter.")
    if not re.search(r'[a-z]', password):
        raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter.")
    if not re.search(r'[0-9]', password):
        raise HTTPException(status_code=400, detail="Password must contain at least one digit.")
    if not re.search(r'[\W_]', password):  # Special character check
        raise HTTPException(status_code=400, detail="Password must contain at least one special character.")


def generate_presigned_url(filename_url: str):
    if not filename_url:
        return None  # Return None for missing URLs
    try:
        filename = filename_url.split("/")[-1]
        bucket_name = "hackathonsite"
        expiration = 24 * 3600
        presigned_url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": filename},
            ExpiresIn=expiration
        )
        return presigned_url
    except ClientError as e:
        print(f"Error generating presigned URL: {str(e)}")  # Log error
        return None


# Temporary in-memory storage
def upload_file_to_s3(file: UploadFile, bucket_name: str) -> str:
    """
    Uploads an image file to AWS S3 and returns its URL.

    Args:
        file (UploadFile): The uploaded file to be stored.

    Returns:
        str: The URL of the uploaded image.
    """
    try:
        # Define the file name for S3
        filename = file.filename

        # Upload file to S3 without specifying ACL
        s3.upload_fileobj(
            file.file,
            bucket_name,
            filename,
            ExtraArgs={"ContentType": file.content_type}  # No ACL here
        )

        # Generate and return the S3 file URL
        file_url = f'https://{bucket_name}.s3.amazonaws.com/{filename}'
        return file_url

    except ClientError as e:
        raise Exception(f"Error uploading file: {e.response['Error']['Message']}")
