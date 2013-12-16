from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
import datetime
import json
Base = declarative_base()

class Video(Base):
    __tablename__ = 'videos'
    video_id = Column(String, primary_key=True)
    title = Column(String)
    play_count = Column(Integer)
    upvotes = Column(Integer)
    downvotes = Column(Integer)
    date_added = Column(String)
    tag1 = Column(String)
    tag2 = Column(String)
    tag3 = Column(String)
    tag4 = Column(String)
    tag5 = Column(String)
    tag6 = Column(String)
    description = Column(String)
    duration = Column(Integer)
    provider = Column(String)
    src_url = Column(String)

    def __init__(self, video_id, **kwargs):
        self.video_id = video_id
        self.title = kwargs.get('title', 'None')
        self.play_count = 0
        self.upvotes = 0
        self.downvotes = 0
        self.date_added = str(datetime.datetime.now().isoformat())[:19]
        self.tag1 = kwargs.get('tag1', '')
        self.tag2 = kwargs.get('tag2', '')
        self.tag3 = kwargs.get('tag3', '')
        self.tag4 = kwargs.get('tag4', '')
        self.tag5 = kwargs.get('tag5', '')
        self.tag6 = kwargs.get('tag6', '')
        self.description = kwargs.get('description', '')
        self.duration = kwargs.get('duration', 0)
        self.provider = kwargs.get('provider', '')
        self.src_url = kwargs.get('src_url', '')

    def __repr__(self):
        if self.duration==None:
            self.duration = 0
        if self.provider==None:
            self.provider = 'youtube'

        data = dict(
            video_id = self.video_id,
            title = self.title,
            play_count = self.play_count,
            upvotes = self.upvotes,
            downvotes = self.downvotes,
            date_added = self.date_added,
            tag1 = self.tag1,
            tag2 = self.tag2,
            tag3 = self.tag3,
            tag4 = self.tag4,
            tag5 = self.tag5,
            tag6 = self.tag6,
            description = self.description,
            duration = self.duration,
            provider = self.provider,
            src_url = self.src_url
        )
        return json.dumps(data)



