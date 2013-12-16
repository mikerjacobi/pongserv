import os
import sys
import bottle

# ... build or import your bottle application here ...
root = '/var/chanelist'
settings = '/var/chanelist/chanelist'
os.chdir(root)
sys.path = [root, settings] + sys.path
from chanelist import app

# Do NOT use bottle.run() with mod_wsgi
application = app
