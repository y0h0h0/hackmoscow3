import React from 'react';

import ChallengeTaskVariants from './ChallengeTaskVariants';

export default (props) => {
  const {
    mode,
    saveTask,
    removeTask,
    task,
  } = props;

  const taskTypeOptions = [
    {
      title: 'Text answer',
      type: 1,
      checked: !task || !task.type || parseInt(task.type) === 1,
    },
    {
      title: 'Variants' + (task && task.options ? ` (${task.options.length})` : ''),
      type: 2,
      checked: task && parseInt(task.type) === 2,
    },
  ];

  const setCorrectedOption = (index) => saveTask({
    ...task,
    correct_option: index,
  });

  return (
    <div className="ChallengeTask">
      {mode === 'add'
        ? (
          <div
            className="ChallengeTask__add"
            onClick={() => saveTask({})}
          >+</div>
        )
        : (
          <div className="ChallengeTask__body">
            <button
              className="ChallengeTask__close"
              type="button"
              onClick={() => removeTask(task)}
            >&times;</button>
            <div className="ChallengeTask__index">
              {task.index}
            </div>
            <div className="ChallengeTask__section">
              <textarea
                className="form-control form-control-sm"
                placeholder="Question"
                value={task.question}
                onChange={({ target }) => saveTask({
                  ...task,
                  question: target.value,
                })}
              />
            </div>
            <div className="ChallengeTask__section">
              <textarea
                className="form-control form-control-sm"
                placeholder="Description"
                value={task.description}
                onChange={({ target }) => saveTask({
                  ...task,
                  description: target.value,
                })}
              />
            </div>
            <div className="ChallengeTask__section">
              <div className="btn-group  btn-block btn-group-toggle">
                {taskTypeOptions.map((item, index) => (
                  <label
                    key={index}
                    className={"btn btn-sm btn-secondary" + (item.checked ? ' active' : '')}
                  >
                    <input
                      type="radio"
                      name="options"
                      autoComplete="off"
                      checked={item.checked}
                      onChange={({ target }) => target.checked && saveTask({
                        ...task,
                        type: item.type,
                      })}
                    />
                    {item.title}
                  </label>
                ))}
              </div>
            </div>
            <div className="ChallengeTask__section">
              {taskTypeOptions[0].checked && (
                <input
                  className="form-control form-control-sm"
                  placeholder="Answer"
                  value={task.answer || ''}
                  onChange={({ target }) => saveTask({
                    ...task,
                    answer: target.value,
                  })}
                />
              )}
              {taskTypeOptions[1].checked && (
                <ChallengeTaskVariants
                  task={task}
                  saveTask={saveTask}
                  setCorrectedOption={setCorrectedOption}
                />
              )}
            </div>
          </div>
        )
      }
    </div>
  );
}
