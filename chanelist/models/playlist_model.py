import os
from sqlalchemy import *
import sys
sys.path.append('/home/pi/mjacobi/bottle/bottle-mvc/chanelist/')
import settings
from chanelist.orms import user_orm, playlist_orm, video_orm
from chanelist.models import user_model, video_model
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

def get_playlist_name_from_id(playlist_id):
    p = PlaylistModel()
    p.load(playlist_id)
    return p.orm.playlist_name

class PlaylistModel(object):
    def __init__(self):
        self.orm = None
        self.session = Session()


    def search(self):
        try:
            return self.session.query(
                playlist_orm.Playlist)\
                .all()
        except:
            raise

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
        user = user_model.UserModel()
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
            user = user_model.UserModel()
            user.load(kwargs['username'], kwargs['hashword'])
        except Exception, e:
            raise UserDoesNotExistError('Credential error.')

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
                owned_lists = json.loads(user.orm.playlists_owned)
            except:
                owned_lists = {}
            owned_lists[playlist_id] = {'video_count':0, 'total_plays':0}
            user.orm.playlists_owned = json.dumps(owned_lists)
            user.session.add(user.orm)
            user.session.commit()
        except:
            raise

        return playlist_id

    def add_video(self, video_id):
        if self.orm == None:
            raise PlaylistNotLoadedError('Playlist does not exist.')

        try:
            video = video_model.VideoModel()
            video.load(str(video_id))
        except Exception, e:
            raise VideoDoesNotExistError('Video does not exist.')

        try:
            curr_videos = json.loads(self.orm.videos)
        except:
            curr_videos = {}

        if video_id in curr_videos:
            raise Exception('Video already in playlist')
        video_data = {
            'playcount':0,
            'duration':video.orm.duration,
            'date_added':video.orm.date_added
        }
        curr_videos[video.orm.video_id] = video_data 
        self.update_duration(curr_videos)
        self.orm.videos = json.dumps(curr_videos)
        self.session.add(self.orm)
        self.session.commit()

    def del_video(self, video_id):
        if self.orm == None:
            raise PlaylistNotLoadedError()

        try:
            video = video_model.VideoModel()
            video.load(video_id)
        except:
            raise VideoDoesNotExistError("Video not in database")

        curr_videos = json.loads(self.orm.videos)
        try:
            del curr_videos[video.orm.video_id]
        except:
            raise VideoDoesNotExistError("Video not in playlist")

        self.update_duration(curr_videos)

        self.orm.videos = json.dumps(curr_videos)
        self.session.add(self.orm)
        self.session.commit()

    def update_duration(self, curr_videos):
        duration = 0
        for video in curr_videos:
            try:
                curr_durr = curr_videos[video].get('duration', 0)
                duration += curr_durr
            except:
                print 'duration error: '+video
        self.orm.duration = duration

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


