import os
from sqlalchemy import *
import sys
sys.path.append('/home/pi/mjacobi/bottle/bottle-mvc/chanelist/')
import settings
from chanelist.orms import user_orm, playlist_orm, video_orm
from sqlalchemy.orm import sessionmaker
import sqlalchemy.exc
import json

engine = create_engine(settings.MYSQL_URL)
Session = sessionmaker(bind=engine)

class VideoAlreadyCreated(Exception):
    pass

class VideoNotCreated(Exception):
    pass

class VideoModel(object):
    def __init__(self):
        self.orm = None
        self.session = Session()

    def load(self, video_id):
        try:
            self.orm = self.session.query(
                video_orm.Video)\
                .filter_by(video_id=video_id)\
                .one()
        except sqlalchemy.exc.InvalidRequestError, e:
            raise VideoNotCreated('%s not created'%video_id)
        except Exception, e:
            raise

    def create(self, **kwargs):
        try:
            self.orm = video_orm.Video(**kwargs)
            self.session.add(self.orm)
            self.session.commit()
        except sqlalchemy.exc.IntegrityError, e:
            video_id = kwargs['video_id']
            raise VideoAlreadyCreated('%s already exists'%video_id)
        except Exception, e:
            raise

    def as_dict(self):
        data = {}
        if self.orm != None:
            data = json.loads(self.orm)
        return data

    def as_json(self):
        data = ""
        if self.orm != None:
            data = str(self.orm)
        return data


