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

class UserDoesNotExistError(Exception):
    pass

class PlaylistNotLoadedError(Exception):
    pass

class VideoDoesNotExistError(Exception):
    pass

def generate_uuid():
    return str(uuid.uuid4()).replace('-','')

class PlaylistModel(object):
    def __init__(self):
        self.orm = None
        self.session = Session()

    def load(self, playlist_id):
        try:
            self.orm = self.session.query(
                playlist_orm.Playlist)\
                .filter_by(playlist_id=playlist_id)\
                .one()
        except:
            raise

    def verify_owner(self, username, hashword):
        try:
            self.orm.username
        except:
            raise Exception('Playlist not initialized')
        if self.orm.username != username:
            raise Exception('User does not own this playlist')
        user = UserModel()
        try:
            user.load(username, hashword)
        except:
            raise Exception('Username and password do not match')

    def verify_playlist_name(self, playlist_name, username):
        """
        see if <username> owns a playlist titled <playlist_name>
        """
        try:
            num_PLs_with_name = self.session.query(
                playlist_orm.Playlist)\
                .filter_by(playlist_name=playlist_name)\
                .filter_by(username=username)\
                .count()
        except Exception, e:
            print e

        if num_PLs_with_name != 0:
            raise Exception  
            
    def create(self, **kwargs):
        playlist_id = None

        #check to see if this user owns this playlist
        try:
            user_model = UserModel()
            user_model.load(kwargs['username'], kwargs['hashword'])
        except Exception, e:
            raise UserDoesNotExistError(e)

        #check to see if this user has a playlist with this name
        try:
            self.verify_playlist_name(kwargs['playlist_name'], kwargs['username'])
        except Exception, e:
            print e
            raise Exception("%s already has a playlist called %s"%(kwargs['username'], kwargs['playlist_name']))

        try:
            playlist_id = generate_uuid()
            kwargs['playlist_id'] = playlist_id
            self.orm = playlist_orm.Playlist(**kwargs)
            self.session.add(self.orm)
            self.session.commit()
        except:
            raise

        try:
            try:
                owned_lists = json.loads(user_model.orm.playlists_owned)
            except:
                owned_lists = {}
            owned_lists[playlist_id] = {'video_count':0, 'total_plays':0}
            user_model.orm.playlists_owned = json.dumps(owned_lists)
            user_model.session.add(user_model.orm)
            user_model.session.commit()
        except:
            raise

        return playlist_id

    def add_video(self, video_id):
        if self.orm == None:
            raise PlaylistNotLoadedError('playlist DNE')

        try:
            video_model = VideoModel()
            video_model.load(str(video_id))
        except Exception, e:
            raise VideoDoesNotExistError('Video dne: %s', str(e))

        try:
            curr_videos = json.loads(self.orm.videos)
        except:
            curr_videos = {}
        curr_videos[video_model.orm.video_id] = 0 #playcount = 0
        self.orm.videos = json.dumps(curr_videos)
        self.session.add(self.orm)
        self.session.commit()

    def del_video(self, video_id):
        if self.orm == None:
            raise PlaylistNotLoadedError()

        try:
            video_model = VideoModel()
            video_model.load(video_id)
        except:
            raise VideoDoesNotExistError("Video not in database")

        curr_videos = json.loads(self.orm.videos)
        try:
            del curr_videos[video_model.orm.video_id]
        except:
            raise VideoDoesNotExistError("Video not in playlist")

        self.orm.videos = json.dumps(curr_videos)
        self.session.add(self.orm)
        self.session.commit()

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


