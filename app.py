#!/usr/bin/env python

import json

import argparse
from flask import Flask, render_template

from typogrify.templatetags import jinja_filters

import app_config
from render_utils import make_context, urlencode_filter, unescape_filter
import static

app = Flask(__name__)

app.jinja_env.filters['urlencode'] = urlencode_filter
app.jinja_env.filters['unescape'] = unescape_filter
jinja_filters.register(app.jinja_env)

# Example application views
@app.route('/')
def index():
    """
    Example view demonstrating rendering a simple HTML page.
    """
    context = make_context()

    with open('data/featured.json') as f:
        context['featured'] = json.load(f)

    return render_template('index.html', **context)

@app.route('/comments/')
def comments():
    """
    Full-page comments view.
    """
    return render_template('comments.html', **make_context())

app.register_blueprint(static.static)

# Boilerplate
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--port')
    args = parser.parse_args()
    server_port = 8000

    if args.port:
        server_port = int(args.port)

    app.run(host='0.0.0.0', port=server_port, debug=app_config.DEBUG)
