# -*- coding: utf-8 -*-
from chanelist import app
from bottle import static_file


@app.route('/:file#(favicon.ico|humans.txt)#')
def favicon(file):
    return static_file(file, root='chanelist/static/misc')


@app.route('/:path#(images|css|js|fonts)\/.+#')
def server_static(path):
    return static_file(path, root='chanelist/static')
