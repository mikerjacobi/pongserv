from chanelist import app
from bottle import static_file
from bottle import template, request, response, view
from chanelist.models import user_model, playlist_model, video_model
import json
import md5

def get_input_data(request):
    if 'curl' in request.headers['User-Agent']:
        input_data = json.loads(request.POST.keys()[0])
    else:
        input_data = dict(request.POST)
    return input_data

def format_output(success, data):
    output = {}
    output['success'] = success
    if success == 1:
        output['data'] = str(data)
    elif success == 0:
        output['error'] = str(data)
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
            success, data = 0, e
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
        success, data = 0, e
    return format_output(success, data)

@app.route('/search', method='GET')
def search():
    try:
        playlist = playlist_model.PlaylistModel()
        data = playlist.search()
        success = 1
    except Exception, e:
        success = 0
        data = e
    return format_output(success, data)


@app.route('/playlist', method='POST')
@app.route('/playlist/<playlist_id>', method='GET')
def playlist(playlist_id=None):
    playlist = playlist_model.PlaylistModel()
    if request.method == 'GET':
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
            success, data = 0, e
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
            success, data = 0, e
    elif request.method == 'POST':
        input_data = get_input_data(request)

        #TODO validate this input
        kwargs = dict(
            video_id = input_data['video_id'],
            title = input_data['title'],
        )

        try:
            video.create(**kwargs)
            success, data = 1, video.as_json()
        except (Exception), e:
            success, data = 0, e
    return format_output(success, data)

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
        success, data = 0, e
    return format_output(success, data)

@app.route('/del/<video_id>/<playlist_id>', method='DELETE')
def del_video(video_id, playlist_id):
    success = 0
    try:
        playlist = playlist_model.PlaylistModel()
        playlist.load(playlist_id)
        playlist.del_video(video_id)
        success, data = 1, playlist.as_json()
    except Exception, e:
        success, data = 0, e
    return format_output(success, data)

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





