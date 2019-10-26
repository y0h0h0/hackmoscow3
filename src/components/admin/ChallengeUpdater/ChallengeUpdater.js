import React, { useState, useReducer, useEffect, useContext } from 'react';

import { createQuest, updateQuest, getQuest } from 'api/quests';
// import { createTask } from 'api/tasks';

import { AppContext } from 'containers/admin/Layout';

import { ChallengeTask } from 'components/admin';
import { Button } from 'ui/admin';

// mock
// const TASKS = [
//   {
//     id: 101,
//     challenge_id: 14,
//     index: 1,
//     question: `Putin's name`,
//     description: `He is the russian president`,
//     answer: 'Vladimir',
//     type: 1,
//     unlocked: true
//   },
//   {
//     id: 102,
//     challenge_id: 14,
//     index: 2,
//     question: `Pick giraffe`,
//     description: `He has a long neck`,
//     type: 2,
//     options: [
//       { text: '', url: 'https://yandex.ru/collections/card/59ef471f0c1ed200a800ae63/' },
//       { text: '', url: 'https://4shvostikom.ru/img/derevyannyj-pestryj-bolshoj-zhiraf_0.jpg' },
//       { text: '', url: 'https://img.youtube.com/vi/xs2Us3L_s-k/0.jpg' },
//       { text: '', url: 'https://img3.goodfon.ru/original/320x240/a/9b/glaza-zhivotnye-zelenyy-lyagushka.jpg' },
//     ],
//     correct_option: 2,
//     unlocked: true
//   },
//   {
//     id: 103,
//     challenge_id: 14,
//     index: 3,
//     question: `Number of the current hackathon`,
//     description: `2nd one wes a year ago`,
//     answer: '3',
//     type: 1,
//     unlocked: false
//   },
// ];

const draftChallengeReducer = (state, {
  force,
  ...newState
}) => (force ? newState : {
  ...state,
  ...newState,
});

export default () => {
  const {
    challenges,
    updatedChallengeId,
    setState,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [initialChallenge, setInitialChallenge] = useState({});
  const [draftChallenge, setDraftChallenge] = useReducer(draftChallengeReducer, {});
  const drafted = JSON.stringify(initialChallenge) !== JSON.stringify(draftChallenge);
  useEffect(() => {
    if (updatedChallengeId) {
      setLoading(true);
      getQuest({
        id: updatedChallengeId,
      }).then((result) => {
        setLoading(false);
        setInitialChallenge(result);
        setDraftChallenge({ ...result, force: true });
        setTasks(result.tasks.map((task) => ({
          ...task,
          key: Math.random(),
        })));
      }).catch(() => {
        setLoading(false);
        setState({ updatedChallengeId: null });
      });
    } else {
      reset();
    }
    // eslint-disable-next-line
  }, [updatedChallengeId]);

  const saveChallenge = () => {
    let newChallenges = [...(challenges || [])];
    const newChallenge = {
      ...draftChallenge,
      tasks: tasks.map(({ id, ...task }) => task),
    };
    setLoading(true);
    if (!newChallenge.id) {
      createQuest(newChallenge).then((result) => {
        setLoading(false);
        Object.assign(newChallenge, result);
        // saveTasks(newChallenge.id).then(() => {
        // });
        setInitialChallenge(newChallenge);
        setDraftChallenge({
          force: true,
          ...newChallenge,
        });
        newChallenges.push(newChallenge);
      }).catch(() => {
        setLoading(false);
        reset();
      });;
    } else {
      updateQuest(newChallenge).then((result) => {
        setLoading(false);
        Object.assign(newChallenge, result);
        // saveTasks(newChallenge.id).then(() => {
        // });
        setInitialChallenge(newChallenge);
        setDraftChallenge({
          force: true,
          ...newChallenge,
        });
        newChallenges = newChallenges.map(
          (item) => item.id === newChallenge.id ? newChallenge : item,
        );
      }).catch(() => {
        setLoading(false);
        reset();
      });
    }
    setState({
      challenges: newChallenges.map((item) => ({ ...item })),
    });
  }
  // useEffect(() => {
  //   if (draftChallenge && draftChallenge.id) {
  //     setTasks(TASKS);
  //   }
  // }, [draftChallenge]);

  const saveTask = (state) => {
    if (state.key) {
      setTasks(tasks.map((task) =>
        task.key === state.key ? { ...state } : task)
      );
    } else {
      const newTasks = [...tasks];
      state.key = Math.random();
      // state.index = newTasks.length + 1;
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

  // function saveTasks(challenge) {
  //   return Promise.all(
  //     tasks.map(({
  //       id,
  //       ...item
  //     }) => createTask({
  //       challenge,
  //       ...item,
  //     }))
  //   ).then((result) => {
  //     console.log(result)
  //   }).catch(() => {
  //     reset();
  //   });
  // }

  function reset() {
    setLoading(false);
    setTasks([]);
    setInitialChallenge({});
    setDraftChallenge({ force: true });
  }

  return updatedChallengeId !== null ? (
    <div className="ChallengeUpdater" data-loading={loading ? 'Please, wait...' : null}>
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
                value={draftChallenge.passphrase || ''}
                onChange={({ target }) =>
                  setDraftChallenge({ passphrase: target.value })
                }
              />
            </div>
          </div>
        </div>

        <h5>Challenge tasks</h5>
        <div className="row">
          {tasks && tasks.map((task, index) => {
            return (
              <div key={task.key} className="col-4">
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
                  setState({ updatedChallengeId: null });
                }
              }}
            >Cancel</Button>
          </div>
          <div className="col-auto">
            <Button
              variant={'success'}
              onClick={() => saveChallenge()}
            // disabled={!drafted}
            >Save</Button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
