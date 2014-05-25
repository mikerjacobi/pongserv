from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
import datetime
import json
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    username = Column(String, primary_key=True)

    def __init__(self, username, **kwargs):
        self.username = username
        self.date_added = str(datetime.datetime.now().isoformat())[:19]

    def __repr__(self):
        data = dict(
            username = self.username,
            date_added = self.date_added
        )
        return json.dumps(data)


