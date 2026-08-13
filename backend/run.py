import sys
import os

# Add backend root so both p2 and p3 packages are importable
sys.path.insert(0, os.path.dirname(__file__))
# Also add p2 so internal p2 imports (e.g. 'from database import ...') still resolve
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "p2"))

from p2.main import app
