from bson.objectid import ObjectId


class Task:
    def __init__(self, name, meta=None, _id=None):
        self.name = name
        self.meta = meta or {}
        self._id = _id

    @staticmethod
    def get_by_id(obj_id, db):
        res = db.tasks.find_one({'_id': ObjectId(obj_id)})
        if not res:
            return None
        else:
            return Task(**res)

    def view(self):
        return {'name': self.name, 'meta': self.meta, '_id': str(self._id)}

    def upload(self, db):
        res = db.tasks.insert_one({'name': self.name, 'meta': self.meta})
        self._id = res.inserted_id
        return self._id


class Path:
    def __init__(self, name, meta=None, tasks=None, _id=None):
        self.name = name
        self.meta = meta or {}
        self.tasks = tasks or []
        self._id = _id

    @staticmethod
    def get_by_id(obj_id, db):
        res = db.paths.find_one({'_id': ObjectId(obj_id)})
        if not res:
            return None
        else:
            return Path(**res)

    @staticmethod
    def get_all(db):
        return [Path(**p) for p in db.paths.find()]

    def view(self):
        return {'name': self.name, 'meta': self.meta,
                'tasks': [str(t) for t in self.tasks], '_id': str(self._id)}

    def upload(self, db):
        res = db.paths.insert_one({'name': self.name, 'meta': self.meta, 'tasks': self.tasks})
        self._id = res.inserted_id

    def add_task(self, task, db):
        if task._id is None:
            task.upload(db)
        elif task._id in self.tasks:
            return task._id
        self.tasks.append(task._id)
        db.paths.update_one({'_id': self._id}, {'$set': {'tasks': self.tasks}})
        return task._id
