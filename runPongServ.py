#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os, sys
from pongserv import app
from bottle import debug, run

debug(True)
if __name__ == '__main__':
    try: 
        port = int(sys.argv[1])
    except:
        port = 8085
        print 'using default port: %s'%port
    run(app, reloader=True, host='0.0.0.0', port=port)
