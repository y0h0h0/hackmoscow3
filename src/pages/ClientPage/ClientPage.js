import React, { useState, useEffect } from 'react';
import Layout from 'components/client/Layout/Layout';
import Input from 'components/client/Input/Input';
import Button from 'components/client/Button/Button';
import PlayVoice from 'components/client/PlayVoice/PlayVoice';
import { alert, speak } from 'components/client/utils';
import * as Api from 'components/client/Api';
import * as questApi from 'api/quests';

import 'components/client/ClientPage.scss';

export default () => {

  const [ isReady, setIsReady ] = useState(false);
  const [ screenLocker, setScreenLocker ] = useState(true);
  const [ questKey, setQuestKey ] = useState('');
  const [ questBody, setQuestBody ] = useState(null);


  useEffect(() => {
    initialStart();
    // updateQuestBody();
  },[])



  const initialStart = async () => {
    const questKey = localStorage.getItem('hm3_questKey');

    const res = await Api.getQuestBody({key:questKey});

    setIsReady(true);
    if(res.error) return handleLogout();

    setScreenLocker(false)
    setQuestKey(questKey)
    setQuestBody(res.result)
  }

  const handleLogin = async () => {

    const res = await
    questApi.getQuests({passphrase:questKey}).then(data => {

        console.warn(data);

        // localStorage.setItem('hm3_questKey', questKey);
        // setScreenLocker(false)
        // setQuestKey(questKey)
        // setQuestBody(res.result)

    }).catch(error => {

      speak('Wrong key. Try again.')
      alert.error('Wrong key. Try again.')

    })




    // const res = await Api.getQuestBody({key:questKey});
    // if(res.error) {
    //   speak('Wrong key. Try again.')
    //   return alert.error('Wrong key. Try again.')
    // }


  }

  const handleLogout = async () => {
    delete localStorage.hm3_questKey;
    setScreenLocker(true);
    setQuestKey('');
    setQuestBody(null);
  }


  const handleAnswer = async (task_id, answer) => {
    console.log('ANSWER TO ', task_id, ' === ', answer)
  }

  const handleStartQuest = async () => {
    console.log('handleStartQuest ', handleStartQuest)
  }


  return (
    <Layout>
      <Quest questBody={questBody} onStartQuest={handleStartQuest} onAnswer={handleAnswer} onLogout={handleLogout}/>



      {screenLocker &&
        <div className="c-screenLocker">
          <div className="title">Enter your key:</div>
          <div className="c-distance-10"/>
          <Input value={questKey} onChange={setQuestKey} />
          <div className="c-distance-10"/>
          <Button onClick={handleLogin} text="Login" />
        </div>
      }

      {!isReady && <div className="c-loading-screen"><h1>LOADING</h1></div>}
    </Layout>
  );
}



const Quest = (props) => {
  if(props.questBody === null) return null;

  const { questBody: { gift_photo, gift_description, name, tasks }, onAnswer, onStartQuest, onLogout } = props;

  const rTasks = [...tasks].reverse();

  const isQuestStarted = rTasks.find(task => task.unlocked) ? true : false;
  const isQuestFinished = rTasks.every(task => task.done)
  const activeTask = rTasks.find(task => task.unlocked && !task.done);

  // console.warn('-----')
  // console.warn('- activeTask', activeTask)
  // console.warn('- isQuestStarted', isQuestStarted)
  // console.warn('- isQuestFinished', isQuestFinished)
  // console.warn('-----')

  return <div className="quest-body">

    <div className="quest-header">
      {gift_photo && <div className="gift-photo" style={{backgroundImage:`url(${gift_photo})`}} />}
      {gift_description && !isQuestFinished && <div className="gift-description">{gift_description}</div>}
      {isQuestFinished && <div className="winner">YOU WON!!!</div>}
    </div>

    <div className="quest-task-list">{
      rTasks.map(task => <TaskType key={task.id} {...task} onAnswer={onAnswer} isActive={activeTask.id === task.id} />)
    }</div>

    {
      !isQuestStarted && <Button onClick={onStartQuest} text="Start" />
    }
    <div className="c-logout-cntr">
      <Button text="logout" onClick={onLogout} />
    </div>

  </div>
}


const TaskType = ({ isActive, done, question, description, id, type, unlocked, onAnswer, options }) => {

  const [ answer, setAnswer ] = useState('');

  return <div className={`c-task ${unlocked ? '' : 'locked'} ${isActive ? 'active' : 'inactive'} ${done ? 'done' : ''}`}>

    {
      // isActive && <div className="voicer">
      //   <PlayVoice onClick={()=> {speak(question)}} />
      // </div>
    }

    {unlocked && !done && <div className="question">
      {
        <div className="voicer">
          <PlayVoice onClick={()=> {speak(question)}} />
        </div>
      }
      {question}
    </div>}
    {unlocked && !done && <div className="description">{description}</div>}

    {
        isActive ?
          type === 1 ?
            <div className="">
              <Input value={answer} onChange={setAnswer} />
              <Button onClick={onAnswer.bind(null, id, answer)} text="send"/>
            </div>
          :
          <div className="c-option-list">{
            options.map((option, index) => {
              return <div key={option.url+option.text} className="c-option" onClick={onAnswer.bind(null,id,(index+1))}>
                {option.url && <div className="opt-pic" style={{backgroundImage:`url('${option.url}')`}} />}
                {option.text && <div className="opt-text" >{option.text}</div>}
              </div>
            })
          }</div>
        :
          <div className="c-status">{ unlocked ? 'DONE' : 'LOCKED' }</div>
    }

  </div>
}
