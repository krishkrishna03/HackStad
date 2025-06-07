from typing import Dict, List, Optional 
from fastapi import File, Form, UploadFile
from pydantic import BaseModel,EmailStr,HttpUrl, ValidationError
from bson import ObjectId
from pydantic_extra_types.phone_numbers import PhoneNumber
from pydantic.types import StringConstraints
from datetime import datetime



class Usersdata(BaseModel):
    full_name:str
    email: EmailStr
    phone:str 
    rollnum: str
    college:str
    branch:str
    year_of_study:str
    dob:str
    linkedin_url:str
    github_url:str
    class Config:
        from_attributes = True



class Useremail(BaseModel):
    email:str


class UserProfileResponse(BaseModel):
    full_name: str
    email: str
    phone: str
    rollnum: str
    college: str
    branch: str
    year_of_study: str
    dob: str
    linkedin_url: str
    github_url: str
    picture_url: Optional[str] = None


class UserResponse(BaseModel):
    full_name:str
    email: EmailStr
    phone:str
    rollnum: str
    college:str
    branch:str
    year_of_study:str


    class Config:
        json_encoders = {
            ObjectId: str
        }
        from_attributes = True
       




class Useredit(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None
    gender:Optional[str] = None
    rollnum: Optional[str] = None
    college: Optional[str] = None
    branch: Optional[str] = None
    year_of_study:Optional[str] = None
    place:Optional[str] = None
    githubid: Optional[str] = None
    linkedinid: Optional[str] = None
    #profile_picture: None




class HackathonHost(BaseModel):
    title: str
    start_date: datetime
    end_date: datetime
    register_deadline: datetime
    team: Optional[str] = None
    no_of_people_in_team: Optional[int] = None
    individual: Optional[str] = None
    hackathon_type: str
    hackathon_mode: str
    registration_fee: Optional[int] = 0
    location: Optional[str] = None
    max_participants: Optional[int] = 0
    mentor_emails: List[EmailStr]
    description: Optional[str] = None
    problem_statements: Optional[str] = None


class HackathonResponse(BaseModel):
    id:str
    title: str
    start_date: datetime
    end_date: datetime
    register_deadline: datetime # Adjust the type based on your date format
    location: str
    description: str
    poster: str
    class Config:
        json_encoders = {ObjectId: str}

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None

class CollegeRegistration(BaseModel):
    college_name: str
    college_id: str
    college_type: str
    college_address: str
    college_link: str
    college_email: EmailStr
    college_contact: str
    principal_name: str
    point_of_contact_name: str
    poc_number: str
    poc_mail: EmailStr
    place: str


 
    class Config:
        from_attributes = True

class OtpVerification(BaseModel):
    otp: int


class College_Response(BaseModel):
    college_name:str
    college_id:str
    college_type:str
    college_address:str 
    college_link:str
    college_email:EmailStr
    college_contact :int
    principal_name :str
    point_of_contact_name:str
    poc_number :int
    poc_mail:EmailStr
    place:str
    profile_picture:Optional[str] = None
    
    class Config:
        from_attributes = True


class CollegeloginResponse(BaseModel):
    message:str

class CollegeRegistrationResponse(BaseModel):
    message: str 

class Facultysignup(BaseModel):
    name:str
    email:str
    role:str
    phone:str
    department:str
    college_email:str=None
    college_id:str=None



class CollegeLoginRequest(BaseModel):
    email: EmailStr


class Userloginrequest(BaseModel):
    email:EmailStr

class UserLoginresponse(BaseModel):
    message:str

class Facultydata(BaseModel):
    email:str
    name:str
    role:str
    phone:str
    department:str
    #college_email:str


class TokenData1(BaseModel):
    facultyid: Optional[str] = None

class TokenData2(BaseModel):
    mentorid: Optional[str] = None


class Mentor(BaseModel):
    name:str
    email :str
    phone:int
    college_email:str
   

class Mentordata(BaseModel):
    name:str
    email:str
    phone:str
    college_email:str

class MentorLogin(BaseModel):
    email: str





#########################################################################################
class HackathonDetails(BaseModel):
    name: str
    college: str
    place: Optional[str] = None
    start_date: datetime
    end_date: datetime
    registration_deadline: datetime
    max_participants_for_team: Optional[int] = None
    hackathon_mode: str  # "individual" or "team"
    registration_fees: Optional[float] = None
   

class Userhackthonregistration(BaseModel):
    name: str
    email: str
    phone: str

class HackathonRegistrationRequest(BaseModel):
    user_profile: Userhackthonregistration
    hackathon_id: str
    transaction_id: Optional[str] = None





class RegistrationModel(BaseModel):
    user_profile: dict
    hackathon_id: str
    status: str
    registration_time: datetime
    transaction_id: Optional[str] = None


class Team(BaseModel):
    hackathon_id: str
    team_code: str
    leader_id: str
    leader_name: str
    leader_email: str
    members: list
    created_at: datetime
    max_members: int








class Hackathon_show(BaseModel):
    h_id: str
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
    poster_url: Optional[str]
    problem_statements_url: Optional[str]

    timetable_url: Optional[str]
    # class Config:
    #     # Ensure _id is handled correctly (e.g., as a string for MongoDB)
    #     orm_mode = True
    


class RegisterForm(BaseModel):
    transaction_id: str = None # This will be optional for individual hackathons


class TeamForm(BaseModel):
    hackathon_id: str  # The ID of the hackathon for which the team is being created
    team_name: str  # The name of the team

    class Config:
        # This will ensure that the data is treated as a dictionary when passed to MongoDB
        json_encoders = {
            str: lambda v: str(v),  # Convert ObjectId to string
        }

class JoinTeamForm(BaseModel):
    hackathon_id: str  # ID of the hackathon the team belongs to
    team_id: str       # ID of the team to join

    class Config:
        # Pydantic allows parsing from MongoDB ObjectId
        arbitrary_types_allowed = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Convert hackathon_id and team_id to ObjectId if they're not already
        if isinstance(self.hackathon_id, str):
            self.hackathon_id = ObjectId(self.hackathon_id)
        if isinstance(self.team_id, str):
            self.team_id = ObjectId(self.team_id)


class TeamMember(BaseModel):
    name: str
    email: str
    phone: str

class TeamForm(BaseModel):
    hackathon_id: str
    team_name: str
    team_description: str = None
    team_members: list[TeamMember]

class JoinTeamRequest(BaseModel):
    teamId: str

class UserModel1(BaseModel):
    user_id: str
    name: str
    email: str
    phone: str

class TeamDataModel(BaseModel):
    _id: str
    team_name: str
    team_description: Optional[str] = ""
    team_lead: UserModel1
    hackathon_id: str
    team_members: List[UserModel1]
    max_team_size: int
    team_code: str
    pending_invites: Optional[List[str]] = []

    class Config:
        orm_mode = True


class UserRegistrationResponse(BaseModel):
    message: str 


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str


class SubmissionForm(BaseModel):
    hackathon_id:str
    team_id:str
    project_title:str
    problem_statement:str
    project_description:str
    linkedin_url:Optional[str]
    github_url:Optional[str]
    other_url:Optional[str]
    team_lead:str
    mentor_ids:Optional[List[str]]
    submitted_at:Optional[datetime]
    hackathon_end_time:Optional[datetime]


class Participants(BaseModel):
    _id: Optional[str]
    user_id: Optional[str]
    hackathon_id: Optional[str]
    user_email: Optional[str]
    hackathon_title: Optional[str]  # Removed duplicate
    order_id: Optional[str]  # Fixed typo from 'oder_id'
    payment_id: Optional[str]
    status: Optional[str]
    user_name: Optional[str]
    user_college: Optional[str]
    hosted_by: Optional[str]


class EvaluationForm(BaseModel):
    team_id: Optional[str] = None
    user_id: Optional[str] =None
    submission_id : Optional[str] = None
    hackathon_id: Optional[str]
    scores: Dict[str, int]
    feedback: str
    evaluated_at: datetime = datetime.utcnow()


class SubmissionSchema(BaseModel):
    id: str
    hackathon_id: str
    team_id: str
    project_title: str
    problem_statement: Optional[str] = None
    project_description: Optional[str] = None
    linkedin_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None
    other_url: Optional[HttpUrl] = None
    mentor_ids: List[str]
    team_lead: str
    submitted_at: datetime
    hackathon_end_time: Optional[datetime] = None


class MentorUpdate(BaseModel):
    name: str
    phone: str
    department: str

class UserProfileUpdate(BaseModel):
    full_name: str
    phone: str
    college: str
    branch: str
    year_of_study: int
    dob: str
    linkedin_url: str
    github_url: str
    profile_picture: Optional[str] = None