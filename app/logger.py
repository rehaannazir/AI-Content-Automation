import logging
from logging.handlers import RotatingFileHandler

logger = logging.getLogger("ai_content_automation")
logger.setLevel(logging.INFO)

handler = RotatingFileHandler(
    "content.log",
    maxBytes= 5 * 1024 * 1024, # 5MB per file
    backupCount= 5 # keep 5 old files
)

formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(name)s - %(message)s")
handler.setFormatter(formatter)

# Also log to console

console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)

logger.addHandler(handler)
logger.addHandler(console_handler)

