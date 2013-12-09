import os
from sqlalchemy import *
import sys
sys.path.append('/home/pi/mjacobi/bottle/bottle-mvc/chanelist/')
import settings
from chanelist.orms import user_orm, playlist_orm, video_orm
from sqlalchemy.orm import sessionmaker
import uuid
import json

engine = create_engine(settings.MYSQL_URL)
Session = sessionmaker(bind=engine)

def get_playlist_ids(username):
    try:
        current_user = Session().query(
            user_orm.User)\
            .filter_by(username=username)\
            .one()
        return json.loads(current_user.playlists_owned)
    except:
        raise

class UserModel(object):
    def __init__(self):
        self.orm = None
        self.session = Session()

    def create(self, **kwargs):
        try:
            self.orm = user_orm.User(**kwargs)
            self.session.add(self.orm)
            self.session.commit()
        except:
            raise Exception('Account creation failure')

    def load(self, username, password):
        try:
            self.orm = self.session.query(
                user_orm.User)\
                .filter_by(username=username)\
                .filter_by(password=password)\
                .one()
        except:
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


