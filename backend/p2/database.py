import os
from sqlmodel import SQLModel, create_engine, Session

DB_FILE = "skillforge.db"
DB_PATH = os.path.join(os.path.dirname(__file__), DB_FILE)

# Read DATABASE_URL from environment (e.g. Supabase Postgres) or fallback to local SQLite
raw_db_url = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

# SQLAlchemy expects 'postgresql://' instead of 'postgres://'
if raw_db_url.startswith("postgres://"):
    DATABASE_URL = raw_db_url.replace("postgres://", "postgresql://", 1)
else:
    DATABASE_URL = raw_db_url

# Configure database engine based on dialect
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)
else:
    # PostgreSQL / Supabase engine with connection health check
    engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

def init_db():
    """Initializes SQLite/PostgreSQL database and creates all tables defined in models.py."""
    import p2.models  # noqa: F401
    SQLModel.metadata.create_all(engine)

def get_db():
    """FastAPI dependency for obtaining a database session per request."""
    with Session(engine) as session:
        yield session
