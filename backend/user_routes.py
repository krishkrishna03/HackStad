from datetime import timezone
import logging
import random
from typing import Set
from fastapi import APIRouter, Request, WebSocket, WebSocketDisconnect
from razorpay import Client
from database import *
from model import *
from bson.errors import InvalidId
import razorpay
from urllib.parse import quote 
import secrets

user_router = APIRouter()
razorpay_client = Client(auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_SECRET_KEY")))

temporary_user_data={}
@user_router.post("/user",response_model=UserRegistrationResponse)
async def register_user(user: Usersdata):
    # Validate password strength
    if not user.email:
        raise HTTPException(status_code=400, detail="Email is required for registration.")

    print(f"DEBUG: register_user received email: {user.email}")

    # Generate OTP
    await check_user(user.email)
    otp = random.randint(100000, 999999)
    print(f"user login otp :{otp}")
    send_otp_email(user.email, otp)
    
    # Store user data and OTP temporarily (e.g., in memory)
    temporary_user_data[otp] = {  # Store OTP as the key
        'user_data': user.dict()  # Temporarily store the user data
    }

    # Return response
    response = UserRegistrationResponse(
        message="OTP sent to your email. Please verify OTP to complete registration."
    )

    return response


class OtpVerification(BaseModel):
    otp: int

@user_router.post("/verify-otp")
async def verify_otp(otp_verification: OtpVerification):
    otp = otp_verification.otp
    # Check if OTP exists in temporary storage
    if otp not in temporary_user_data:
        raise HTTPException(status_code=404, detail="OTP expired or invalid")
    stored_data = temporary_user_data[otp]
    # Complete the registration by saving the user
    user_data = stored_data['user_data']
    # Save user to MongoDB
    response = await create_user(user_data)
    if response:
        # Clean up temporary data
        del temporary_user_data[otp]
        return {"message": "User registered successfully."}
    raise HTTPException(status_code=400, detail="Something went wrong during registration")


temp_user_email={}
@user_router.post("/userlogin")
async def login_for_access_token(request: Userloginrequest):
    email = request.email.strip().lower()  # Normalize email (strip spaces, lowercase)

    print(f"DEBUG: /userlogin received email: {email}")

    user = await get_user_by_email(email)  # Fetch user from DB

    if not user:
        print(f"DEBUG: User not found for email: {email}")
        raise HTTPException(
            status_code=400,
            detail="College email not found",
        )
    else:
        print(f"DEBUG: User found for email: {email}")

    # Generate and send OTP only if user exists
    otp = random.randint(100000, 999999)
    send_otp_email(email, otp)
    print(f"this is user otp : {otp}")
    # Store OTP with email for verification
    temp_user_email[otp] = {'user_email': email}

    return {"message": "OTP sent to your email."}


logging.basicConfig(level=logging.INFO)
@user_router.post("/verify-user")
async def user_login2(otp_user: OtpVerification):
    otp = int(otp_user.otp)
    logging.info(f"Received OTP: {otp}")
    logging.info(f"Temporary storage: {temp_user_email}")
    if otp not in temp_user_email:
        raise HTTPException(status_code=404, detail="OTP expired or invalid")
    
    user_email = temp_user_email.pop(otp)['user_email']
    logging.info(f"Successful login for: {user_email}")
    
    # Access token expires in 30 minutes
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user_email}, expires_delta=access_token_expires)
    
    # Refresh token expires in 30 days
    refresh_token = create_refresh_token(data={"sub": user_email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@user_router.post("/users/{email}/profile_picture") #user profile adding route
async def upload_profile_picture_user(email: str, profile_picture: UploadFile = File(...)):
    # Retrieve the user from the database
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Upload the profile picture to S3
    try:
        filename = profile_picture.filename
        s3.upload_fileobj(profile_picture.file, 'hackathonsite', filename)
        profile_picture_url = f'https://s3.amazonaws.com/hackathonsite/{filename}'
    except ClientError as e:
        raise HTTPException(status_code=500, detail="Error uploading profile picture: " + str(e))

    # Update the user's profile picture in the database
    userdata.update_one({"email": email}, {"$set": {"profile_picture": profile_picture_url}})

    return {"message": "Profile picture uploaded successfully"}

@user_router.post("/refresh-token")
async def refresh_token(request: RefreshTokenRequest):
    refresh_token = request.refresh_token
    try:
        # Verify refresh token and issue new access and refresh tokens
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        if not user_email:
            raise HTTPException(status_code=403, detail="Invalid refresh token")

        # Create new access token and refresh token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        new_access_token = create_access_token(data={"sub": user_email}, expires_delta=access_token_expires)
        new_refresh_token = create_refresh_token(data={"sub": user_email})

        return {"access_token": new_access_token, "refresh_token": new_refresh_token}
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid refresh token")

@user_router.get("/user/profile", response_model=UserProfileResponse)
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """
    Fetch the user's profile details.
    """
 # Check if current_user is a Future
    # current_user = await current_user

    user_profile = {
        "full_name": current_user.get("full_name"),
        "email": current_user.get("email"),
        "phone": current_user.get("phone"),
        "rollnum": current_user.get("rollnum"),
        "college": current_user.get("college"),
        "branch": current_user.get("branch"),
        "year_of_study": str(current_user.get("year_of_study")),
        "dob": current_user.get("dob"),
        "linkedin_url": current_user.get("linkedin_url"),
        "github_url": current_user.get("github_url"),
    }
    return user_profile



# @user_router.put("/user/profile/update")
# async def update_user_profile(
#     update_data: UserProfileUpdate,
#     current_user: dict = Depends(get_current_user)
# ):
#     """
#     Update the user's profile details.
#     """
#     if asyncio.isfuture(current_user):
#         current_user = await current_user

#     user_email = current_user.get("email")  # Fetch user email for reference

#     # Find and update the user profile
#     updated_user = await userdata.find_one_and_update(
#         {"email": user_email},
#         {"$set": update_data.dict()},
#         return_document=True  # Return updated document
#     )

#     if not updated_user:
#         raise HTTPException(status_code=404, detail="User profile not found or update failed.")

#     # Convert ObjectId to string for JSON serialization
#     updated_user["_id"] = str(updated_user["_id"])

#     return {"message": "Profile updated successfully", "updated_data": updated_user}

@user_router.put("/user/profile/update")
async def update_user_profile(
    full_name: str = Form(...),
    phone: str = Form(...),
    college: str = Form(...),
    branch: str = Form(...),
    year_of_study: int = Form(...),
    dob: str = Form(...),
    linkedin_url: str = Form(...),
    github_url: str = Form(...),
    profile_picture: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user)
):
    
    """
    Update the user's profile, including optional profile picture upload to S3.
    """
    if asyncio.isfuture(current_user):
        current_user = await current_user
    user_email = current_user.get("email")

    update_data = {
        "full_name": full_name,
        "phone": phone,
        "college": college,
        "branch": branch,
        "year_of_study": year_of_study,
        "dob": dob,
        "linkedin_url": linkedin_url,
        "github_url": github_url
    }

    # Handle profile picture upload to S3
    if profile_picture:
        try:
            filename = f"{user_email}_profile_{profile_picture.filename}"
            s3.upload_fileobj(profile_picture.file, 'hackathonsite', filename)
            profile_picture_url = f'https://s3.amazonaws.com/hackathonsite/{filename}'
            update_data["profile_picture"] = profile_picture_url
        except ClientError as e:
            raise HTTPException(status_code=500, detail="Error uploading profile picture: " + str(e))
    
    # Update the database
    updated_user = await userdata.find_one_and_update(
        {"email": user_email},
        {"$set": update_data},
        return_document=True)
    
    if not updated_user:
        raise HTTPException(status_code=404, detail="User profile not found or update failed.")
    updated_user["_id"] = str(updated_user["_id"])
    return {"message": "Profile updated successfully", "updated_data": updated_user}





@user_router.get("/live_hackathons", response_model=List[Hackathon_show])
async def get_live_hackathons():
    # Current IST time
    utc_now = datetime.utcnow().replace(tzinfo=timezone.utc)
    ist_offset = timedelta(hours=5, minutes=30)
    now_ist = utc_now + ist_offset
    # Convert IST back to UTC for database query
    now_utc = now_ist - ist_offset
    
    # Fetch hackathons that are starting today or in the future
    hackathons = await Hackathon_data.find(
        {"start_date": {"$gte": now_utc}}  # Compare with UTC time
    ).to_list(100)
    if not hackathons:
        print("No hackathons found for the future range.")
        return []
    #print(hackathons["category"])
    processed_hackathons = []
    for hackathon in hackathons:
        print(hackathon["_id"])
        processed_hackathons.append({
            "h_id" :str(hackathon["_id"]),
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
            "college_name":hackathon.get("college_name"),
            "description": hackathon.get("description", ""),
            "prize_pool": hackathon.get("prize_pool"),
            "hackathon_category": hackathon.get("hackathon_category", "No category"),  # Default fallback
            "problem_statement_text": hackathon.get("problem_statement_text",""),
            "poster_url": generate_presigned_url(hackathon.get("poster_url", "")),
            "problem_statements_url": generate_presigned_url(hackathon.get("problem_statements_url", "")),
            "timetable_url": generate_presigned_url(hackathon.get("timetable_url", "")),
        })
    # print(f"this is {processed_hackathons}")
    return processed_hackathons



@user_router.get("/hackathon_details")
async def get_hackathon_details(id: str):
    logging.info(f"Received hackathon_title: {id}")
    
    # Fetch the hackathon from the database using its title
    hackathon = await Hackathon_data.find_one({"_id": ObjectId(id)})
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")
    
    # Ensure _id is converted to a string correctly
    # print(hackathon["_id"])
    return {
        "id": str(hackathon["_id"]),  # Correctly converts ObjectId to string
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


@user_router.post("/register_free_hackathon")
async def register_free_hackathon(
    title: str,
    current_user: dict = Depends(get_current_user)  # FastAPI handles async dependencies
):
    # Ensure 'current_user' is awaited if needed
    user =  current_user 
    print(user)
    

    hackathon = await Hackathon_data.find_one({"title": title})
    
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    if hackathon["registration_fee"] > 0:
        raise HTTPException(status_code=400, detail="This route is only for free hackathons.")

    existing_registration = await registrations.find_one({
        "hackathon_title": str(hackathon["title"]),
        "user_email": user["email"]
    })
    if existing_registration:
        raise HTTPException(status_code=400, detail="You are already registered for this hackathon.")

    registration_data = {
        "user_id": ObjectId(user["_id"]),
        "user_email": user["email"],
        "user_name": user["full_name"],
        "user_college": user["college"],
        "hackathon_id": ObjectId(hackathon["_id"]),
        "hackathon_title": str(hackathon["title"]),
        "hosted_by": hackathon["college_name"],
        "college_email":hackathon["college_email"],
        "registered_date" : str(datetime.now()),
        "team_id": None,
        "status": "Approved",
    }
    await registrations.insert_one(registration_data)

    if hackathon["team"] == "team":
        return {"message": "Registration successful for team-based hackathon. Proceed to team creation or joining."}
    else:
        return {"message": "Registration successful for individual hackathon. Hackathon details are available."}


@user_router.get("/registered_hackathon", response_model=List[dict])
async def get_registered_hackathon_titles(
    current_user: dict = Depends(get_current_user)  # Get logged-in user
):
    user_id = current_user["_id"]  # Ensure `user_id` is a string
    print('user_id:', user_id)

    try:
        user_object_id = ObjectId(user_id)  # Convert to ObjectId
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    # Query MongoDB with ObjectId
    registered_hackathons = await registrations.find(
        {"user_id": user_object_id}  # Ensure it matches how it's stor  # Project required fields
    ).to_list(length=None)

    print('registered_hackathons:', registered_hackathons)

    if not registered_hackathons:
        raise HTTPException(status_code=404, detail="No hackathons found for the logged-in user.")

    # Format the registration data
    result = [
        {
            "registration_id": str(hackathon["_id"]),
            "hackathon_title": hackathon.get("hackathon_title"),
            "registered_date": hackathon.get("registred_date"),
            "hackathon_id": str(hackathon.get("hackathon_id")),
        }
        for hackathon in registered_hackathons
    ]

    print(f"7778 {result}")
    return result


@user_router.get("/registered_livehackathon", response_model=dict)
async def get_registered_hackathon_details(
    registration_id: str,
    current_user: dict = Depends(get_current_user)
):
    # Get the logged-in user's email
    user = current_user
    user_email = user["email"]

    # Validate registration_id and query MongoDB
    try:
        registration = await registrations.find_one(
            {"_id": ObjectId(registration_id), "user_email": user_email},  # Match ID and user email
            {"_id": 0, "hackathon_id": 1, "registered_date": 1}  # Project required fields
        )
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid registration ID format.")

    # Check if the registration exists
    if not registration:
        raise HTTPException(status_code=404, detail="No registration found with the given ID for the logged-in user.")
    print(registration.get("hackathon_id"))
    print(registration.get("registered_date"))
    return {
        "hackathon_id": str(registration.get("hackathon_id")),
        "registered_date": registration.get("registred_date"),
    }



@user_router.post("/register_paid_hackathon")
async def register_paid_hackathon(
    title: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Registers a user for a paid hackathon and creates a Razorpay payment order.
    """
    

    print("########################")
    
    # Fetch hackathon details
    hackathon = await Hackathon_data.find_one({"title": title})
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    if hackathon["registration_fee"] == 0:
        raise HTTPException(status_code=400, detail="This route is only for paid hackathons.")
    hackathon_id_str = str(hackathon["_id"])

    # Check if user is already registered
    user_id = ObjectId(current_user["_id"])  # Ensure user_id is treated as ObjectId
    existing_registration = await registrations.find_one({
        "user_id": user_id,
        "hackathon_id": hackathon_id_str
    })

    if existing_registration:
        print("User is already registered:", existing_registration)
        raise HTTPException(status_code=400, detail="You are already registered for this hackathon.")

    # Create Razorpay order
    amount_in_paisa = hackathon["registration_fee"] * 100
    payment_order = razorpay_client.order.create({
        "amount": amount_in_paisa,
        "currency": "INR",
        "receipt": f"userid_{current_user['_id']}",
        "notes": {
            "hackathon_id": str(hackathon["_id"]),
            "hackathon_title": hackathon["title"],
            "user_id": str(current_user["_id"])
        }
    })

    return {
        "order_id": payment_order["id"],
        "amount": hackathon["registration_fee"],
        "currency": "INR",
        "key_id": "RAZORPAY_KEY_ID"
    }


@user_router.post("/verify_payment")
async def verify_payment(request: Request, current_user: dict = Depends(get_current_user)):
    """
    Verifies the Razorpay payment and registers the user for the hackathon.
    """
    

    data = await request.json()

    payment_id = data.get("razorpay_payment_id")
    order_id = data.get("razorpay_order_id")
    signature = data.get("razorpay_signature")

    if not payment_id or not order_id or not signature:
        raise HTTPException(status_code=400, detail="Missing payment details")

    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature
        })
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Signature verification failed")

    payment_order = razorpay_client.order.fetch(order_id)
    hackathon_id = payment_order["notes"]["hackathon_id"]
    hackathon_title = payment_order["notes"]["hackathon_title"]

    user_id = ObjectId(current_user["_id"])  # Ensure user_id is treated as ObjectId
    existing_registration = await registrations.find_one({
        "hackathon_id": hackathon_id,
        "user_id": user_id
    })

    if existing_registration:
        raise HTTPException(status_code=400, detail="You are already registered for this hackathon.")

    registration_data = {
        "user_id": user_id,
        "hackathon_id": ObjectId(hackathon_id),
        "user_email": current_user["email"],
        "user_name": current_user.get("full_name"),
        "user_college": current_user["college"],
        "hackathon_title": hackathon_title,
        "registered_date": str(datetime.now()),
        "order_id": order_id,
        "payment_id": payment_id,
        "status": "Approved"
    }

    await registrations.insert_one(registration_data)

    return {"message": "Payment verified and registration successful!"}


@user_router.get("/get_hackathon_team")
async def get_hackathon_team(
    hackathon_id: str,
    current_user: dict = Depends(get_current_user)
):
    hackathon = await fetch_hackathon(hackathon_id)
    
    team = await TeamData.find_one({
        "hackathon_id": str(hackathon_id),
    })

    if not team:
        raise HTTPException(status_code=404, detail="No team found for this hackathon.")

    # Convert user_id to string for proper comparison
    current_user_id = str(current_user["_id"])

    # Check if current user is the team lead
    is_team_lead = str(team["team_lead"]["user_id"]) == current_user_id

    # Check if current user is in the team members list
    is_team_member = any(str(member["user_id"]) == current_user_id for member in team.get("team_members", []))

    if not (is_team_lead or is_team_member):
        raise HTTPException(status_code=403, detail="You are not part of this team.")

    return {
        "team_id": str(team["_id"]),  # Convert ObjectId to string
        "team_name": team["team_name"],
        "team_description": team["team_description"],
        "team_lead": {
            "user_id": str(team["team_lead"]["user_id"]),  # Convert ObjectId to string
            "name": team["team_lead"]["name"],
            "email": team["team_lead"]["email"],
            "phone": team["team_lead"]["phone"],
        },
        "team_members": [
            {
                "user_id": str(member["user_id"]),  # Convert ObjectId to string
                "name": member["name"],
                "email": member["email"],
                "phone": member["phone"],
            }
            for member in team.get("team_members", [])
        ],
        "max_team_size": team["max_team_size"],
        "team_code": team["team_code"],
        "pending_invites": team.get("pending_invites", [])
    }


@user_router.post("/create_team")
async def create_team(team_form: TeamForm, current_user: dict = Depends(get_current_user)):
    # Ensure current_user is resolved
    current_user =  current_user
    # Fetch hackathon details
    hackathon = await Hackathon_data.find_one({"_id": ObjectId(team_form.hackathon_id)})
    if hackathon.get("team") != "team":
        raise HTTPException(status_code=400, detail="This hackathon does not support team registrations")
    
    # Check if the current user has already created a team for this hackathon
    existing_team = await TeamData.find_one({
        "hackathon_id": team_form.hackathon_id,
        "team_lead.user_id": current_user["_id"]
    })
    if existing_team:
        raise HTTPException(status_code=400, detail="You have already created a team for this hackathon")
    
   
    # Validate team size: team lead is auto-added, so allowed invites = max_team_size - 1
    max_team_size = hackathon.get("no_of_people_in_team", 0)
    if len(team_form.team_members) > max_team_size - 1:
        raise HTTPException(status_code=400, detail=f"Maximum {max_team_size - 1} additional members allowed")
    
    # For paid hackathons, check if the team lead's registration is approved
    registration = await registrations.find_one({
        "hackathon_id": team_form.hackathon_id,
        "user_id": current_user["_id"]
    })
    if hackathon.get("registration_fee", 0) > 0 and (not registration or registration.get("status") != "Approved"):
        raise HTTPException(status_code=403, detail="Transaction approval required to create a team")

    # Generate a unique team code (8-character alphanumeric)
    team_code = secrets.token_hex(4).upper()

    # Prepare team data; include team lead's details from current_user
    team_data = {
        "team_name": team_form.team_name,
        "team_description": team_form.team_description,
        "team_lead": {
            "user_id": current_user["_id"],
            "name": current_user["full_name"],
            "email": current_user["email"],
            "phone": current_user.get("phone", "")
        },
        "mentor_email": hackathon.get("mentor_emails"),
        "hackathon_id": team_form.hackathon_id,
        "team_members": [{
            "user_id": current_user["_id"],
            "name": current_user["full_name"],
            "email": current_user["email"],
            "phone": current_user.get("phone", "")
        }],
        "max_team_size": max_team_size,
        "team_code": team_code,
        "pending_invites": []  # To store invitation records if needed
    }
    
    # Insert team data into the TeamData collection
    result = await TeamData.insert_one(team_data)
    team_id = str(result.inserted_id)

    # Send invites for additional team members using a single invitation URL
    for member in team_form.team_members:
        # Skip if the invited email is the team lead's email
        if member.email == current_user["email"]:
            continue
        
        # Generate a unique invitation token and set an expiry time (e.g., 24 hours)
        invite_token = secrets.token_urlsafe(16)
        expiry_time = datetime.utcnow() + timedelta(days=1)

        # Create an invitation record in the TeamInvites collection
        invite_data = {
            "team_id": team_id,
            "hackathon_id": team_form.hackathon_id,
            "email": member.email,
            "invite_token": invite_token,
            "expiry": expiry_time,
            "used": False
        }
        await TeamInvites.insert_one(invite_data)
        hackathon_title = hackathon.get("_id")
        hackathon_title_encoded = quote(hackathon_title)
        # Generate the invitation link (replace 'yourdomain.com' with your domain)
        BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")

        invite_link = f"{BASE_URL}/api/accept_invite?invite_token={invite_token}&hackathon={hackathon_title_encoded}"

        # invite_link = f"https://yourdomain.com/api/accept_invite?token={invite_token}"
        # Send the invitation email with the link
        send_team_invitations_email(member.email, invite_link)

    return {
        "message": "Team created successfully. Invitations sent.",
        "team_id": team_id,
        "team_code": team_code
    }


@user_router.get("/api/accept_invite")
async def accept_invite(invite_token: str, current_user: dict = Depends(get_current_user)):
    # Await the dependency to get the actual user data
    user =  current_user
    print(f'this is line {user}')
    if not user:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
    # Validate the invitation token
    invite = await TeamInvites.find_one({"invite_token": invite_token})
    if not invite or invite["used"] or invite["expiry"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired invite link")
    
    # Ensure the invitation email matches the current user's email
    if user["email"] != invite["email"]:
        raise HTTPException(status_code=403, detail="This invitation is not for your email")
    
    # Check if the user is registered for the hackathon
    registration = await registrations.find_one({
        "hackathon_id": invite["hackathon_id"],
        "user_id": user["_id"]
    })
    if not registration or registration.get("status") != "Approved":
        # Auto-register the user for the hackathon (simplified; adjust as needed)
        new_registration = {
            "hackathon_id": invite["hackathon_id"],
            "user_id": user["_id"],
            "status": "Approved",  # Automatically approve for demonstration purposes
            "registered_at": datetime.utcnow()
        }
        await registrations.insert_one(new_registration)
    
    # Fetch the team details
    team = await TeamData.find_one({"_id": ObjectId(invite["team_id"])})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Check if the team is already full
    if len(team["team_members"]) >= team["max_team_size"]:
        raise HTTPException(status_code=400, detail="Team is already full")
    
    # Check if the user is already a member of the team
    if any(member["user_id"] == user["_id"] for member in team["team_members"]):
        raise HTTPException(status_code=400, detail="You are already a member of this team")
    
    # Add the user to the team
    new_member = {
        "user_id": user["_id"],
        "name": user["full_name"],
        "email": user["email"],
        "phone": user.get("phone", "")
    }
    await TeamData.update_one(
        {"_id": ObjectId(invite["team_id"])},
        {"$push": {"team_members": new_member}}
    )
    
    # Mark the invitation as used so it cannot be reused
    await TeamInvites.update_one({"invite_token": invite_token}, {"$set": {"used": True}})
    return {"message": "You have successfully joined the team"}


@user_router.post("/api/join_team")
async def join_team(join_request: JoinTeamRequest, current_user: dict = Depends(get_current_user)):
    # Check if the user exists in our system
    user_exists = await userdata.find_one({"_id": current_user["_id"]})
    if not user_exists:
        raise HTTPException(status_code=403, detail="You must have an account on our site to join a team")

    # Find the team using teamId from the request
    team = await TeamData.find_one({"_id": ObjectId(join_request.teamId)})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Check if the user is already in the team
    if any(member["user_id"] == current_user["_id"] for member in team["team_members"]):
        raise HTTPException(status_code=400, detail="You are already a member of this team")

    # Check if the team is full
    if len(team["team_members"]) >= team["max_team_size"]:
        raise HTTPException(status_code=400, detail="Team is already full")

    # Check if the user is registered for the hackathon
    registration = await registrations.find_one({
        "hackathon_id": team["hackathon_id"],
        "user_id": current_user["_id"]
    })
    if not registration or registration.get("status") != "Approved":
        raise HTTPException(status_code=403, detail="You must register for the hackathon before joining a team")

    # Add user to the team
    new_member = {
        "user_id": current_user["_id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "phone": current_user.get("phone", "")
    }
    await TeamData.update_one(
        {"_id": ObjectId(join_request.teamId)},
        {"$push": {"team_members": new_member}}
    )

    return {"message": "You have successfully joined the team"}

@user_router.get("/hackathon_teams", response_model=List[TeamDataModel])
async def hackathon_teams(hackathon_id: str, current_user: dict = Depends(get_current_user)):
    # Fetch all the teams for the given hackathon
    teams = await TeamData.find({"hackathon_id": hackathon_id}).to_list(length=100)
    if not teams:
        raise HTTPException(status_code=404, detail="No teams found for this hackathon")
    
    # Helper function to convert user objects (team_lead and team_members)
    def convert_user(user_obj):
        return {
            "user_id": str(user_obj.get("user_id")),  # Convert the user_id ObjectId to string
            "name": user_obj.get("name"),
            "email": user_obj.get("email"),
            "phone": user_obj.get("phone")
        }
    
    # Prepare the response data
    response_data = []
    for team in teams:
        team_data = {
            "_id": str(team["_id"]),  # Convert ObjectId to str
            "team_name": team["team_name"],
            "team_description": team.get("team_description", ""),
            "team_lead": convert_user(team["team_lead"]),
            "hackathon_id": team["hackathon_id"],
            "team_members": [convert_user(member) for member in team["team_members"]],
            "max_team_size": team["max_team_size"],
            "team_code": team["team_code"],
            "pending_invites": team.get("pending_invites", [])
        }
        response_data.append(team_data)
    
    return response_data


@user_router.get("/live_registered_hackathons")
async def live_registered_hackathons(current_user: dict = Depends(get_current_user)):
    # Fetch all the hackathons the user is registered for
    registrations_data = await registrations.find({"user_id": current_user["_id"]}).to_list(length=100)
    live_hackathons = []
    # Check each registration
    for registration in registrations_data:
        hackathon = await Hackathon_data.find_one({"_id": ObjectId(registration["hackathon_id"])})
        
        if hackathon:
            # Ensure the hackathon is live and the user is approved
            if hackathon["start_date"] <= datetime.datetime.now() and registration["status"] == "Approved":
                hackathon_details = {
                    "hackathon_id": str(hackathon["_id"]),
                    "hackathon_name": hackathon["name"],
                }
                
                # Check if hackathon is free or paid
                if hackathon["registration_fee"] == 0:
                    # If free hackathon
                    
                    if hackathon.get("is_team"):
                        # If team hackathon (free)
                        if registration.get("team_id"):
                            # User is part of a team
                            team = await TeamData.find_one({"_id": ObjectId(registration["team_id"])})
                            if team:
                                hackathon_details["team_id"] = str(team["_id"])
                                hackathon_details["team_name"] = team["team_name"]
                                hackathon_details["status"] = "team"
                        else:
                            hackathon_details["status"] = "team_create_join"
                    else:
                        # If individual hackathon (free)
                        hackathon_details["status"] = "individual"
                else:
                    # If paid hackathon, and transaction is approved
                    if registration["status"] == "Approved" and hackathon["registration_fee"] > 0:
                        if hackathon.get("is_team"):
                            # If team hackathon (paid)
                            if registration.get("team_id"):
                                # User is part of a team
                                team = await TeamData.find_one({"_id": ObjectId(registration["team_id"])})
                                if team:
                                    hackathon_details["team_id"] = str(team["_id"])
                                    hackathon_details["team_name"] = team["team_name"]
                                    hackathon_details["status"] = "team"
                            else:
                                hackathon_details["status"] = "team_create_join"
                        else:
                            # If individual hackathon (paid)
                            hackathon_details["status"] = "individual"
                    
                # Append to the list of live hackathons the user can access
                live_hackathons.append(hackathon_details)
    
    if not live_hackathons:
        raise HTTPException(status_code=404, detail="No live hackathons found for the user.")
    
    return {"live_hackathons": live_hackathons}



# @user_router.websocket("/team_chat")
# async def team_chat_endpoint(websocket: WebSocket):
#     """
#     WebSocket endpoint for team chat.
#     The endpoint checks the hackthon_teams collection to verify that the current user
#     belongs to a team. If so, it starts (or joins) a group chat for that team.
#     """
#     # Accept the connection first.
#     await websocket.accept()
#     await websocket.send_text("Hello from test_ws")
#     token = websocket.query_params.get("token")
#     if not token:
#         await websocket.send_text("Authentication token is missing.")
#         await websocket.close(code=1008)
#         return

#     # Now authenticate manually
#     try:
#         current_user = await get_current_user(token)
#         print(f'{current_user["_id"]} is the current user')
#          # implement your token decoding logic here
#     except Exception as e:
#         await websocket.send_text("Invalid token.")
#         await websocket.close(code=1008)
#         return
#     # Query for a team where the current user is either the team lead or a team member.
#     team = await TeamData.find_one({
#     "$or": [
#         {"team_lead.user_id": ObjectId(current_user["_id"])},
#         {"team_members.user_id": ObjectId(current_user["_id"])}
#     ]
# })

#     if not team:
#         await websocket.send_text("You are not part of any team.")
#         await websocket.close()
#         return

#     # Extract all team user IDs (include team lead and all team members)
#     # Extract all team user IDs (include team lead and all team members)
#     team_member_ids: Set[str] = set()
#     if "team_lead" in team and "user_id" in team["team_lead"]:
#         team_member_ids.add(str(team["team_lead"]["user_id"]))  # Convert ObjectId to str
#     for member in team.get("team_members", []):
#         if "user_id" in member:
#             team_member_ids.add(str(member["user_id"]))  # Convert ObjectId to str

#     # Ensure the current user is included.
#     team_member_ids.add(str(current_user["_id"]))  # Convert current_user["_id"] to str

#     # Create a chat_id based on sorted team member IDs (this ensures the same ID for the same team)
#     chat_id = "_".join(sorted(team_member_ids))
#     print(f"Team chat ID for team members {team_member_ids}: {chat_id}")


#     # Create a new team chat session if not already present.
#     if chat_id not in team_chats:
#         team_chats[chat_id] = {
#             "participants": list(team_member_ids),
#             "connections": [],
#             "messages": [],
#             "created": datetime.utcnow()
#         }
#         # Schedule auto-expiry after TEAM_CHAT_DURATION.
#         asyncio.create_task(expire_team_chat(chat_id))

#     # Add this connection to the chat session.
#     team_chats[chat_id]["connections"].append(websocket)

#     # Send initial confirmation and past messages.
#     await websocket.send_text(f"Joined team chat for team: {team.get('team_name', 'Unknown')}")
#     for msg in team_chats[chat_id]["messages"]:
#         await websocket.send_text(msg)

#     try:
#         # Main loop: receive messages and broadcast to all team connections.
#         while True:
#             message = await websocket.receive_text()
#             timestamp = datetime.utcnow().isoformat()
#             full_message = f"[{timestamp}] {current_user['full_name']}: {message}"
#             team_chats[chat_id]["messages"].append(full_message)
#             for conn in team_chats[chat_id]["connections"]:
#                 try:
#                     await conn.send_text(full_message)
#                 except Exception as e:
#                     print(f"Error sending message: {e}")
#     except WebSocketDisconnect:
#         # Remove the disconnected WebSocket.
#         if websocket in team_chats[chat_id]["connections"]:
#             team_chats[chat_id]["connections"].remove(websocket)
#         # Optionally, broadcast that the user disconnected.
#         disconnect_msg = f"{current_user['username']} has disconnected."
#         for conn in team_chats[chat_id]["connections"]:
#             try:
#                 await conn.send_text(disconnect_msg)
#             except Exception:
#                 pass
from collections import deque
from datetime import datetime, timedelta
import bleach

RATE_LIMIT = 5  # messages
RATE_LIMIT_WINDOW = timedelta(seconds=10)
team_chats = {}
message_timestamps = {}  # Format: {(user_id, chat_id): [timestamp1, timestamp2, ...]}
@user_router.websocket("/team_chat")
async def team_chat_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for team chat.
    The endpoint verifies that the user is part of a team in the given hackathon.
    If valid, the user is added to a chat session for their team.
    """
    # Accept the WebSocket connection
    await websocket.accept()

    # Extract query parameters
    # token = websocket.query_params.get("token")
    hackathon_id = websocket.query_params.get("hackathon_id")
    auth_header = websocket.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        await websocket.send_text("Missing or invalid Authorization header.")
        await websocket.close(code=1008)
        return

    token = auth_header.split("Bearer ")[1]
    # if not token:
    #     await websocket.send_text("Authentication token is missing.")
    #     await websocket.close(code=1008)
    #     return

    if not hackathon_id:
        await websocket.send_text("Hackathon ID is missing.")
        await websocket.close(code=1008)
        return

    # Authenticate user
    try:
        current_user = await get_current_user(token)
        user_id = ObjectId(current_user["_id"])  # Convert to ObjectId
    except Exception:
        await websocket.send_text("Invalid token.")
        await websocket.close(code=1008)
        return

    # Check if hackathon exists
    hackathon = await Hackathon_data.find_one({"_id": ObjectId(hackathon_id)})
    if not hackathon:
        await websocket.send_text("Invalid hackathon ID.")
        await websocket.close(code=1008)
        return

    # Query for a team in the specified hackathon
    team = await TeamData.find_one({
        "hackathon_id": ObjectId(hackathon_id),
        "$or": [
            {"team_lead.user_id": user_id},
            {"team_members.user_id": user_id}
        ]
    })

    if not team:
        await websocket.send_text("You are not part of any team in this hackathon.")
        await websocket.close()
        return

    # Extract all team user IDs (team lead + team members)
    team_member_ids: Set[str] = set()
    if "team_lead" in team and "user_id" in team["team_lead"]:
        team_member_ids.add(str(team["team_lead"]["user_id"]))
    for member in team.get("team_members", []):
        if "user_id" in member:
            team_member_ids.add(str(member["user_id"]))

    # Ensure the current user is included
    team_member_ids.add(str(user_id))

    # Generate a unique chat_id for this team within the hackathon
    chat_id = f"{hackathon_id}_" + "_".join(sorted(team_member_ids))
    print(f"Team chat ID for team members {team_member_ids}: {chat_id}")

    # Create a new team chat session if not already present
    if chat_id not in team_chats:
        team_chats[chat_id] = {
            "hackathon_id": hackathon_id,
            "participants": list(team_member_ids),
            "connections": [],
            "messages": [],
            "created": datetime.utcnow()
        }
        asyncio.create_task(expire_team_chat(chat_id))  # Auto-expiry task

    # Add this WebSocket connection to the chat session
    team_chats[chat_id]["connections"].append(websocket)

    # Send confirmation and previous messages
    await websocket.send_text(f"Joined team chat for team: {team.get('team_name', 'Unknown')}")

    # Fetch and send past messages from MongoDB
    cursor = TeamChatMessages.find({"chat_id": chat_id}).sort("timestamp", 1)
    async for doc in cursor:
        ts = doc["timestamp"].isoformat()
        sender = doc["sender_name"]
        msg = f"[{ts}] {sender}: {doc['message']}"
        await websocket.send_text(msg)


    try:
        # Main chat loop: receive and broadcast messages
        while True:
            message = bleach.clean(message, tags=[], strip=True)

            # Rate limiting (5 messages per 10 seconds)
            RATE_LIMIT = 5
            RATE_LIMIT_WINDOW = timedelta(seconds=10)
            now = datetime.utcnow()
            key = (str(user_id), chat_id)

            if key not in message_timestamps:
                message_timestamps[key] = deque()

            # Clean up old timestamps
            while message_timestamps[key] and now - message_timestamps[key][0] > RATE_LIMIT_WINDOW:
                message_timestamps[key].popleft()

            if len(message_timestamps[key]) >= RATE_LIMIT:
                await websocket.send_text("Rate limit exceeded. Please wait.")
                continue

            message_timestamps[key].append(now)

            timestamp = datetime.utcnow().isoformat()
            full_message = f"[{timestamp}] {current_user['full_name']}: {message}"
                # Store message in MongoDB
            await TeamChatMessages.insert_one({
                "chat_id": chat_id,
                "sender_id": user_id,
                "sender_name": current_user['full_name'],
                "message": message,
                "timestamp": now
            })
            team_chats[chat_id]["messages"].append(full_message)

            for conn in team_chats[chat_id]["connections"]:
                try:
                    await conn.send_text(full_message)
                except Exception:
                    pass  # Handle disconnected clients
    except WebSocketDisconnect:
        # Remove the disconnected WebSocket
        team_chats[chat_id]["connections"].remove(websocket)
        disconnect_msg = f"{current_user['username']} has disconnected."
        
        for conn in team_chats[chat_id]["connections"]:
            try:
                await conn.send_text(disconnect_msg)
            except Exception:
                pass  # Ignore failures


@user_router.post("/submission", response_model=SubmissionForm)
async def hackathon_submissions(submission: SubmissionForm, current_user: dict = Depends(get_current_user)):
    data = submission.dict()
    print(f'this is the data {data}')

    # Fetch the hackathon details
    hackathon = await Hackathon_data.find_one({"_id": ObjectId(data["hackathon_id"])})
    print(f'Hackathon details: {hackathon}')
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    # Get mentor emails and fetch their IDs
    mentor_emails = hackathon.get("mentor_emails", [])
    print(f'Mentor emails from hackathon: {mentor_emails}')
    clean_emails = [email.strip().lower() for email in mentor_emails]
    mentors = await MentorData.find({"email": {"$in": clean_emails}}).to_list(length=None)
    print(f'Mentors found: {mentors}')
    mentor_ids = [str(mentor["_id"]) for mentor in mentors]
    print(f'this is the mentor ids {mentor_ids}')
    if not mentors:
        print(f"MentorData collection sample: {await MentorData.find().to_list(length=5)}")

    # Fetch the team details
    team = await TeamData.find_one({"_id": ObjectId(data["team_id"])})
    print(f'this is the team {team}')
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Check if the current user is the team lead
    if str(team.get("team_lead", {}).get("user_id")) != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Only the team lead can submit projects")

    existing_submission = await HackathonSubmissions.find_one({"team_id":data["team_id"]})
    if existing_submission:
        raise HTTPException(status_code=400,detail="Submission already exists for this team and hackathon")

    # Prepare submission data
    submission_data = {
        "hackathon_id": data["hackathon_id"],
        "team_id": data["team_id"],
        "project_title": data["project_title"],
        "problem_statement": data["problem_statement"],
        "project_description": data["project_description"],
        "linkedin_url": data["linkedin_url"],
        "github_url": data["github_url"],
        "other_url": data["other_url"],
        "mentor_ids": mentor_ids,
        "team_lead": current_user["_id"],
        "submitted_at": datetime.utcnow().isoformat() + "Z",
        "hackathon_end_time": hackathon.get("end_time")
    }

    # Store the submission (assuming a Submissions collection)
    Submissions_data = HackathonSubmissions
    await Submissions_data.insert_one(submission_data)

    return submission_data


###################### add this in mentor routes 
@user_router.websocket("/hackathon_chat")
async def hackathon_chat_endpoint(websocket: WebSocket):
    """
    WebSocket for hackathon-wide chat.
    Allows registered participants and assigned mentors to join.
    """
    # Accept WebSocket connection
    await websocket.accept()

    # Extract query parameters
    token = websocket.query_params.get("token")
    hackathon_id = websocket.query_params.get("hackathon_id")

    if not token:
        await websocket.send_text("Authentication token is missing.")
        await websocket.close(code=1008)
        return

    if not hackathon_id:
        await websocket.send_text("Hackathon ID is missing.")
        await websocket.close(code=1008)
        return

    # Authenticate user
    try:
        current_user = await get_current_user(token)
        user_id = ObjectId(current_user["_id"])  # Convert to ObjectId
        user_email = current_user["email"]
    except Exception:
        await websocket.send_text("Invalid token.")
        await websocket.close(code=1008)
        return

    # Get Hackathon data
    hackathon = await Hackathon_data.find_one({"_id": ObjectId(hackathon_id)})
    if not hackathon:
        await websocket.send_text("Invalid hackathon ID.")
        await websocket.close(code=1008)
        return

    # Check if the user is a registered participant
    is_participant = await registrations.find_one({
        "hackathon_id": ObjectId(hackathon_id),
        "participants.user_id": user_id
    })

    # Check if the user is a mentor (email match)
    is_mentor = user_email in hackathon.get("mentors", [])

    if not is_participant and not is_mentor:
        await websocket.send_text("You are not a participant or mentor in this hackathon.")
        await websocket.close(code=1008)
        return

    # Generate chat_id for the hackathon-wide chat room
    chat_id = f"hackathon_chat_{hackathon_id}"

    # Create a new hackathon chat session if not already present
    if chat_id not in team_chats:
        team_chats[chat_id] = {
            "hackathon_id": hackathon_id,
            "participants": [],
            "connections": [],
            "messages": [],
            "created": datetime.utcnow()
        }
        asyncio.create_task(expire_team_chat(chat_id))  # Auto-expiry task

    # Add user to the chat session
    team_chats[chat_id]["connections"].append(websocket)
    team_chats[chat_id]["participants"].append(str(user_id))

    # Send confirmation and previous messages
    await websocket.send_text(f"Joined hackathon chat for {hackathon['name']}.")
    for msg in team_chats[chat_id]["messages"]:
        await websocket.send_text(msg)

    try:
        # Main chat loop: receive and broadcast messages
        while True:
            message = await websocket.receive_text()
            timestamp = datetime.utcnow().isoformat()
            full_message = f"[{timestamp}] {current_user['full_name']}: {message}"
            team_chats[chat_id]["messages"].append(full_message)

            for conn in team_chats[chat_id]["connections"]:
                try:
                    await conn.send_text(full_message)
                except Exception:
                    pass  # Handle disconnected clients
    except WebSocketDisconnect:
        # Remove the disconnected WebSocket
        team_chats[chat_id]["connections"].remove(websocket)
        disconnect_msg = f"{current_user['username']} has left the chat."

        for conn in team_chats[chat_id]["connections"]:
            try:
                await conn.send_text(disconnect_msg)
            except Exception:
                pass  # Ignore failures


class IndividualSubmissionForm(BaseModel):
    hackathon_id: str
    project_title: str
    problem_statement: str
    project_description: str
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    other_url: Optional[str] = None
    mentor_ids: Optional[List[str]] = None
    submitted_at: Optional[datetime] = None
    hackathon_end_time: Optional[datetime] = None
@user_router.post("/individualsubmission", response_model=IndividualSubmissionForm)
async def individual_hackathon_submission(submission: IndividualSubmissionForm, current_user: dict = Depends(get_current_user)):
    data = submission.dict()
    print(f"Individual submission data: {data}")

    # Fetch the hackathon details
    hackathon = await Hackathon_data.find_one({"_id": ObjectId(data["hackathon_id"])})
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    # ✅ Check if the hackathon is individual type
    if hackathon.get("team", "").lower() != "individual":
        raise HTTPException(status_code=403, detail="This hackathon does not allow individual submissions")

    # ✅ Check if the user has already submitted individually
    existing_submission = await HackathonSubmissions.find_one({
        "user_id": current_user["_id"],
        "hackathon_id": data["hackathon_id"]
    })
    if existing_submission:
        raise HTTPException(status_code=400, detail="You have already submitted for this hackathon")

    # ✅ Get mentor IDs
    mentor_emails = hackathon.get("mentor_emails", [])
    clean_emails = [email.strip().lower() for email in mentor_emails]
    mentors = await MentorData.find({"email": {"$in": clean_emails}}).to_list(length=None)
    mentor_ids = [str(mentor["_id"]) for mentor in mentors]

    # ✅ Prepare the submission data
    submission_data = {
        "hackathon_id": data["hackathon_id"],
        "user_id": current_user["_id"],  # Only for individual submission
        "project_title": data["project_title"],
        "problem_statement": data["problem_statement"],
        "project_description": data["project_description"],
        "linkedin_url": data.get("linkedin_url"),
        "github_url": data.get("github_url"),
        "other_url": data.get("other_url"),
        "mentor_ids": mentor_ids,
        "submitted_at": datetime.utcnow().isoformat() + "Z",
        "hackathon_end_time": hackathon.get("end_time")
    }

    await HackathonSubmissions.insert_one(submission_data)

    return submission_data

mentor_participant_chats = {}
import json
@user_router.websocket("/mentor_participant_chat")
async def mentor_participant_chat_endpoint(websocket: WebSocket):
    await websocket.accept()

    token = websocket.query_params.get("token")
    hackathon_id = websocket.query_params.get("hackathon_id")

    if not token or not hackathon_id:
        await websocket.close(code=1008)
        return

    try:
        current_user = await get_current_user(token)
        user_id = ObjectId(current_user["_id"])
        is_mentor = False
    except:
        try:
            current_user = await get_current_mentor(token)
            user_id = ObjectId(current_user["_id"])
            is_mentor = True
        except:
            await websocket.close(code=1008)
            return

    hackathon = await Hackathon_data.find_one({"_id": ObjectId(hackathon_id)})
    if not hackathon:
        await websocket.close(code=1008)
        return
#wait ill fix this 
    role = None

    mentor_emails = hackathon.get("mentor_emails", [])
    mentor_email = current_user.get("email")

    if is_mentor and (
        str(user_id) == str(hackathon.get("mentor_id")) or
        mentor_email in mentor_emails
    ):
        role = "mentor"
    elif not is_mentor:
        registration = await registrations.find_one({
            "hackathon_id": ObjectId(hackathon_id),
            "user_id": ObjectId(user_id)
        })
        if registration:
            role = "participant"

    if not role:
        await websocket.close(code=1008)
        return

    chat_id = f"mentor_participants_{hackathon_id}"

    if chat_id not in mentor_participant_chats:
        mentor_participant_chats[chat_id] = {
            "hackathon_id": hackathon_id,
            "connections": [],
            "messages": [],
            "created": datetime.utcnow()
        }

    mentor_participant_chats[chat_id]["connections"].append(websocket)

    # Send previous messages
    for msg in mentor_participant_chats[chat_id]["messages"]:
        await websocket.send_json(msg)

    try:
        while True:
            data = await websocket.receive_text()
            data = json.loads(data)

            message_text = data.get("text")
            timestamp = datetime.utcnow().isoformat()

            message = {
                "text": message_text,
                "sender_name": current_user.get("full_name") or current_user.get("name","unknown"),
                "timestamp": timestamp,
                "is_mentor": is_mentor
            }

            mentor_participant_chats[chat_id]["messages"].append(message)

            for conn in mentor_participant_chats[chat_id]["connections"]:
                try:
                    await conn.send_json(message)
                except:
                    pass
    except WebSocketDisconnect:
        mentor_participant_chats[chat_id]["connections"].remove(websocket)

