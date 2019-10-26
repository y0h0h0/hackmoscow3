from bson.objectid import ObjectId


class Challenge:
    def __init__(self, path, student, teacher, done=False, meta=None, _id=None):
        self.path = path
        self.student = student
        self.teacher = teacher
        self.done = done
        self.meta = meta or {}
        self._id = _id

    def view(self):
        return {'path': str(self.path), 'student': self.student, 'teacher': self.teacher, 'done': self.done,
                'meta': self.meta, '_id': str(self._id)}

    @staticmethod
    def get_by_id(obj_id, db):
        res = db.challenges.find_one({'_id': ObjectId(obj_id)})
        if not res:
            return None
        else:
            return Challenge(**res)

    @staticmethod
    def get_by_criteria(criteria, db):
        res = [Challenge(**ch) for ch in db.challenges.find(criteria)]
        return res

    def upload(self, db):
        res = db.challenges.insert_one({
            'path': self.path, 'student': self.student, 'teacher': self.teacher, 'done': self.done, 'meta': self.meta})
        self._id = res.inserted_id
