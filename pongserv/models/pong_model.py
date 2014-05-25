import os
from pongserv.orms import *
import uuid
import json
import random
import datetime
import pymongo
from bson.objectid import ObjectId

conn = pymongo.Connection()
db = "ping"
table = "pong"
db = conn['ping']['pong']

def create_game(player1, player2):
    startTime = str(datetime.datetime.now())[:-7]
    game = {
        "player1":player1,
        "player2":player2,
        "start_time":startTime,
        player1:0,
        player2:0,
        'history':[],
        'game_over':False
    }
    game_id = str(db.insert(game))
    return list(db.find({'_id':ObjectId(game_id)}))[0]

def increment_score(game_id, player):
    game_state = list(db.find(
        {'_id':ObjectId(game_id)}
    ))[0]
    if game_state['game_over'] == False:
        db.update(
            {'_id':ObjectId(game_id)},
            {'$inc':{player:1},
            '$push':{'history':player}}
        )
        game_state[player] += 1
        if player == game_state['player1']:
            other_player = game_state['player2']
        elif player == game_state['player2']:
            other_player = game_state['player1']
        else:
            return game_state

        end_condition = game_state[player] >= 21
        end_condition &= (game_state[player] - game_state[other_player]) >= 2

        if end_condition:
            db.update(
                {'_id':ObjectId(game_id)},
                {'$set':{'game_over':True, 'winner':player}}
            )


    game_state = list(db.find(
        {'_id':ObjectId(game_id)}
    ))[0]
    return game_state

def decrement_score(game_id, player):
    game_state = list(db.find({'_id':ObjectId(game_id)}))[0]
    try:
        should_decrement_score = (game_state['history'][-1] == player)
        should_decrement_score &= not game_state['game_over']
        should_decrement_score &= game_state[player] > 0
        if not should_decrement_score:
            raise Exception("Attempted to decrement bad score. %s %s"%(
                game_id,
                player))
    except Exception, e:
        print str(e)
        return game_state

    if should_decrement_score:
        db.update(
            {'_id':ObjectId(game_id)},
            {'$inc':{player:-1},
            '$pop':{'history':player}}
        )
        game_state[player] -= 1

        if game_state[player] == 21:
            db.update(
                {'_id':ObjectId(game_id)},
                {'$set':{'game_over':True}}
            )


    game_state = list(db.find(
        {'_id':ObjectId(game_id)}
    ))[0]
    return game_state
