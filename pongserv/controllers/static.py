# -*- coding: utf-8 -*-
from pongserv import app
from bottle import static_file


@app.route('/:file#(favicon.ico|humans.txt)#')
def favicon(file):
    return static_file(file, root='pongserv/static/misc')


@app.route('/:path#(images|css|js|fonts)\/.+#')
def server_static(path):
    return static_file(path, root='pongserv/static')
