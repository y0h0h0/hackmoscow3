import json
from bson.objectid import ObjectId

from entities.tasks import Task, Path


class Challenge:
    arg_names = {'path', 'passphrase', 'done', 'unlocked'}

    def __init__(self, path, passphrase, done=None, unlocked=None, meta=None, _id=None):
        self.path = path
        self.passphrase = passphrase
        self.done = done or []
        self.unlocked = unlocked or []
        self.meta = meta or {}
        self._id = _id

    def view(self):
        return {'path': str(self.path), 'passphrase': self.passphrase,
                'done': self.done,
                'unlocked': self.unlocked,
                'id': str(self._id), **self.meta}

    @staticmethod
    def get_by_id(obj_id, db, with_tasks=False):
        ch = db.challenges.find_one({'_id': ObjectId(obj_id)})
        if not ch:
            return None
        else:
            ch = Challenge(**ch)
        if not with_tasks:
            return ch

        path = Path.get_by_id(ch.path, db, with_tasks=True)
        if not path:
            raise Exception(f'Challenge {str(ch._id)} doesn\'t have a path (missing {ch.path})')
        meta = json.loads(ch.meta) if isinstance(ch.meta, str) else ch.meta
        tasks = [Task(**t).view() for t in path.tasks]
        for t in tasks:
            t['done'] = t['id'] in ch.done
            t['unlocked'] = t['id'] in ch.unlocked
        res = {
            'id': str(ch._id),
            'name': meta.get('name') or path.name,
            'passphrase': ch.passphrase,
            'gift_description': meta.get('gift_description'),
            'gift_photo': meta.get('gift_photo'),
            'tasks': tasks,
            'unlocked': ch.unlocked,
            'done': ch.done
        }
        return res

    @staticmethod
    def get_by_criteria(criteria, db):
        res = [Challenge(**ch) for ch in db.challenges.find(criteria)]
        return res

    def upload(self, db):
        res = db.challenges.insert_one({
            'path': self.path, 'passphrase': self.passphrase, 'done': self.done, 'meta': self.meta})
        self._id = res.inserted_id

    def update(self, db, fields):
        db.challenges.update_one({'_id': self._id}, {'$set': {field: self.__dict__[field] for field in fields}})

    def mark_unlocked(self):
        pass
