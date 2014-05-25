from pongserv import app
from bottle import static_file
from bottle import template, request, response, view
from pongserv.models import pong_model
import json
import uuid
import datetime

def get_input_data(request):
    if 'curl' in request.headers['User-Agent']:
        input_data = json.loads(request.POST.keys()[0])
    else:
        input_data = dict(request.POST)
    return input_data

@app.route('/', method=['GET','POST'])
def index():
    ret = {"success":True, "method":request.method}
    return json.dumps(ret)

@app.route('/create/<p1>/<p2>', method="POST")
def create_game(p1, p2):
    curr_game = pong_model.create_game(p1, p2)
    ret = {
        "id":str(curr_game['_id']), 
        "p1":curr_game['player1'], 
        "p2":curr_game['player2'],
        "time":curr_game['start_time']
    }
    return json.dumps(ret)

@app.route("/score/<game_id>/<player>", method="POST")
def score(game_id, player):
    curr_game_state = pong_model.increment_score(game_id, player)
    if curr_game_state['game_over']:
        print curr_game_state
    curr_game_state['_id'] = str(curr_game_state['_id'])
    return json.dumps(curr_game_state)

@app.route("/unscore/<game_id>/<player>", method="POST")
def unscore(game_id, player):
    curr_game_state = pong_model.decrement_score(game_id, player)
    print curr_game_state
    curr_game_state['_id'] = str(curr_game_state['_id'])
    return json.dumps(curr_game_state)

@app.route('/views/<filename>')
def server_static(filename):
    return static_file(filename, root='pongserv/views')

@app.route('/js/<filename>')
def server_static(filename):
    return static_file(filename, root='pongserv/js')

@app.route('/css/<filename>')
def server_static(filename):
    return static_file(filename, root='pongserv/css')

@app.route('/html/<filename>')
def statis_html(filename):
    return static_file (filename, root='pongserv/html')





