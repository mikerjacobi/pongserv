from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
import datetime
import json
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    username = Column(String, primary_key=True)
    password = Column(String)
    playlists_owned = Column(String)
    playlists_followed = Column(String)
    score = Column(Integer)
    date_added = Column(String)

    def __init__(self, username, **kwargs):
        self.username = username
        self.password = kwargs['password']
        self.playlists_owned = ""
        self.playlists_followed = ""
        self.score = 0
        self.date_added = str(datetime.datetime.now().isoformat())[:19]

    def __repr__(self):
        data = dict(
            username = self.username,
            password = self.password,
            playlists_owned = self.playlists_owned,
            playlists_followed = self.playlists_followed,
            score = self.score,
            date_added = self.date_added
        )
        return json.dumps(data)


