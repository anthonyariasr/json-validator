from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# CORS configuration
DEVELOPMENT_ORIGINS = [
    "http://127.0.0.1:5500",  # Allow requests from this origin
    "http://localhost:5500",  # Add the origin from which you are making the request
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=DEVELOPMENT_ORIGINS,  # Allow specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

UPLOAD_DIRECTORY = "./uploads" 


def save_file(file: UploadFile, directory: str) -> str:
    """Save the uploaded file to the specified directory."""
    file_location = os.path.join(directory, file.filename)

    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())

    return file_location


def list_files(directory: str) -> list:
    """List all JSON files in the specified directory with their details."""
    files = os.listdir(directory)
    results = []

    for filename in files:
        if filename.endswith(".json"):
            file_path = os.path.join(directory, filename)
            size = os.path.getsize(file_path)
            status = "Valid"  # Implement logic to verify JSON validity if needed
            results.append({"filename": filename, "size": size, "status": status})

    return results


# Endpoints
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="The file is not a JSON file.")

    save_file(file, UPLOAD_DIRECTORY)
    return {"message": "File uploaded successfully"}


@app.get("/validate/")
async def validate_files():
    results = list_files(UPLOAD_DIRECTORY)
    return {"results": results}
