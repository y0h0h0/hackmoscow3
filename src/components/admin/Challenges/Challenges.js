import React, { useState, useEffect, useContext } from 'react';

import { getQuests, deleteQuest } from 'api/quests';

import { AppContext } from 'containers/admin/Layout';

import {
  Button,
} from 'ui/admin';

import ChallengeItem from './ChallengeItem';

export default (props) => {
  const {
    challenges,
    setState,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getQuests().then((challenges) => {
      setLoading(false);
      setState({ challenges });
    }).catch(() => {
      setLoading(false);
      setState({ challenges: null });
    });
    // eslint-disable-next-line
  }, []);

  const removeChallenge = (item) => {
    setLoading(true);
    deleteQuest(item).then(() => {
      setLoading(false);
      const newChallenges = [...challenges];
      setState({
        challenges: newChallenges.filter(({ id }) => id !== item.id)
      });
    }).catch(() => {
      setLoading(false);
    });
  }

  return (
    <>
      <Button
        onClick={() => setState({
          updatedChallengeId: 0,
        })}
        variant={'success'}
        size={'large'}
        disabled={loading}
        fullWidth
        strict
      >+ Quest</Button>

      <div className="Challenges" data-loading={loading ? 'Please, wait...' : null}>
        {challenges && challenges.map((item, index) => (
          <ChallengeItem
            key={item.id + '' + index}
            item={item}
            removeChallenge={removeChallenge}
          />
        ))}
      </div>
    </>
  );
}