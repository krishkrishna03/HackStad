import asyncio
import json
from mimetypes import guess_type
import smtplib
import random
import string
from urllib.parse import urlparse
from fastapi import APIRouter, FastAPI, HTTPException ,Depends, Header, Query, Request, WebSocket, WebSocketDisconnect ,status,Path,Body,UploadFile, File,Form
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
import httpx
from pydantic_core import Url
import razorpay
# from faculty_routes import faculty_router
from model import *
##########################################################################
from pydantic import BaseModel
from typing import Any, Dict, Optional, Set 
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
import re
from fastapi.responses import FileResponse
from database import *
from database import fs ,userdata
import boto3
from botocore.exceptions import ClientError
from typing import List
from email.message import EmailMessage

from razorpay import Client
from botocore.exceptions import NoCredentialsError
from user_routes import *
from faculty_routes import *
from mentor_routes import *
from college_routes import *
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 30 minutes
REFRESH_TOKEN_EXPIRE_DAYS = 30  # 30 days


app = FastAPI()


##############
#aws id code

import boto3
# Replace 'your-region-name' with your bucket's actual region (e.g., 'us-east-1', 'ap-south-1', etc.)

#################################################################
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_router)
app.include_router(faculty_router)
app.include_router(mentor_routes)
app.include_router(college_router)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

#user related codes 
# Hackathon Details Endpoint

#####################################################################################################################

@app.get("/mentor/hackathons/{mentor_id}")
async def get_hackathons_for_faculty(mentor_id: str):
    # Fetch mentor data using mentor_id

    mentor = await MentorData.find_one({"_id": mentor_id})

    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found.")

    mentor_email = mentor["email"]

    # Fetch hackathons where mentor's email exists in the mentor_emails array
    hackathons_cursor = Hackathon_data.find({"mentor_emails": {"$in": [mentor_email]}})
    hackathons = await hackathons_cursor.to_list(length=None)
    if not hackathons:
        raise HTTPException(status_code=404, detail="No hackathons found for this mentor.")

    return [
        {
            "id": str(hackathon["_id"]),  # Converts ObjectId to string
            "title": hackathon["title"],
            "start_date": hackathon["start_date"],
            "end_date": hackathon["end_date"],
            "register_deadline": hackathon["register_deadline"],
            "team": hackathon.get("team"),
            "no_of_people_in_team": hackathon.get("no_of_people_in_team"),
            "hackathon_type": hackathon["hackathon_type"],
            "hackathon_mode": hackathon["hackathon_mode"],
            "registration_fee": hackathon.get("registration_fee", 0),
            "location": hackathon.get("location"),
            "max_participants": hackathon.get("max_participants", 0),
            "mentor_emails": hackathon["mentor_emails"],
            "college_email": hackathon.get("college_email"),
            "college_id": hackathon.get("college_id"),
            "college_name": hackathon.get("college_name"),
            "description": hackathon.get("description", ""),
            "prize_pool": hackathon.get("prize_pool"),
            "hackathon_category": hackathon.get("hackathon_category", ""),
            "problem_statement_text": hackathon.get("problem_statement_text", ""),
            "poster_url": generate_presigned_url(hackathon.get("poster_url", "")),
            "problem_statements_url": generate_presigned_url(hackathon.get("problem_statements_url", "")),
            "timetable_url": generate_presigned_url(hackathon.get("timetable_url", ""))
        }
        for hackathon in hackathons
    ]

###########################################################################################################################



#######################################################################################################
