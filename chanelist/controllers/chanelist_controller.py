from chanelist import app
from bottle import static_file
from bottle import template, request, response, view
from chanelist.models import user_model, playlist_model, video_model
import urllib2
import json
import md5
import sqlalchemy.exc
from BeautifulSoup import BeautifulSoup
import traceback
import sys
import urllib, urllib2

def get_input_data(request):
    if 'curl' in request.headers['User-Agent']:
        input_data = json.loads(request.POST.keys()[0])
    else:
        input_data = dict(request.POST)
    return input_data

def format_output(success, data):
    output = {}
    output["success"] = success
    if success == 1:
        output["data"] = data
    elif success == 0:
        output["error"] = data
    output = json.dumps(output)
    return output

@app.route('/', method='GET')
def index():
    f = open('chanelist/html/index.html').read()
    return f

@app.route('/play/<playlist_id>', method='GET')
def play(playlist_id):
    f = open('chanelist/html/index.html').read()
    return f

@app.route('/user', method='POST')
@app.route('/user/<username>/<hashword>/', method='GET')
def username(username=None, hashword=None):
    user = user_model.UserModel()
    if request.method == 'GET':
        try:
            user.load(username, hashword)
            success, data = 1, user.as_json()
        except Exception, e:
            success, data = 0, e
    elif request.method == 'POST':
        try:
            input_data = get_input_data(request)
            hasher1, hasher2 = md5.new(), md5.new()
            hasher1.update(str(input_data['password1']))
            hasher2.update(str(input_data['password2']))
            password1 = hasher1.hexdigest()
            password2 = hasher2.hexdigest()
            if password1 != password2:
                raise Exception('passwords not equal')

            kwargs = dict(
                username = input_data['username'],
                password = password1,
            )
            user.create(**kwargs)
            success, data = 1, user.as_json()
        except (Exception), e:
            success, data = 0, str(e)
    return format_output(success, data)

@app.route('/login', method='POST')
def login():
    try:
        user = user_model.UserModel()
        input_data = get_input_data(request)
        hasher = md5.new()
        hasher.update(str(input_data['password']))
        kwargs = dict(
            username = input_data['username'],
            password = hasher.hexdigest(),
        )
        user.load(**kwargs)
        success, data = 1, user.as_json()
    except (Exception), e:
        success, data = 0, str(e)
    return format_output(success, data)

@app.route('/search', method='GET')
def search():
    try:
        playlist = playlist_model.PlaylistModel()
        data = str(playlist.search())
        success = 1
    except Exception, e:
        success = 0
        data = str(e) 
    return format_output(success, data)

@app.route('/playlist', method='POST')
@app.route('/playlist/<playlist_id>', method='GET')
@app.route('/playlist/<username>/<playlist_name>', method='GET')
def playlist(playlist_id=None, username=None, playlist_name=None):
    playlist = playlist_model.PlaylistModel()
    if request.method == 'GET':

        #get pl_id from username//playlistname
        if playlist_id == None:
            for pl_id in user_model.get_playlist_ids(username):
                curr_pl_name = playlist_model.get_playlist_name_from_id(pl_id)
                if playlist_name == curr_pl_name:
                    playlist_id = pl_id
                    break

        try:
            playlist.load(playlist_id)
            success = 1
            data = playlist.as_json()
        except Exception, e:
            success = 0
            data = e
    elif request.method == 'POST':
        try:
            input_data = get_input_data(request)
            kwargs = dict(
                playlist_name = input_data['playlist_name'],
                username = input_data['username'],
                hashword = input_data['hashword']
            )
            playlist.create(**kwargs)
            success, data = 1, playlist.as_json()
        except (Exception), e:
            success, data = 0, str(e)
    return format_output(success, data)



@app.route('/video', method='POST')
@app.route('/video/<video_id>', method='GET')
def video(video_id=None):
    video = video_model.VideoModel()
    if request.method == 'GET':
        try:
            video.load(video_id)
            success, data = 1, video.as_json()
        except Exception, e:
            success, data = 0, str(e)
    elif request.method == 'POST':
        input_data = get_input_data(request)

        #TODO validate this input
        description = input_data.get('description','')
        duration = input_data.get('duration', 0)
        kwargs = dict(
            video_id = input_data['video_id'],
            title = input_data['title'],
            description = description,
            duration = duration
        )

        try:
            video.create(**kwargs)
            success, data = 1, video.as_json()
        except (Exception), e:
            success, data = 0, str(e)
    return format_output(success, data)

@app.route('/batchvideo', method='POST')
def batchvideo():
    input_data = get_input_data(request)
    video_list = input_data['video_list']

    return_data = {}

    for i in range(len(video_list)):
        #TODO validate this input
        description = video_list[i].get('description','')
        duration = video_list[i].get('duration', 0)
        video_id = video_list[i]['video_id']
        kwargs = dict(
            video_id = video_id,
            title = video_list[i]['title'],
            description = description,
            duration = duration
        )

        try:
            video = video_model.VideoModel()
            video.create(**kwargs)
            return_data[i] = {
                'success':1,
                'data':video.as_json()
            }
        except (sqlalchemy.exc.IntegrityError), e:
            return_data[i] = {
                'success':0,
                'data':"%s is a duplicate"%(video_id)
            }
        except (Exception), e:
            return_data[i] = {
                'success':0,
                'data':str(e)
            }

    return format_output(1, return_data)

@app.route('/add/<video_id>/<playlist_id>', method='POST')
def add_video(video_id, playlist_id):
    try:
        input_data = get_input_data(request)
        playlist = playlist_model.PlaylistModel()
        playlist.load(playlist_id)
        playlist.verify_owner(input_data['username'], input_data['hashword'])
        playlist.add_video(video_id)
        success, data = 1, playlist.as_json()
    except Exception, e:
        success, data = 0, str(e)
    return format_output(success, data)

@app.route('/batchadd/<playlist_id>', method='POST')
def batch_add_video(playlist_id):
    try:
        playlist = playlist_model.PlaylistModel()
        playlist.load(playlist_id)
        input_data = get_input_data(request)
        playlist.verify_owner(input_data['username'], input_data['hashword'])
        video_list = input_data['video_list']
        data = []
        for i in range(len(video_list)):
            video_id = video_list[i]['video_id']
            playlist.add_video(video_id)
        success = 1
        data.append(video_id)
    except Exception, e:
        traceback.print_exc(file=sys.stdout)
        success, data = 0, str(e)
    return format_output(success, data)


@app.route('/autoadd/<playlist_id>', method='POST')
def autoadd_video(playlist_id):
    """
    #TODO 
        create the video (or verify it alrdy exists)
            make a video_model.create_from_url
        add to playlist
        return
    """
    return_data ={}
    try:
        video = video_model.VideoModel()
        input_data = get_input_data(request)
        video_list = input_data['video_list']
        if type(video_list) != type([]):
            #goofy hack for javascript ajax post not handling lists well
            #JS client has to jsonify the video list of dictionaries object
            video_list = json.loads(video_list)
    except Exception, e:
        traceback.print_exc(file=sys.stdout)
        success, data = 0, 'failzo'
        return format_output(success,data)

    index = 0
    for video_json in video_list:
        try:
            url = video_json['url']
            video_kwargs = get_url_data(url)
            fetch_video = False

            try:
                video.load(video_kwargs['video_id'])
            except video_model.VideoNotCreated, e:
                fetch_video = True

            if fetch_video:
                if video_kwargs['provider']=='youtube':
                    video_kwargs.update(get_youtube_data(video_kwargs['video_id']))
                    video.create(**video_kwargs)
                elif video_kwargs['provider']=='soundcloud':
                    video_kwargs.update(get_soundcloud_data(video_kwargs['video_id']))
                    video.create(**video_kwargs)

            video_id = video.orm.video_id
            playlist = playlist_model.PlaylistModel()
            playlist.load(playlist_id)
            playlist.verify_owner(input_data['username'], input_data['hashword'])
            playlist.add_video(video_id)
            return_data[index] = {'success':1, 'data':video.as_json()}
        except Exception, e:
            return_data[index] = {'success':0, 'data':str(e)}
        index += 1
    if len(return_data) == 0:
        success, data = 0, 'No videos added.  Could be no data sent or uncaught parse error'
    else:
        success, data = 1, return_data

    return format_output(success,data)




@app.route('/del/<video_id>/<playlist_id>', method='DELETE')
def del_video(video_id, playlist_id):
    success = 0
    try:
        playlist = playlist_model.PlaylistModel()
        playlist.load(playlist_id)
        playlist.del_video(video_id)
        success, data = 1, playlist.as_json()
    except Exception, e:
        success, data = 0, str(e)
    return format_output(success, data)

def get_youtube_data(video_id):
    try:
        base_url = 'http://gdata.youtube.com/feeds/api/videos/'
        youtube_url = base_url + video_id
        response = urllib2.urlopen(youtube_url)
        xml = BeautifulSoup(response.read())
        description = xml.findAll('media:description')[0].string
        title = xml.findAll('media:title')[0].string
        try:
            duration = int(xml.findAll('yt:duration')[0].split('"')[1])
        except:
            duration = 0
        return {
            'description':description,
            'title':title,
            'duration':duration
        }
    except:
        raise
def get_soundcloud_data(video_id):
    try:
        video_id = video_id.replace('%','/')
        base_url = "http://soundcloud.com/"
        values = {
            'url':base_url+video_id,
            'format':'json',
            'autoplay':'true'

        }
        data = urllib.urlencode(values)
        req = urllib2.Request(base_url+'oembed', data)
        resp = json.loads(urllib2.urlopen(req).read())
        iframe_url = BeautifulSoup(resp['html']).find('iframe')['src']

        return {
            'description':resp['description'],
            'title':resp['title'],
            'duration':0,
            'src_url':iframe_url
        }
    except:
        raise

def get_url_data(url):
    video_id, provider = None, None
    try:
        urlsubstr = url.split('.com')[0]
        provider = None

        if 'youtube' in urlsubstr:
            provider = 'youtube'
            get_params = url.split('?')[1].split('&')
            for get_param in get_params:
                if 'v=' in get_param:
                    video_id = get_param.split('=')[1]
                    break
        elif 'soundcloud' in urlsubstr:
            provider = 'soundcloud'
            video_id = url.split('.com/')[1].split('?')[0].replace('/','%')

        if provider == None:
            raise
    except:
        raise Exception('invalid url')
    return {'video_id':video_id, 'provider':provider}

@app.route('/views/<filename>')
def server_static(filename):
    return static_file(filename, root='chanelist/views')

@app.route('/js/<filename>')
def server_static(filename):
    return static_file(filename, root='chanelist/js')

@app.route('/css/<filename>')
def server_static(filename):
    return static_file(filename, root='chanelist/css')

@app.route('/html/<filename>')
def statis_html(filename):
    return static_file (filename, root='chanelist/html')





