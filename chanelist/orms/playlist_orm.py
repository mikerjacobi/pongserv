from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
import datetime
import json
Base = declarative_base()

class Playlist(Base):
    __tablename__ = 'playlists'
    playlist_id = Column(String, primary_key=True)
    playlist_name = Column(String)
    username = Column(String)
    videos = Column(String)
    play_count = Column(Integer)
    upvotes = Column(Integer)
    downvotes = Column(Integer)
    date_added = Column(String)
    duration = Column(Integer)

    def __init__(self, playlist_id, **kwargs):
        self.playlist_id = playlist_id
        self.playlist_name = kwargs['playlist_name']
        self.username = kwargs['username']
        self.play_count = 0
        self.upvotes = 0
        self.downvotes = 0
        self.date_added = str(datetime.datetime.now().isoformat())[:19]
        self.duration = 0
    
    def __repr__(self):
        data = dict(
            playlist_id = self.playlist_id,
            playlist_name = self.playlist_name,
            username = self.username,
            videos = self.videos,
            play_count = self.play_count,
            upvotes = self.upvotes,
            downvotes = self.downvotes,
            date_added = self.date_added,
            duration = self.duration,
        )
        return json.dumps(data)



