import React, { useState } from 'react';

export default (props) => {
  const {
    task,
    saveTask,
    setCorrectedOption,
  } = props;

  const deleteOption = (index) => {
    const newOptions = [...task.options];
    newOptions.splice(index, 1);
    saveTask({
      ...task,
      options: newOptions,
    });
  }

  const addOption = () => {
    const newOptions = [...(task.options || [])];
    newOptions.push({
      text: '',
      url: '',
    });
    saveTask({
      ...task,
      options: newOptions,
    });
  }

  const updateOption = (index, newState) => {
    const newOptions = [...task.options];
    newOptions[index] = {
      ...newOptions[index],
      ...newState,
    };
    saveTask({
      ...task,
      options: newOptions,
    });
  }

  return (
    <>
      {task.options && task.options.map((option, index) => (
        <Option
          key={index}
          index={index}
          corrected={task.correct_option === index}
          deleteOption={deleteOption}
          updateOption={updateOption}
          setCorrectedOption={setCorrectedOption}
          {...option}
        />
      ))}

      <button
        className="btn btn-sm btn-success"
        type="button"
        onClick={() => addOption()}
      >+ variant</button>
    </>
  );
}

function Option(props) {
  const {
    corrected,
    deleteOption,
    index,
    setCorrectedOption,
    text,
    updateOption,
    url,
  } = props;

  const [mode, setMode] = useState(Boolean(text) ? 'text' : 'url');

  return (
    <div className="input-group" style={{ marginBottom: 8 }}>
      <div className="input-group-prepend">
        <button
          className={`btn btn-sm ${corrected ? ' text-success' : ''}`}
          type="button"
          onClick={() => setCorrectedOption(index)}
          style={{
            fontSize: 22,
            lineHeight: '29px',
            padding: '0 8px 0 0',
            color: '#c5c5c5',
            boxShadow: 'none',
          }}
        ><i className="fa fa-check-circle"></i></button>
      </div>
      {mode === 'text' && (
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Text"
          value={text}
          onChange={({ target }) => updateOption(index, {
            text: target.value,
            url: '',
          })}
        />
      )}
      {mode === 'url' && (
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Url"
          value={url}
          onChange={({ target }) => updateOption(index, {
            url: target.value,
            text: '',
          })}
        />
      )}
      <div className="input-group-append">
        <button
          className="btn btn-sm btn-secondary"
          type="button"
          title={`Toggle to ${mode === 'text' ? 'url' : 'text'}`}
          onClick={() => (
            ((props[mode] && window.confirm('Are you sure?'))
              || !props[mode]
            )
            && setMode(mode === 'text' ? 'url' : 'text')
          )}
        ><i className="fa fa-redo"></i></button>
        <button
          className="btn btn-sm btn-danger"
          type="button"
          onClick={() => window.confirm('Are you sure?') && deleteOption(index)}
        ><i className="fa fa-trash"></i></button>
      </div>
    </div>
  )
}
