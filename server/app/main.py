import os

from flask import Flask, send_file

app = Flask(__name__)


@app.route("/ping")
def hello():
    return "pong"


@app.route("/")
def main():
    # This doesn't work (403), I don't know why
    index_path = os.path.join(app.static_folder, "index.html")
    return send_file(index_path)


# any other route leads to static/
@app.route("/<path:path>")
def route_frontend(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.isfile(file_path):
        return send_file(file_path)
    else:
        index_path = os.path.join(app.static_folder, "index.html")
        return send_file(index_path)


if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host="0.0.0.0", debug=True, port=80, threaded=True)
