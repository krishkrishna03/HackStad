
from datetime import timezone
import random
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from database import *
from model import *

mentor_routes = APIRouter()
temporary_mentor_data={}
class MentorLoginRequest(BaseModel):
    email: EmailStr
@mentor_routes.post("/mentorlogin", response_model=CollegeloginResponse)
async def login_mentor1(email1:MentorLoginRequest):
    email = email1.email
    mentor = await get_mentor_by_email(email)  # Use the email to query the database

    if not mentor:
        raise HTTPException(status_code=400, detail="Mentor email not found")
    
    # Generate and send OTP
    otp = random.randint(100000, 999999)
    send_otp_email(email, otp)
    print(f"mentor otp {otp}")
    # Store OTP and mentor email temporarily
    temporary_mentor_data[otp] = {
        'mentor_email': email
    }
    
    # Return response 
    return CollegeloginResponse(
        message="OTP sent to your email."
    )

@mentor_routes.post("/verify-loginmentor")
async def login_mentor2(otp_verification: OtpVerification):
    otp = otp_verification.otp
    # Check if OTP exists in temporary storage
    if otp not in temporary_mentor_data:
        raise HTTPException(status_code=404, detail="OTP expired or invalid")
    # Generate token after successful OTP verification
    mentor_email = temporary_mentor_data.pop(otp)['mentor_email']
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": mentor_email}, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}

@mentor_routes.get("/mentor/hackathons-o")
async def get_mentor_hackathons(current_user: dict = Depends(get_current_user)):
    mentor_email = current_user["email"]  # Assuming the mentor's email is in the JWT payload

    # Find hackathons where the logged-in mentor's email is in the mentor_emails list
    hackathons = await Hackathon_data.find({"mentor_emails": mentor_email}).to_list(length=None)

    if not hackathons:
        raise HTTPException(status_code=404, detail="No hackathons assigned to this mentor.")
    
    # Convert ObjectId to string for each hackathon
    for hackathon in hackathons:
        hackathon["_id"] = str(hackathon["_id"])

    return hackathons


@mentor_routes.get("/mentor/profile",response_model=Facultydata)
async def get_faculty_profile(current_user: dict=Depends(get_current_mentor)):
    if asyncio.isfuture(current_user):
        current_user = await current_user
    
    mentor_profile = {
        "email":current_user.get("email"),
        "name":current_user.get("name"),
        "role": current_user.get("role"),
        "phone": current_user.get("phone"),
        "department": current_user.get("department"),

    }
    return mentor_profile


@mentor_routes.put("/mentor/profile/update")
async def update_mentor_profile(
    update_data: MentorUpdate, 
    current_user: dict = Depends(get_current_mentor)
):
    
    # current_user = await current_user

    mentor_email = current_user.get("email")

    # Update mentor details in the database
    updated_mentor = await MentorData.find_one_and_update(
        {"email": mentor_email},  # Find by email
        {"$set": update_data.dict()},  # Update fields
        return_document=True  # Return updated document
    )
    updated_mentor["_id"] = str(updated_mentor["_id"])
    if not updated_mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found or update failed.")

    return {"message": "Profile updated successfully", "updated_data": updated_mentor}



@mentor_routes.get("/mentor/live_hackathons", response_model=List[dict])
async def get_mentor_live_hackathons(current_user: dict = Depends(get_current_mentor)):
    """
    Fetch live hackathons assigned to the logged-in mentor and their registration counts.
    """
    # Get the logged-in mentor's email
    user = await current_user
    mentor_email = user["email"]

    # Current timestamp
    current_time = datetime.now()

    # Query hackathons assigned to the mentor and are currently live
    hackathons = await Hackathon_data.find(
        {
            "mentor_emails": mentor_email,
            "start_date": {"$lte": current_time},  # Started
            "end_date": {"$gte": current_time},    # Not yet ended
        },
        {
            "_id": 1,  # Include `_id` for counting registrations
            "title": 1,
            "start_date": 1,
            "end_date": 1,
            "register_deadline": 1,
            "hackathon_mode": 1,
            "hackathon_category": 1,
            "description": 1,
            "poster_url": 1,
        }
    ).to_list(length=None)

    if not hackathons:
        raise HTTPException(status_code=404, detail="No live hackathons found for this mentor.")

    # Count registrations for each live hackathon
    for hackathon in hackathons:
        hackathon_id = hackathon["_id"]
        registration_count = await registrations.count_documents({"hackathon_id": hackathon_id})
        hackathon["registration_count"] = registration_count

    return hackathons

async def get_mentor_hackathons(mentor_id: str):
    """Fetch all hackathons for a given mentor"""
    mentor = await MentorData.find_one({"_id": ObjectId(mentor_id)})
    
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found.")

    mentor_email = mentor["email"]

    # Fetch hackathons where mentor's email exists in the mentor_emails array
    hackathons_cursor = Hackathon_data.find({"mentor_emails": {"$in": [mentor_email]}})
    hackathons = await hackathons_cursor.to_list(length=None)

    if not hackathons:
        raise HTTPException(status_code=404, detail="No hackathons found for this mentor.")

    return hackathons



@mentor_routes.get("/mentor/hackathons-live")
async def get_hackathons_for_faculty(current_user: dict = Depends(get_current_mentor)):
    # Fetch mentor data using mentor_id
    mentor1 =  current_user
    print(f'this is the mentor {mentor1}')
    mentor =  await MentorData.find_one({"_id": mentor1["_id"]})

    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found.")
    today = datetime.today()
    mentor_email = mentor["email"]

    # Fetch hackathons where mentor's email exists in the mentor_emails array
    hackathons_cursor = Hackathon_data.find({"mentor_emails": {"$in": [mentor_email]},"start_date": {"$lte": today},
        "end_date": {"$gte": today}})
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


@mentor_routes.get("/mentor/hackathons-upcoming")
async def get_upcoming_hackathons_for_faculty(current_user: dict = Depends(get_current_mentor)):
    # Fetch mentor data using mentor_id
    mentor1 = current_user
    mentor = await MentorData.find_one({"_id": mentor1["_id"]})

    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found.")

    today = datetime.today()
    mentor_email = mentor["email"]

    # Fetch hackathons where mentor's email exists in the mentor_emails array and the start date is in the future
    hackathons_cursor = Hackathon_data.find({
        "mentor_emails": {"$in": [mentor_email]},
        "start_date": {"$gt": today}  # Upcoming hackathons (future start date)
    })

    hackathons = await hackathons_cursor.to_list(length=None)

    if not hackathons:
        raise HTTPException(status_code=404, detail="No upcoming hackathons found for this mentor.")

    return [
        {
            "id": str(hackathon["_id"]),
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

@mentor_routes.get("/mentor/hackathons-past")
async def get_past_hackathons_for_faculty(current_user: dict = Depends(get_current_mentor)):
    # Fetch mentor data using mentor_id
    mentor1 = current_user
    mentor = await MentorData.find_one({"_id": mentor1["_id"]})

    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found.")

    today = datetime.today()
    mentor_email = mentor["email"]

    # Fetch hackathons where mentor's email exists in the mentor_emails array and the end date is in the past
    hackathons_cursor = Hackathon_data.find({
        "mentor_emails": {"$in": [mentor_email]},
        "end_date": {"$lt": today}  # Past hackathons (already ended)
    })

    hackathons = await hackathons_cursor.to_list(length=None)

    if not hackathons:
        raise HTTPException(status_code=404, detail="No past hackathons found for this mentor.")

    return [
        {
            "id": str(hackathon["_id"]),
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


@mentor_routes.get("/hackathon/submissions/{hackathon_id}", response_model=List[SubmissionSchema])
async def get_hackathon_submissions(
    hackathon_id: str,
    current_user: dict = Depends(get_current_mentor)  # Ensure this function is awaited
):
    current_user =  current_user  # Await the future object

    print(f'this is the mentor {current_user}')  # Debugging

    mentor_id = str(current_user["_id"])  # Convert ObjectId to string if needed

    # Query submissions where the mentor's ID exists in the mentor_ids array
    submissions_cursor = HackathonSubmissions.find({
        "hackathon_id": hackathon_id,
        "mentor_ids": {"$in": [mentor_id]}
    })
    
    submissions = await submissions_cursor.to_list(length=None)

    if not submissions:
        raise HTTPException(status_code=404, detail="No submissions found for this hackathon")

    # Convert MongoDB ObjectId and return structured data
    return [SubmissionSchema(
        id=str(sub["_id"]),
        hackathon_id=sub["hackathon_id"],
        team_id=sub["team_id"],
        project_title=sub["project_title"],
        problem_statement=sub.get("problem_statement"),
        project_description=sub.get("project_description"),
        linkedin_url=sub.get("linkedin_url"),
        github_url=sub.get("github_url"),
        other_url=sub.get("other_url"),
        mentor_ids=[str(mid) for mid in sub["mentor_ids"]],
        team_lead=sub["team_lead"],
        submitted_at=sub["submitted_at"],
        hackathon_end_time=sub.get("hackathon_end_time")
    ) for sub in submissions]



@mentor_routes.post("/hackathon/evaluate-submission", response_model=EvaluationForm)
async def evaluate_submission(evaluation: EvaluationForm, current_user: dict = Depends(get_current_mentor)):
    mentor_id = current_user.get("_id")
    if not mentor_id:
        raise HTTPException(status_code=400, detail="Mentor ID not found")

    # Fetch mentor details
    mentor = await MentorData.find_one({"_id": ObjectId(mentor_id)})
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")

    # Fetch hackathon details
    hackathon = await Hackathon_data.find_one({"_id": ObjectId(evaluation.hackathon_id)})
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    # Fetch submission details
    submission = await HackathonSubmissions.find_one({"team_id": evaluation.team_id})
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Check if mentor is assigned to this submission.
    mentor_ids = submission.get("mentor_ids", [])
    mentor_ids_str = [str(mid) for mid in mentor_ids]
    if str(mentor_id) not in mentor_ids_str:
        raise HTTPException(status_code=403, detail="Only an assigned mentor can evaluate this submission")

    # Determine whether to store team_id or user_id and check for duplicate evaluation
    if hackathon.get("team") == "team":
        evaluation_entry = {
            "team_id": evaluation.team_id,
            "user_id": None,  # Not needed for team-based hackathons
        }
        duplicate_query = {
            "hackathon_id": evaluation.hackathon_id,
            "team_id": evaluation.team_id
        }
    elif hackathon.get("team") == "individual":
        evaluation_entry = {
            "team_id": None,  # Not needed for individual-based hackathons
            "user_id": evaluation.user_id,
        }
        duplicate_query = {
            "hackathon_id": evaluation.hackathon_id,
            "user_id": evaluation.user_id
        }
    else:
        raise HTTPException(status_code=400, detail="Invalid hackathon type")

    # Check for duplicate evaluation
    existing_eval = await EvaluationData.find_one(duplicate_query)
    if existing_eval:
        raise HTTPException(status_code=400, detail="Evaluation already submitted for this entry.")

    # Prepare evaluation data, adding the submission_id for linking
    evaluation_data = {
        **evaluation_entry,
        "hackathon_id": evaluation.hackathon_id,
        "mentor_id": mentor_id,
        "scores": evaluation.scores,
        "feedback": evaluation.feedback,
        "evaluated_at": datetime.utcnow(),
        "submission_id": str(submission["_id"])  # Store reference to the submission
    }

    # Insert into database
    insert = await EvaluationData.insert_one(evaluation_data)
    inserted_data = await EvaluationData.find_one({"_id": insert.inserted_id})

    if not inserted_data:
        raise HTTPException(status_code=500, detail="Failed to save evaluation")

    inserted_data["id"] = str(inserted_data["_id"])
    inserted_data.pop("_id", None)

    return inserted_data



@mentor_routes.get("/hackathon/participants/{hackathon_id}", response_model=List[Participants])
async def get_hackathon_participants(hackathon_id: str):
    try:
        # Convert to ObjectId if necessary
        if ObjectId.is_valid(hackathon_id):
            hackathon_id = ObjectId(hackathon_id)

        participants_list = []
        cursor = registrations.find({"hackathon_id": hackathon_id})

        async for participant in cursor:
            participants_list.append(Participants(
                _id=str(participant["_id"]),
                user_id=str(participant.get("user_id", "")),
                hackathon_id=str(participant.get("hackathon_id", "")),
                user_email=participant.get("user_email", ""),
                hackathon_title=participant.get("hackathon_title", ""),
                order_id=participant.get("order_id", ""),
                payment_id=participant.get("payment_id", ""),
                status=participant.get("status", ""),
                user_name=participant.get("user_name", ""),
                user_college=participant.get("user_college", ""),
                hosted_by=participant.get("hosted_by", "")
            ))

        if not participants_list:
            raise HTTPException(status_code=404, detail="No participants found for this hackathon")

        return participants_list
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=[str(e),"No participants found for this hackathon"])

@mentor_routes.get("/hackathon/summary/{hackathon_id}")
async def get_hackathon_summary(hackathon_id: str):
    try:
        if not ObjectId.is_valid(hackathon_id):
            raise HTTPException(status_code=400, detail="Invalid hackathon ID format")

        hackathon_obj_id = ObjectId(hackathon_id)

        # Step 1: Fetch hackathon info
        hackathon = await Hackathon_data.find_one({"_id": hackathon_obj_id})
        if not hackathon:
            raise HTTPException(status_code=404, detail="Hackathon not found")

        hackathon_type = hackathon.get("hackathon_type", "free").lower()
        registration_fee = hackathon.get("registration_fee", 0)

        # Step 2: Count registrations
        registration_count = await registrations.count_documents({"hackathon_id": hackathon_obj_id})

        if hackathon_type == "free" or registration_fee == 0:
            return {
                "hackathon_type": "free",
                "registration_fee": 0,
                "total_registrations": registration_count,
                "total_collected_amount": 0,
                "message": "This is a free hackathon."
            }

        # Step 3: Calculate total fee
        total_amount = registration_fee * registration_count

        return {
            "hackathon_type": hackathon_type,
            "registration_fee": registration_fee,
            "total_registrations": registration_count,
            "total_collected_amount": total_amount,
            "message": "This is a paid hackathon."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@mentor_routes.get("/dashboard/stats")
async def get_dashboard_stats():
    try:
        hackathon_count = await Hackathon_data.count_documents({})
        participant_count = await registrations.count_documents({})
        team_count = await TeamData.count_documents({})
        user_count = await userdata.count_documents({})
        college_count = await CollegeData.count_documents({})

        return {
            "total_hackathons": hackathon_count,
            "total_participants": participant_count,
            "total_teams": team_count,
            "total_users_registered": user_count,
            "total_colleges_registered": college_count,
            "message": "Dashboard statistics fetched successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@mentor_routes.get("/hackathon/teams-list/{hackathon_id}")
async def hackathon_teams_list(hackathon_id: str):
    teams = await TeamData.find({"hackathon_id": str(hackathon_id)}).to_list()
    def convert_user(user_obj):
        return {
            "user_id": str(user_obj.get("user_id")),  # Convert the user_id ObjectId to string
            "name": user_obj.get("name"),
            "email": user_obj.get("email"),
            "phone": user_obj.get("phone")
        }
    return [
        {
            "team_id": str(team["_id"]),
            "team_name": team["team_name"],
            "team_description": team["team_description"],
            "max_team_size":team["max_team_size"],
            "teams_code":team["team_code"],
            "team_lead": convert_user(team["team_lead"]),
            "team_members": [convert_user(members) for members in team["team_members"]],
        }
        for team in teams
    ]







@mentor_routes.get("/leaderboard/top/{hackathon_id}")
async def get_top_three_leaders(hackathon_id: str):
    # Fetch hackathon details
    hackathon = await Hackathon_data.find_one({"_id": ObjectId(hackathon_id)})
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")
    
    # Fetch all submissions for the hackathon
    submissions_cursor = HackathonSubmissions.find({"hackathon_id": hackathon_id})
    submissions = await submissions_cursor.to_list(length=None)
    
    if not submissions:
        raise HTTPException(status_code=404, detail="No submissions found for this hackathon")
    
    leaderboard = await build_leaderboard(hackathon, submissions)
    
    # Select top 3 entries (or fewer if there are less than 3 submissions)
    top_three = leaderboard[:3]
    
    return {"message": "Top 3 winners", "leaderboard": top_three}


@mentor_routes.get("/leaderboard/all/{hackathon_id}")
async def get_full_leaderboard(hackathon_id: str):
    # Fetch hackathon details
    hackathon = await Hackathon_data.find_one({"_id": ObjectId(hackathon_id)})
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")
    
    # Fetch all submissions for the hackathon
    submissions_cursor = HackathonSubmissions.find({"hackathon_id": hackathon_id})
    submissions = await submissions_cursor.to_list(length=None)
    
    if not submissions:
        raise HTTPException(status_code=404, detail="No submissions found for this hackathon")
    
    leaderboard = await build_leaderboard(hackathon, submissions)
    
    return {"message": "Leaderboard fetched successfully.", "leaderboard": leaderboard}


# async def build_leaderboard(hackathon: dict, submissions: List[dict]) -> List[dict]:
#     leaderboard = []
#     for submission in submissions:
#         # Fetch evaluation for the submission (using submission_id)
#         evaluation = await EvaluationData.find_one({"submission_id": str(submission["_id"])})
        
#         # Calculate final score using the scores object from evaluation
#         final_score = 0
#         if evaluation and evaluation.get("scores"):
#             scores_obj = evaluation["scores"]
#             overall = scores_obj.get("overall", 0)
#             creativity = scores_obj.get("creativity", 0)
#             technical = scores_obj.get("technical_complexity", 0)
#             presentation = scores_obj.get("presentation", 0)
#             # Weighted calculation (adjust weights as necessary)
#             final_score = (0.5 * overall) + (0.2 * creativity) + (0.2 * technical) + (0.1 * presentation)
        
#         # Determine the display name based on hackathon type
#         if hackathon.get("team") == "individual":
#             # For individual hackathons, fetch user details from the userdata collection using team_lead field.
#             user = await userdata.find_one({"_id": ObjectId(submission["team_lead"])})
#             name = user.get("name") if user else "Unknown"
#             leaderboard.mentor_routesend({
#                 "name": name,
#                 "score": final_score,
#                 "submitted_at": submission.get("submitted_at")
#             })
#         elif hackathon.get("team") == "team":
#             # For team hackathons, fetch the team details using team_id.
#             team = await TeamData.find_one({"_id": ObjectId(submission["team_id"])})
#             team_name = team.get("team_name") if team else "Unknown"
#             leaderboard.mentor_routesend({
#                 "team_name": team_name,
#                 "score": final_score,
#                 "submitted_at": submission.get("submitted_at")
#             })
#         else:
#             # If hackathon type is unknown, skip this submission.
#             continue

#     # Sort leaderboard: first by final score (descending), then by submission time (ascending as a tiebreaker)
#     leaderboard.sort(key=lambda entry: (-entry.get("score", 0), entry.get("submitted_at")))
    
#     return leaderboard



async def build_leaderboard(hackathon: dict, submissions: List[dict]) -> List[dict]:
    leaderboard = []
    for submission in submissions:
        # Fetch evaluation for the submission (using submission_id)
        evaluation = await EvaluationData.find_one({"submission_id": str(submission["_id"])})
        
        # Calculate final score using the scores object from evaluation
        final_score = 0
        if evaluation and evaluation.get("scores"):
            scores_obj = evaluation["scores"]
            overall = scores_obj.get("overall", 0)
            creativity = scores_obj.get("creativity", 0)
            technical = scores_obj.get("technical_complexity", 0)
            presentation = scores_obj.get("presentation", 0)
            # Weighted calculation (adjust weights as necessary)
            final_score = (0.5 * overall) + (0.2 * creativity) + (0.2 * technical) + (0.1 * presentation)
        
        # Determine the display name based on hackathon type
        if hackathon.get("team") == "individual":
            # For individual hackathons, fetch user details from the userdata collection using team_lead field.
            user = await userdata.find_one({"_id": ObjectId(submission["team_lead"])})
            name = user.get("name") if user else "Unknown"
            leaderboard.append({
                "name": name,
                "score": final_score,
                "submitted_at": submission.get("submitted_at")
            })
        elif hackathon.get("team") == "team":
            # For team hackathons, fetch the team details using team_id.
            team = await TeamData.find_one({"_id": ObjectId(submission["team_id"])})
            team_name = team.get("team_name") if team else "Unknown"
            leaderboard.append({
                "team_name": team_name,
                "score": final_score,
                "submitted_at": submission.get("submitted_at")
            })
        else:
            # If hackathon type is unknown, skip this submission.
            continue

    # Sort leaderboard: first by final score (descending), then by submission time (ascending as a tiebreaker)
    leaderboard.sort(key=lambda entry: (-entry.get("score", 0), entry.get("submitted_at")))
    end_date = hackathon.get("end_date")
    # Make sure it's a datetime object
    if isinstance(end_date, str):
        # Convert string to datetime (just in case it's a string)
        end_date = datetime.fromisoformat(end_date.replace("Z", "+00:00")).astimezone(timezone.utc)
    elif isinstance(end_date, datetime):
        end_date = end_date.astimezone(timezone.utc)
    else:
        end_date = None

    # Check if current time is past end_date
    now = datetime.now(timezone.utc)
    if end_date and now > end_date:
        # Assign winners
        for i, entry in enumerate(leaderboard):
            if i == 0:
                entry["winner"] = "1st"
            elif i == 1:
                entry["winner"] = "2nd"
            elif i == 2:
                entry["winner"] = "3rd"
            else:
                break
    
    return leaderboard





