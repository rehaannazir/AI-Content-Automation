from functools import lru_cache
from pydantic_settings import SettingsConfigDict, BaseSettings


class Setting(BaseSettings):

    app_name : str
    app_version : str
    base_url : str
    secret_key : str

    model_config = SettingsConfigDict(env_file=".env")

@lru_cache
def get_setting():

    return Setting()