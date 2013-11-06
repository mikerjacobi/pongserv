#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os, sys
from chanelist import app
from bottle import debug, run

debug(True)
if __name__ == '__main__':
    try: 
        port = int(sys.argv[1])
    except:
        print 'using default port: 8080'
        port = 8080
    run(app, reloader=True, host='0.0.0.0', port=port)
