import os

from bson.objectid import ObjectId
from bson.binary import Binary
from flask import Flask, send_file, jsonify, abort, request
import flask_login
from werkzeug.utils import secure_filename

from entities import tasks, challenges
from entities import mongo_connect as db
import utils

app = Flask(__name__)
app.secret_key = utils.get_config()['flask']['key']
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

db_conn = db.get_connection()


@app.route("/ping")
def hello():
    return "pong"

@app.route("/")
def main():
    # This doesn't work (403), I don't know why
    index_path = os.path.join(app.static_folder, "index.html")
    return send_file(index_path)


@app.route("/task/<obj_id>")
def task_find(obj_id):
    task = tasks.Task.get_by_id(obj_id, db_conn)
    if task:
        return jsonify(task.view())
    else:
        return abort(404)


@app.route("/task/create")
def add_task():
    path = request.args.get('path')
    name = request.args.get('name')
    meta = request.args.get('meta')

    path = tasks.Path.get_by_id(path, db_conn)
    task = tasks.Task(name=name, meta=meta)
    path.add_task(task, db_conn)
    return 'ok'


@app.route("/paths")
def paths_all():
    return jsonify([p.view() for p in tasks.Path.get_all(db_conn)])

@app.route("/path/create")
def add_path():
    name = request.args.get('name')
    meta = request.args.get('meta')

    tasks.Path(name=name, meta=meta).upload(db_conn)
    return 'ok'

@app.route("/path/<obj_id>")
def path_find(obj_id):
    path = tasks.Path.get_by_id(obj_id, db_conn)
    if path:
        return jsonify(path.view())
    else:
        return abort(404)

@app.route("/path/<obj_id>", methods=['DELETE'])
def path_del(obj_id):
    # challenges.Challenge.get_by_criteria({'path': ObjectId(obj_id)})
    res = db_conn.paths.delete_one({'_id': ObjectId(obj_id)})
    if res.deleted_count:
        return 'deleted'
    else:
        return abort(404)

@app.route("/challenge/create")
def add_challenge():
    path = request.args.get('path')
    student = request.args.get('student')
    teacher = request.args.get('teacher')
    meta = request.args.get('meta')

    ch = challenges.Challenge(path=ObjectId(path), meta=meta, student=student, teacher=teacher)
    ch.upload(db_conn)
    return 'ok'

@app.route("/challenges")
def challenge_list():
    student_id = request.args.get('for')
    if not student_id:
        return abort(400, 'Need to specify "for" parameter')

    res = challenges.Challenge.get_by_criteria({'student': student_id}, db_conn)
    return jsonify([ch.view() for ch in res])

@app.route("/challenge/<obj_id>")
def challenge_find(obj_id):
    res = challenges.Challenge.get_by_id(obj_id, db_conn)
    if res:
        return jsonify(res.view())
    else:
        return abort(404, 'Challenge not found')

@app.route("/challenge/<obj_id>", methods=['DELETE'])
def challenge_del(obj_id):
    res = db_conn.challenges.delete_one({'_id': ObjectId(obj_id)})
    if res.deleted_count:
        return 'deleted'
    else:
        return abort(404)


@app.route("/upload", methods=['POST'])
def handle_upload():
    f = request.files.get('file')
    if f is not None:
        # photo.save(os.path.join('uploads', photo.filename))
        if not utils.is_safe_for_upload(f.filename):
            return abort(400, 'Unexpected file extension')
        filename = secure_filename(f.filename)
        encoded = Binary(f.read())
        res = db_conn.files.insert_one({'filename': filename, 'data': encoded})
        return '/user_uploads/' + str(res.inserted_id)
    else:
        return abort(400, 'Must pass file in a query by key "file"')

@app.route("/user_uploads/<obj_id>")
def retrieve_upload(obj_id):
    res = db_conn.files.find_one({'_id': ObjectId(obj_id)})
    return send_file(
        res['data'],
        # mimetype='image/jpeg',
        attachment_filename=res['filename'])


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
    app.run(host="0.0.0.0", debug=True, port=8080, threaded=True)
