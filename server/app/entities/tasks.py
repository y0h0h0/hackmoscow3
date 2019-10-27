from bson.objectid import ObjectId


class Task:
    def __init__(self, question, meta=None, _id=None, **kw):
        self.question = question
        self.meta = meta or {}
        self.meta.update(kw)
        self._id = _id

    @staticmethod
    def get_by_id(obj_id, db):
        res = db.tasks.find_one({'_id': ObjectId(obj_id)})
        if not res:
            return None
        else:
            return Task(**res)

    def view(self):
        return {'question': self.question, 'id': str(self._id), **self.meta}

    def upload(self, db):
        res = db.tasks.insert_one({'question': self.question, 'meta': self.meta})
        self._id = res.inserted_id
        return self._id

    @staticmethod
    def upload_many(tasks, db):
        return db.tasks.insert_many([{'question': t.question, 'meta': t.meta} for t in tasks]).inserted_ids


class Path:
    def __init__(self, name, meta=None, tasks=None, _id=None):
        self.name = name
        self.meta = meta or {}
        self.tasks = tasks or []
        self._id = _id

    @staticmethod
    def get_by_id(obj_id, db, with_tasks=False):
        res = db.paths.find_one({'_id': ObjectId(obj_id)})
        if not res:
            return None

        path = Path(**res)
        if not with_tasks:
            return path
        else:
            pipeline = [{"$match": {"_id": ObjectId(obj_id)}},
                        {"$lookup": {"from": "tasks", "localField": "tasks",
                                     "foreignField": "_id", "as": "tasks_list"}}]
            res = next(db.paths.aggregate(pipeline), None)
            if not res:
                return None
            else:
                tasks = sorted(res['tasks_list'], key=lambda t: res['tasks'].index(t['_id']))
                return Path(name=res['name'], meta=res['meta'], tasks=tasks, _id=res['_id'])


    @staticmethod
    def get_all(db):
        return [Path(**p) for p in db.paths.find()]

    def view(self):
        return {'name': self.name, 'meta': self.meta,
                'tasks': [str(t) if isinstance(t, ObjectId) else t.view() for t in self.tasks],
                'id': str(self._id)}

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

    def update_tasks(self, tasks, db):
        print('Updating tasks:', tasks)
        if len(tasks) == 0:
            self.tasks = []
        if all(isinstance(t, dict) for t in tasks):
            print('New tasks, uploading them')
            task_ids = Task.upload_many([Task(**t) for t in tasks], db)
            print('Got task ids:', task_ids)
            self.tasks = [ObjectId(t) if isinstance(t, str) else t for t in task_ids]
        elif all(isinstance(t, str) for t in tasks):
            self.tasks = [ObjectId(t) for t in tasks]
        elif all(isinstance(t, ObjectId) for t in tasks):
            self.tasks = tasks
        else:
            raise Exception('Inconsistent tasks')

        db.paths.update_one({'_id': self._id}, {"$set": {'tasks': self.tasks}})
