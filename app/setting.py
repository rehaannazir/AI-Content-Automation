from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Setting(BaseSettings):

    base_url : str
    secret_key : str

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache # Its caches the function's return and prevents repetitive function calls
def get_setting():

    return Setting()