from functools import lru_cache as cached
import pymongo

import utils


@cached()
def get_connection():
    try:
        cfg = utils.get_config()['mongo']
        client = pymongo.MongoClient(f"mongodb+srv://{cfg['user']}:{cfg['password']}@{cfg['path']}")
        return client.test

    except Exception as e:
        print('Unable to load keychain.yml.', e)
        return None
