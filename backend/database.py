import os
from sqlmodel import SQLModel, create_engine, Session

DB_FILE = "skillforge.db"
DB_PATH = os.path.join(os.path.dirname(__file__), DB_FILE)
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False
)

def init_db():
    """Initializes SQLite database and creates all tables defined in models.py."""
    import backend.models  # noqa: F401
    SQLModel.metadata.create_all(engine)

def get_db():
    """FastAPI dependency for obtaining a database session per request."""
    with Session(engine) as session:
        yield session
