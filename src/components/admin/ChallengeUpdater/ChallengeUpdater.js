import React, { useState, useEffect, useContext } from 'react';

import { AppContext } from 'containers/admin/Layout';

import { ChallengeTask } from 'components/admin';
import { Button } from 'ui/admin';

// mock
const TASKS = [
  {
    id: 101,
    challenge_id: 14,
    index: 1,
    question: `Putin's name`,
    description: `He is the russian president`,
    answer: 'Vladimir',
    type: 1,
    unlocked: true
  },
  {
    id: 102,
    challenge_id: 14,
    index: 2,
    question: `Pick giraffe`,
    description: `He has a long neck`,
    type: 2,
    options: [
      { text: '', url: 'https://yandex.ru/collections/card/59ef471f0c1ed200a800ae63/' },
      { text: '', url: 'https://4shvostikom.ru/img/derevyannyj-pestryj-bolshoj-zhiraf_0.jpg' },
      { text: '', url: 'https://img.youtube.com/vi/xs2Us3L_s-k/0.jpg' },
      { text: '', url: 'https://img3.goodfon.ru/original/320x240/a/9b/glaza-zhivotnye-zelenyy-lyagushka.jpg' },
    ],
    correct_option: 2,
    unlocked: true
  },
  {
    id: 103,
    challenge_id: 14,
    index: 3,
    question: `Number of the current hackathon`,
    description: `2nd one wes a year ago`,
    answer: '3',
    type: 1,
    unlocked: false
  },
];

export default () => {
  const {
    draftChallenge,
    isDraftChallenge,
    saveChallenge,
    setDraftChallenge,
  } = useContext(AppContext);

  const drafted = isDraftChallenge();

  const [tasks, setTasks] = useState(null);
  useEffect(() => {
    if (draftChallenge && draftChallenge.id) {
      setTasks(TASKS);
    }
  }, [draftChallenge]);

  const saveTask = (state) => {
    if (state.id) {
      setTasks(tasks.map((task) =>
        task.id === state.id ? { ...state } : task)
      );
    } else {
      const newTasks = [...tasks];
      state.id = Math.random();
      state.index = newTasks.length + 1;
      newTasks.push({ ...state });
      setTasks(newTasks);
    }
  }

  const removeTask = ({ id }) => {
    setTasks(tasks.filter((task) => task.id !== id).map((task, index) => ({
      ...task,
      index: index + 1,
    })));
  }

  return draftChallenge ? (
    <div className="ChallengeUpdater">
      <div className="ChallengeUpdater__body">

        <h5>Challenge base info</h5>

        <div className="row">
          <div className="col-6">
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                placeholder="Challenge name"
                value={draftChallenge.name || ''}
                onChange={({ target }) =>
                  setDraftChallenge({ name: target.value })
                }
              />
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                placeholder="Pass phrase"
                value={draftChallenge.pass_phrase || ''}
                onChange={({ target }) =>
                  setDraftChallenge({ pass_phrase: target.value })
                }
              />
            </div>
          </div>
        </div>

        <h5>Challenge tasks</h5>
        <div className="row">
          {tasks && tasks.map((task, index) => {
            return (
              <div key={task.id} className="col-4">
                <ChallengeTask
                  task={task}
                  saveTask={saveTask}
                  removeTask={removeTask}
                />
              </div>
            );
          })}
          <div className="col-4">
            <ChallengeTask
              mode={'add'}
              saveTask={saveTask}
            />
          </div>
        </div>

        <h5>Challenge reward</h5>

      </div>
      <div className="ChallengeUpdater__footer">
        <div className="row row--sm justify-content-end">
          <div className="col-auto">
            <Button
              onClick={() => {
                if ((drafted && window.confirm('Are you sure?')) || !drafted) {
                  setDraftChallenge(null, true);
                }
              }}
            >Cancel</Button>
          </div>
          <div className="col-auto">
            <Button
              variant={'success'}
              onClick={() => saveChallenge()}
              disabled={!drafted}
            >Save</Button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
