import json
from json import JSONDecodeError
import os

from bson.objectid import ObjectId
from bson.binary import Binary
from flask import Flask, send_file, jsonify, abort, request
import flask_login
from werkzeug.utils import secure_filename

from entities import tasks, challenges
from entities import mongo_connect as db
from entities.tasks import Path, Task
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


@app.route("/task/create", methods=["POST"])
def add_task():
    args = request.json if request.json else request.args
    question, challenge, path, meta = utils.extract_args(args, ('question', 'challenge', 'path'))

    if challenge:
        path = challenges.Challenge.get_by_id(challenge, db_conn).path
    if not path:
        abort(400, 'Neither challenge, nor path provided')
    path = tasks.Path.get_by_id(path, db_conn)
    task = tasks.Task(question=question, meta=meta)
    path.add_task(task, db_conn)
    return jsonify(task.view())


@app.route("/paths")
def paths_all():
    return jsonify([p.view() for p in tasks.Path.get_all(db_conn)])

@app.route("/path/create", methods=["POST"])
def add_path():
    args = request.json if request.json else request.args
    name = args.get('name')
    meta = args.get('meta')

    path = tasks.Path(name=name, meta=meta)
    path.upload(db_conn)
    return jsonify(path.view())

@app.route("/path/<obj_id>")
def path_find(obj_id):
    path = tasks.Path.get_by_id(obj_id, db_conn)
    if path:
        return jsonify(path.view())
    else:
        return abort(404)

@app.route("/path/<obj_id>", methods=['DELETE'])
def path_del(obj_id):
    cascade = challenges.Challenge.get_by_criteria({'path': ObjectId(obj_id)}, db_conn)
    if cascade:
        abort(400, f'There still exist challenges: {[str(c._id) for c in cascade]}')
    res = db_conn.paths.delete_one({'_id': ObjectId(obj_id)})
    if res.deleted_count:
        return jsonify('deleted')
    else:
        return abort(404)

@app.route("/challenge/create", methods=["POST"])
def add_challenge():
    args = request.json if request.json else request.args
    path, passphrase, meta = utils.extract_args(args, ('path', 'passphrase'))

    ch = challenges.Challenge(path=ObjectId(path), meta=meta, passphrase=passphrase)
    ch.upload(db_conn)
    return jsonify(ch.view())

@app.route("/challenge/<obj_id>")
def challenge_find(obj_id):
    res = challenges.Challenge.get_by_id(obj_id, db_conn)
    if res:
        return jsonify(res.view())
    else:
        return abort(404, 'Challenge not found')

@app.route("/quest/<obj_id>", methods=['DELETE'])
def challenge_del(obj_id):
    res = db_conn.challenges.delete_one({'_id': ObjectId(obj_id)})
    if res.deleted_count:
        return jsonify('deleted')
    else:
        return abort(404)

@app.route("/quest/<obj_id>", methods=['PATCH'])
def challenge_update(obj_id):
    args = {}
    args.update(request.get_json())
    args.update(request.args)

    tasks = args.pop('tasks') if 'tasks' in args else None


    print('Tasks:', tasks, 'Args:', args)
    ch = challenges.Challenge.get_by_id(obj_id, db_conn)
    if not ch:
        abort(404, 'Challenge not found')

    if not tasks or not args:
        return jsonify(ch.view())

    if tasks is not None:
        path = Path.get_by_id(ch.path, db_conn)
        path.update_tasks(tasks, db_conn)

            # print('Batch upload')
            # if task_list:
            #     tasks = []
            #     for t in task_list:
            #         params = t.copy()
            #         question = params.pop('question')
            #         tasks.append(Task(question, meta=params))
            #     # ch.tasks = Task.upload_many(tasks, db_conn)
            # else:
            #     # ch.tasks = []
            #     ""

    flat_args, meta_args, rest_args, changed_args = [], [], [], []
    print('To update:', list(args))
    for k, v in args.items():
        if v is None:
            continue
        if k == 'id' or k == '_id':
            abort(400, 'you can\'t just change id')
        elif k in ('done', 'unlocked'):
            try:
                print('Danger zone with k:', v)
                task_list = json.loads(v) if isinstance(v, str) else v
                if isinstance(task_list, str):
                    raise Exception(f'Tried to change {k}, but unparsed param as string: {v}')
                if not isinstance(task_list, list):
                    raise Exception(f'Expected list for {k}, parsed value as {v}')

                if any(not isinstance(t, str) for t in task_list):
                    raise ValueError
                else:
                    ch.__dict__[k] = [ObjectId(t) for t in task_list]
                    changed_args.append(k)
            except JSONDecodeError or ValueError:
                abort(400, f'Updating {k} failed. It should be passed as follows: "[task_1_id, ...]"')

        if k in challenges.Challenge.arg_names:
            flat_args.append((k, v))
            changed_args.append(k)
        else:
            meta_args.append((k, v))
            if 'meta' not in changed_args:
                changed_args.append('meta')
    for k, v in flat_args:
        ch.__dict__[k] = v
    meta = ch.meta if isinstance(ch.meta, dict) else json.loads(ch.meta)
    for k, v in meta_args:
        meta[k] = v
    ch.meta = meta
    ch.update(db_conn, changed_args)
    return jsonify(challenges.Challenge.get_by_id(obj_id, db_conn).view())

@app.route("/quest/<obj_id>")
def quest_find(obj_id):
    res = challenges.Challenge.get_by_id(obj_id, db_conn, with_tasks=True)
    if res:
        return jsonify(res)
    else:
        return abort(404, 'Challenge not found')

@app.route("/quest/create", methods=["POST"])
def add_quest():
    args = request.json if request.json else request.args
    path_name, passphrase, meta = utils.extract_args(args, ('name', 'passphrase'))
    path = Path(name=path_name)
    path.upload(db_conn)

    meta['name'] = path_name
    ch = challenges.Challenge(path=path._id, meta=meta, passphrase=passphrase)
    ch.upload(db_conn)
    return jsonify(ch.view())

@app.route("/quests")
def challenge_list():
    filters = dict(request.args)
    res = challenges.Challenge.get_by_criteria(filters, db_conn)
    return jsonify([ch.view() for ch in res])


@app.route("/quest/<obj_id>/check", methods=["POST"])
def check_answer(obj_id):
    args = request.json if request.json else request.args
    required_params = ('task_id', 'answer')
    task_id, answer, meta = utils.extract_args(args, required_params)

    if any(p is None for p in (task_id, answer)):
        abort(400, f"Missing one of the required parameters: {required_params}")

    ch = challenges.Challenge.get_by_id(obj_id, db_conn, with_tasks=True)
    if not ch:
        abort(404, 'Challenge not found')

    tasks_iter = iter(ch['tasks'])
    task = next((t for t in tasks_iter if t['id'] == task_id), None)
    if task is None:
        abort(404, 'Task not found in this challenge')

    if task_id not in ch['unlocked']:
        abort(400, 'Task is locked yet')
    correct_answer = task.get('answer') or task.get('correct_option')
    success = str(correct_answer) == str(answer)
    if success:
        ch = challenges.Challenge.get_by_id(obj_id, db_conn)
        if task['id'] not in ch.done:
            ch.done.append(task['id'])
            ch.update(db_conn, ['done'])
        next_task = next(tasks_iter, None)
        if next_task is not None:
            ch.unlocked.append(next_task['id'])
            ch.update(db_conn, ['unlocked'])

    return jsonify(success)


@app.route("/quest/<obj_id>/start", methods=["POST"])
def open_answer(obj_id):
    args = request.json if request.json else request.args
    task_id = args.get('task_id')

    ch = challenges.Challenge.get_by_id(obj_id, db_conn, with_tasks=True)
    if not ch:
        abort(404, 'Quest not found')
    tasks = ch.get('tasks')
    if not tasks:
        return jsonify('No tasks actually')

    ch = challenges.Challenge.get_by_id(obj_id, db_conn)
    ch.unlocked = [tasks[0]['id']]
    ch.update(db_conn, ['unlocked'])
    return jsonify(ch.view())

    #
    # if any(p is None for p in (task_id, answer)):
    #     abort(400, f"Missing one of the required parameters: {required_params}")
    #
    # ch = challenges.Challenge.get_by_id(obj_id, db_conn, with_tasks=True)
    # if not ch:
    #     abort(404, 'Challenge not found')
    #
    # task = next((t for t in ch['tasks'] if t['id'] == task_id), None)
    # if task is None:
    #     abort(404, 'Task not found in this challenge')
    #
    # if task_id not in ch['unlocked']:
    #     abort(400, 'Task is locked yet')
    # correct_answer = task.get('answer') or task.get('correct_option')
    # success = correct_answer == str(answer)
    # if success:
    #     ch = challenges.Challenge.get_by_id(obj_id, db_conn)
    #     if task['id'] not in ch.done:
    #         ch.done.append(task['id'])
    #         ch.update(db_conn, ['done'])

    # return jsonify(success)


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
        return jsonify('/user_uploads/' + str(res.inserted_id))
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

#
# from flask import current_app, request, render_template, redirect, url_for
# from flask.ext.login import LoginManager, login_user, logout_user, login_required, current_user
# from wtforms import Form, StringField, PasswordField, validators
#
#
# class User(flask_login.UserMixin):
#     pass
#
# @login_manager.user_loader
# def load_user(userid):
#     return User.query.get(userid)
#
#
# class UserLoginForm(Form):
#     username = StringField('Username', [validators.DataRequired(), validators.Length(min=4, max=25)])
#     password = PasswordField('Password', [validators.DataRequired(), validators.Length(min=6, max=200)])
#
#
# @current_app.route('/login', methods=['GET', 'POST'])
# def login():
#     form = UserLoginForm(request.form)
#     error = None
#     if request.method == 'POST' and form.validate():
#         user = User.query.filter_by(username=username.lower()).first()
#         if user:
#             if login_user(user):
#                 current_app.logger.debug('Logged in user %s', user.username)
#                 return redirect(url_for('secret'))
#         error = 'Invalid username or password.'
#     return render_template('login.html', form=form, error=error)
#
#
# @current_app.route('/logout', methods=['GET'])
# @login_required
# def logout():
#     logout_user()
#     return redirect(url_for('login'))
#
#
# @current_app.route('/secret', methods=['GET'])
# @login_required
# def secret():
#     return 'This is a secret page. You are logged in as {}'.format(current_user.username)