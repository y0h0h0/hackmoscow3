import os
from functools import lru_cache as cached

import yaml


keychain_path = os.path.join(os.path.dirname(__file__), 'keychain.yml')
config_path = os.path.join(os.path.dirname(__file__), 'config.yml')


@cached()
def get_config(path=keychain_path):
    with open(path, 'r') as cfg_f:
        cfg = yaml.safe_load(cfg_f)
        return cfg


def is_safe_for_upload(filename):
    return any(filename.endswith(ext) for ext in get_config(config_path)['allowed_extensions'])
