from sqlmodel import create_engine, Session, SQLModel
from app.setting import get_setting

setting = get_setting()

engine = create_engine(
    setting.base_url,
    connect_args={"check_same_thread" : False}
)

def create_table():

    SQLModel.metadata.create_all(engine)

def get_session():

    with Session(engine) as session:

        yield session