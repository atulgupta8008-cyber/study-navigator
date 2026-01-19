from dotenv import load_dotenv
load_dotenv()


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🔽 ADD THESE IMPORTS
from app.db import Base, engine
from app.models import student, explanation

from app.routes import explain

from app.routes import advisor



# 🔽 CREATE TABLES HERE (THIS IS THE LINE YOU ASKED ABOUT)
Base.metadata.create_all(bind=engine)

# 🔽 IMPORT ROUTES AFTER DB INIT
from app.routes import survey, timetable, roadmap

app = FastAPI(title="Study Navigator API")

# 🔽 CORS (already added earlier)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 🔽 REGISTER ROUTES
app.include_router(survey.router)
app.include_router(timetable.router)
app.include_router(roadmap.router)
app.include_router(explain.router)
app.include_router(advisor.router)


@app.get("/")
def root():
    return {"status": "Study Navigator backend running"}
