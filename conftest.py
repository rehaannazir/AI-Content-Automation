import os
import sys

# Add project root to path so all packages are importable.
sys.path.insert(0, os.path.dirname(__file__))

# Use SQLite in-memory for tests so they are self-contained and never touch
# the real PostgreSQL database. Other .env values (SECRET_KEY, XAI_API_KEY,
# GROK_MODEL) are still loaded from the .env file.
os.environ["BASE_URL"] = "sqlite://"
