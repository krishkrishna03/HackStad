import logging
import random
import time
from fastapi import APIRouter, HTTPException
from model import *
from database import *

college_router = APIRouter()

temporary_college_data={}



@college_router.post('/college', response_model=CollegeRegistrationResponse)
async def register_college(college: CollegeRegistration):
    # Generate OTP
    college_email = college.college_email
    existing_college = await get_college_by_email(college_email)
    if existing_college:
        raise HTTPException(status_code=400, detail="College email already exists")
    otp = random.randint(100000, 999999)
    send_otp_email(college.college_email, otp)

    # Temporarily store college data
    temporary_college_data[otp] = {
        'college_data': college.dict(),
        'timestamp': time.time()
    }

    # Return response
    return CollegeRegistrationResponse(
        message="OTP sent to your email. Please verify OTP to complete registration."
    )

@college_router.post('/college-verify-otp')
async def verify_college_otp(otp_verification: OtpVerification):
    otp = otp_verification.otp
    # Check if OTP exists in temporary storage
    if otp not in temporary_college_data:
        raise HTTPException(status_code=404, detail="OTP expired or invalid")
    
    # Check if OTP is expired (e.g., valid for 5 minutes)
    data = temporary_college_data[otp]
    if time.time() - data['timestamp'] > 300:  # 300 seconds = 5 minutes
        del temporary_college_data[otp]
        raise HTTPException(status_code=404, detail="OTP expired or invalid")

    stored_data = temporary_college_data[otp]
    # Complete the registration by saving the user
    college_data = stored_data['college_data']
    
    # Save user to MongoDB
    response = await create_college(college_data)
    if response:
        # Clean up temporary data
        del temporary_college_data[otp]
        return {"message": "College registered successfully."}

    raise HTTPException(status_code=400, detail="Something went wrong during registration")


temporary_college_email={}
# @college_router.post("/collegelogin")
# async def login_college_1(request: CollegeLoginRequest):
#     email = request.email
#     user = await get_college_by_email(email)
#     if not user :
#         raise HTTPException(status_code=400, detail="college email not found")
#     otp = random.randint(100000, 999999)
#     send_otp_email(email, otp)
#     temporary_college_email[otp] = {  # Store OTP as the key
#         'college_email': email
#             # Temporarily store the user data
#     }
#     response = CollegeloginResponse(
#         message="OTP sent to your email."
#     )
#     return response
@college_router.post("/collegelogin")
async def login_college_1(request: CollegeLoginRequest):
    email = request.email.lower()  # Standardize email format
    user = await get_college_by_email(email)

    if not user:
        raise HTTPException(status_code=400, detail="This college is not registered.")

    # Generate OTP
    otp = random.randint(100000, 999999)

    try:
        send_otp_email(email, otp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending OTP: {str(e)}")

    # Store the OTP against the email
    temporary_college_email[otp] = {
        'college_email': email
    }

    logging.info(f"OTP {otp} sent to {email}")
    return CollegeloginResponse(message="OTP has been sent to your registered email.")


logging.basicConfig(level=logging.INFO)

# @college_router.post("/completecollegelogin")
# async def login_college_2(otp_verification: OtpVerification):
#     otp = int(otp_verification.otp)
#     logging.info(f"Received OTP: {otp}")
#     logging.info(f"Temporary storage: {temporary_college_email}")
#     if otp not in temporary_college_email:
#         raise HTTPException(status_code=404, detail="OTP expired or invalid")
#     college_email = temporary_college_email.pop(otp)['college_email']
#     logging.info(f"Successful login for: {college_email}")
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(data={"sub": college_email}, expires_delta=access_token_expires)
#     refresh_token = create_refresh_token(data={"sub": college_email})
#     return {"access_token": access_token, "refresh_token": refresh_token,"token_type": "bearer"}
@college_router.post("/completecollegelogin")
async def login_college_2(otp_verification: OtpVerification):
    otp = int(otp_verification.otp)

    logging.info(f"Received OTP: {otp}")
    logging.info(f"Temporary storage: {temporary_college_email}")

    if otp not in temporary_college_email:
        raise HTTPException(status_code=404, detail="Invalid or expired OTP.")

    college_email = temporary_college_email.pop(otp)["college_email"]

    # Double-check in DB before login
    user = await get_college_by_email(college_email)
    if not user:
        raise HTTPException(status_code=404, detail="College email not found.")

    # Generate tokens
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": college_email}, expires_delta=access_token_expires)
    refresh_token = create_refresh_token(data={"sub": college_email})

    logging.info(f"Successful login for: {college_email}")
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

class CollegeProfileUpdate(BaseModel):
    principal_name: str
    point_of_contact_name: str
    poc_number: str
    poc_mail: str
    place: str
    profile_picture: Optional[str]=None
@college_router.get("/collegeprofile")
async def get_college_profile(current_college_: dict = Depends(get_current_college)):
    # Fetch and return college profile
    current_college_ = current_college_["college_email"]
    current_college = await get_college_by_email(current_college_) # You can query MongoDB by email
    if not current_college:
        raise HTTPException(status_code=404, detail="College not found")
    # image_key = current_college["College_profile"]
    
    # Fetch the image using static_image function
    # image_response = await static_image(image_key)
    
    college_response = College_Response(
        college_name=current_college["college_name"],
        college_id=current_college["college_id"],
        # College_profile=image_response, 
        college_type=current_college["college_type"],
        college_address=current_college["college_address"],
        college_link=current_college["college_link"],
        college_email=current_college["college_email"],
        college_contact=current_college["college_contact"],
        principal_name=current_college["principal_name"],
        point_of_contact_name=current_college["point_of_contact_name"],
        poc_number=current_college["poc_number"],
        poc_mail=current_college["poc_mail"],
        place=current_college["place"],
        profile_picture=generate_presigned_url(current_college.get("profile_picture")),
    )
    return college_response



# @college_router.put("/collegeprofile/update")
# async def update_college_profile(
#     update_data: CollegeProfileUpdate,
#     current_college_: dict = Depends(get_current_college)
# ):
#     """
#     Update the college profile details.
#     """
#     current_college_email = current_college_["college_email"]

#     # Find and update the college profile
#     updated_college = await CollegeData.find_one_and_update(
#         {"college_email": current_college_email},
#         {"$set": update_data.dict()},
#         return_document=True  # Return updated document
#     )

#     if not updated_college:
#         raise HTTPException(status_code=404, detail="College profile not found or update failed.")

#     # Convert ObjectId to string for JSON serialization
#     updated_college["_id"] = str(updated_college["_id"])

#     return {"message": "College profile updated successfully", "updated_data": updated_college}
@college_router.put("/collegeprofile/update")
async def update_college_profile(
    update_data: CollegeProfileUpdate,
    profile_picture: UploadFile = File(None),
    current_college_: dict = Depends(get_current_college)
):
    current_college_email = current_college_["college_email"]
    update_dict = update_data.dict()

    # Handle profile picture upload to S3
    if profile_picture:
        try:
            filename = f"{current_college_email}_profile_{profile_picture.filename}"
            s3.upload_fileobj(profile_picture.file, 'hackathonsite', filename)
            profile_picture_url = f'https://s3.amazonaws.com/hackathonsite/{filename}'
            update_dict["profile_picture"] = profile_picture_url
        except ClientError as e:
            raise HTTPException(status_code=500, detail="Error uploading profile picture: " + str(e))

    # Update the college profile in MongoDB
    updated_college = await CollegeData.find_one_and_update(
        {"college_email": current_college_email},
        {"$set": update_dict},
        return_document=True
    )

    if not updated_college:
        raise HTTPException(status_code=404, detail="College profile not found or update failed.")

    updated_college["_id"] = str(updated_college["_id"])

    return {
        "message": "College profile updated successfully",
        "updated_data": updated_college
    }



@college_router.post('/create_hackathon')
async def create_hackathon(
    title: str = Form(...),
    start_date: datetime = Form(...),
    end_date: datetime = Form(...),
    register_deadline: datetime = Form(...),
    team: Optional[str] = Form(None),
    no_of_people_in_team: Optional[int] = Form(None),
    hackathon_type: str = Form(...),
    hackathon_mode: str = Form(...),
    category: str = Form(...),  # New field
    registration_fee: Optional[int] = Form(0),
    location: Optional[str] = Form(None),
    max_participants: Optional[int] = Form(0),
    mentor_emails: List[str] = Form(...),
    description: Optional[str] = Form(None),
    hackathon_focus: Optional[str] = Form(None),
    prize_pool: Optional[str] = Form(None),
    poster: UploadFile = None,
    problem_statements_file: Optional[UploadFile] = None,  # For Multiple Problem Statements
    problem_statement_text: Optional[str] = Form(None),  # For Single Problem Statement
     # For Idea/Project Submission

    timetable: UploadFile = None,
    current_user: dict = Depends(get_current_college)):

    # Extract college email and ID from current_user
    college_email = current_user.get("college_email")
    college_id = current_user.get("college_id")
    college_name = current_user.get("college_name")
    college_location = current_user.get("college_address")

    # Perform validations
    if hackathon_mode == "offline" and not location:
        return {"error": "Location is required for offline hackathons."}

    if team == "team" and not no_of_people_in_team:
        return {"error": "Number of people in team is required when team mode is selected."}
    if team == "individual" and no_of_people_in_team:
        return {"error": "Number of people in team should not be provided for individual mode."}

    if hackathon_type == "paid" and registration_fee == 0:
        if registration_fee is None:
            return {"error": "Registration fee is required for paid hackathons."}
        

    if hackathon_mode == "offline" and not max_participants:
        return {"error": "Max participants is required for offline hackathons."}

    # Category-specific validations
    if category not in ["single_problem_statement", "multiple_problem_statements", "idea_project_submission"]:
        raise HTTPException(status_code=400, detail="Invalid hackathon category.")

    if category == "single_problem_statement":
        if not problem_statement_text:
            raise HTTPException(status_code=400, detail="Problem statement text is required for Single Problem Statement category.")
        if problem_statements_file:
            raise HTTPException(status_code=400, detail="Problem statements file should not be provided for Single Problem Statement category.")

    if category == "multiple_problem_statements":
        if not problem_statements_file:
            raise HTTPException(status_code=400, detail="Problem statements file is required for Multiple Problem Statements category.")
        if problem_statement_text:
            raise HTTPException(status_code=400, detail="Problem statement text should not be provided for Multiple Problem Statements category.")

    if category == "idea_project_submission":
        if not hackathon_focus:
            raise HTTPException(status_code=400, detail="Hackathon theme is required for Idea/Project Submission category.")
        if problem_statements_file or problem_statement_text:
            raise HTTPException(status_code=400, detail="Problem statement text or file should not be provided for Idea/Project Submission category.")

    # Files to upload
    files = {
        "poster": poster,
        "problem_statements_file": problem_statements_file,
        "timetable": timetable,
    }
    imgs = [poster, timetable, problem_statements_file]
    send_message_to_mentor_email(mentor_emails, imgs)

    # Dictionary to store uploaded file URLs
    uploaded_urls = {}
    for file_key, file in files.items():
        if file:  # If the file exists
            try:
                file.file.seek(0)  # Reset file pointer
                uploaded_urls[file_key] = upload_file_to_s3(file, "hackathonsite")
            except Exception as e:
                print(f"Failed to upload {file_key}: {e}")
                uploaded_urls[file_key] = None
        else:
            uploaded_urls[file_key] = None

    # Debug logs for uploaded URLs
    for key, url in uploaded_urls.items():
        print(f"{key.capitalize()} URL: {url}")

    # Prepare hackathon data
    hackathon_data = {
        "title": title,
        "start_date": start_date,
        "end_date": end_date,
        "register_deadline": register_deadline,
        "team": team,
        "no_of_people_in_team": no_of_people_in_team,
        "hackathon_type": hackathon_type,
        "hackathon_mode": hackathon_mode,
        "hackathon_category": category,
        "registration_fee": registration_fee,
        "location": location,
        "max_participants": max_participants,
        "mentor_emails": mentor_emails,
        "college_email": college_email,
        "college_id": college_id,
        "college_name": college_name,
        "college_address": college_location,
        "description": description,
        "hackathon_focus": hackathon_focus,
        "prize_pool": prize_pool,
        "problem_statement_text": problem_statement_text,
        "poster_url": uploaded_urls.get("poster"),
        "problem_statements_url": uploaded_urls.get("problem_statements_file"),
        "timetable_url": uploaded_urls.get("timetable"),
        
    }

    # Save to database
    response = await create_hackthon_data(hackathon_data)

    if response:
        return {"message": "Hackathon registered successfully."}

    raise HTTPException(status_code=400, detail="Something went wrong during registration.")



@college_router.post("/faculty", response_model=Facultysignup)
async def post_faculty(faculty: Facultysignup, current_college: dict = Depends(get_current_college)):
    try:
        print("Received Faculty Data:", faculty)
        college_email = current_college["college_email"]
        current_college_id = str(current_college["_id"])
        faculty.college_email = college_email
        faculty.college_id = str(current_college_id)
        # Debugging: Check if the faculty data is correct
        print("Faculty data after adding college_id:", faculty)
        
        if faculty.role == 'Faculty':
            response = await create_faculty(faculty.dict())
        else:
            try:
                response = await create_mentor(faculty.dict())
            except HTTPException as http_exc:
                if http_exc.status_code == 400:
                    print("Mentor creation failed due to duplicate email.")
                raise http_exc
        
        if response:
            return response
        else:
            raise HTTPException(status_code=400, detail="Error adding faculty.")
    
    except HTTPException as http_exc:
        print(f"HTTP Error: {http_exc.detail}")
        raise http_exc
    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error to the console
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")




@college_router.get("/college_faculty", response_model=List[Facultydata])
async def get_faculty(current_college: dict = Depends(get_current_college)):
    try:
        print(f"Fetching Faculty for college email: {current_college['college_email']}")
        # 
        mentor_faculty = await MentorData.find({"college_email": current_college["college_email"]}).to_list(length=None)
        regular_faculty = await FacultyData.find({"college_email": current_college["college_email"]}).to_list(length=None)

        all_faculty = mentor_faculty + regular_faculty

        if not all_faculty:
            print(f"No faculty or mentors found for college email: {current_college['college_email']}")
            return []

        # Format results into response model
        faculty_list = []
        for faculty in all_faculty:
            faculty_list.append(Facultysignup(
                name=faculty["name"],
                email=faculty["email"],
                role=faculty["role"],
                phone=faculty["phone"],
                department=faculty["department"]
            ))

        return faculty_list
    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error to the console
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


class MentorData1(BaseModel):
    name: str
    email: str
    role: str
    phone: str
    department: str
    college_email: str

@college_router.get("/college_mentors", response_model=List[MentorData1])
async def get_college_mentors(current_college: dict = Depends(get_current_college)):
    try:
        print(f"Fetching mentors for college email: {current_college['_id']}")

        # Query the MentorData collection using college_email
        college_mentors = await MentorData.find({"college_id": str(current_college["_id"])}).to_list(length=None)

        if not college_mentors:
            print(f"No mentors found for college email: {current_college['college_email']}")
            return []

        mentors_list = []
        for mentor in college_mentors:
            mentors_list.append(
                MentorData1(
                    name=mentor["name"],
                    email=mentor["email"],
                    role=mentor["role"],
                    phone=mentor["phone"],
                    department=mentor["department"],
                    college_email=mentor["college_email"]
                )
            )
        
        return mentors_list

    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error for debugging
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


class Hackathon_show1(BaseModel):
 
    title: str
    start_date: datetime
    end_date: datetime
    register_deadline: datetime
    team: Optional[str]
    no_of_people_in_team: Optional[int]
    hackathon_type: str
    hackathon_mode: str
    registration_fee: Optional[int]
    location: Optional[str]
    max_participants: Optional[int]
    mentor_emails: List[str]
    description: Optional[str]
    hackathon_focus:Optional[str]
    poster_url: Optional[str]
    problem_statements_url: Optional[str]
    timetable_url: Optional[str]



@college_router.get("/upcoming_hackathons", response_model=List[Hackathon_show1])
async def get_user_hackathons(
    current_college: dict = Depends(get_current_college)  # Get the current logged-in user
):
    """
    Fetches hackathon data for the currently logged-in user
    """
    try:
        # Fetch hackathons for the logged-in user's college with a start date from tomorrow onwards
        tomorrow = datetime.now() + timedelta(days=1)  # Calculate tomorrow's date
        print(f"Fetching hackathons for college email: {current_college['college_email']} starting from {tomorrow}")

        college_hackathons = await Hackathon_data.find(
            {
                "college_email": current_college["college_email"],
                "start_date": {"$gte": tomorrow}  # Filter for hackathons starting tomorrow or later
            }
        ).to_list(length=None)

        if not college_hackathons:
            print(f"No upcoming hackathons found for college email: {current_college['college_email']}")
            return []  # If no hackathons found, return an empty list

        # Process each hackathon to include generated URLs
        processed_hackathons = []
        for hackathon in college_hackathons:
            print(f"Processing hackathon: {hackathon['title']}")
            processed_hackathons.append({
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
                "description": hackathon.get("description"),
                "hackathon_focus":hackathon.get("hackathon_focus"),
                "poster_url": generate_presigned_url(hackathon.get("poster_url")),
                "problem_statements_url": generate_presigned_url(hackathon.get("problem_statements_url")),

                "timetable_url": generate_presigned_url(hackathon.get("timetable_url")),
            })

        return processed_hackathons

    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error to the console
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@college_router.get("/past_hackathons", response_model=List[Hackathon_show])
async def get_past_hackathons(
    current_college: dict = Depends(get_current_college)  # Get the current logged-in user's college
):
    """
    Fetches all past hackathon data for the currently logged-in user's college
    """
    try:
        # Fetch hackathons for the logged-in user's college with end_date < current date
        today = datetime.now()  # Current date and time
        print(f"Fetching past hackathons for college email: {current_college['college_email']} up to {today}")

        college_hackathons = await Hackathon_data.find(
            {
                "college_email": current_college["college_email"],
                "end_date": {"$lt": today}  # Filter for past hackathons where end_date is before today
            }
        ).to_list(length=None)
       
        if not college_hackathons:
            print(f"No past hackathons found for college email: {current_college['college_email']}")
            return []  # If no hackathons found, return an empty list

        # Process each hackathon to include generated URLs
        processed_hackathons = []
        for hackathon in college_hackathons:
            print(f"Processing past hackathon: {hackathon['title']}")
            processed_hackathons.append({
                "h_id": str(hackathon["_id"]),
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
                "description": hackathon.get("description"),
                "hackathon_focus": hackathon.get("hackathon_focus"),
                "poster_url": generate_presigned_url(hackathon.get("poster_url")),
                "problem_statements_url": generate_presigned_url(hackathon.get("problem_statements_url")),
                "timetable_url": generate_presigned_url(hackathon.get("timetable_url")),
            })


        return processed_hackathons

    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error to the console
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
# This route will be used to fetch hackathons by the current logged-in user



@college_router.get("/hackathons", response_model=List[HackathonResponse])
async def get_all_hackathons():
    hackathons_cursor = await Hackathon_data.find().to_list(length=None)  # Fetch all hackathons
    if not hackathons_cursor:
        raise HTTPException(status_code=404, detail="No hackathons found")

    # Convert the cursor into a list of dictionaries, transforming `_id` to `id` as a string
    hackathons = [
        {
            "id": str(hackathon["_id"]),
            "title": hackathon["title"],
            "start_date": hackathon["start_date"],
            "end_date": hackathon["end_date"],
            "register_deadline": hackathon["register_deadline"],
            "location": hackathon["location"],
            "description": hackathon["description"],

        }
        for hackathon in hackathons_cursor
    ]

    return hackathons

############################################################################################
