from sqlmodel import SQLModel, create_engine, Session
from app.setting import get_setting

setting  = get_setting()


engine  = create_engine(
    setting.base_url,
)

def create_table():

    SQLModel.metadata.create_all(engine)

def get_session():

    with Session(engine) as session:

        yield session
    