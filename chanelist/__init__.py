# -*- coding: utf-8 -*-
__version__ = '0.1'
from bottle import Bottle, TEMPLATE_PATH
app = Bottle()
TEMPLATE_PATH.append("./chanelist/views/")
from chanelist.controllers import *
