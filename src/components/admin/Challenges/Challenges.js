import React, { useEffect, useContext } from 'react';

import { getQuests } from 'api/quests';

import { AppContext } from 'containers/admin/Layout';

import {
  Button,
} from 'ui/admin';

import ChallengeItem from './ChallengeItem';

export default (props) => {
  const {
    challenges,
    setDraftChallenge,
  } = useContext(AppContext);

  useEffect(() => {
    getQuests().then((result) => {
      console.log(result)
    });
  }, []);

  return (
    <>
      <Button
        onClick={() => setDraftChallenge({}, true)}
        variant={'success'}
        size={'large'}
        fullWidth
        strict
      >+ Challenge</Button>

      {challenges && (
        <div className="Challenges">
          {challenges.map((item, index) => (
            <ChallengeItem
              key={item.id}
              item={item}
            />
          ))}
        </div>
      )}
    </>
  );
}