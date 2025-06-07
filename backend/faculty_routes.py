import random
from fastapi import APIRouter, Path, Request, WebSocket, WebSocketDisconnect
from model import *
from database import *


faculty_router = APIRouter()

temporary_faculty_data={}
@faculty_router.get("/faculty/{email}",response_model=Facultydata)
async def get_faculty_by_route(email: str = Path(..., description="Faculty Email")):
    faculty = await get_Faculty_by_email(email=email)
    return faculty

temporary_faculty_email={}
class FacultyLoginRequest(BaseModel):
    email: EmailStr

@faculty_router.post("/facultylogin", response_model=CollegeloginResponse)
async def login_faculty1(request: FacultyLoginRequest):
    email = request.email

    faculty = await get_Faculty_by_email(email)
    
    if not faculty:
        raise HTTPException(status_code=400, detail="College email not found")
    
    otp = random.randint(100000, 999999)
    send_otp_email(email, otp)
    temporary_faculty_email[otp] = {'Faculty_email': email}
    
    return CollegeloginResponse(message="OTP sent to your email.")

@faculty_router.post("/verify-loginfaculty")
async def login_faculty2(otp_verification: OtpVerification):
    otp = otp_verification.otp
    if otp not in temporary_faculty_email:
        raise HTTPException(status_code=404, detail="OTP expired or invalid")
    
    faculty_email = temporary_faculty_email.pop(otp)['Faculty_email']
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": faculty_email}, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}

@faculty_router.get("/faculty/profile",response_model=Facultydata)
async def get_faculty_profile(current_user: dict=Depends(get_current_faculty)):
    if asyncio.isfuture(current_user):
        current_user = await current_user
    
    faculty_profile = {
        "email":current_user.get("email"),
        "name":current_user.get("name"),
        "role": current_user.get("role"),
        "phone": current_user.get("phone"),
        "department": current_user.get("department"),

    }
    return faculty_profile

