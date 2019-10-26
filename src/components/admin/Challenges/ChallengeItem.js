import React, { useContext } from 'react';

import { AppContext } from 'containers/admin/Layout';

import { Button } from 'ui/admin';

export default (props) => {
  const {
    removeChallenge,
    setDraftChallenge,
  } = useContext(AppContext);

  const {
    item,
  } = props;

  return (
    <div className="ChallengeItem" onClick={() => setDraftChallenge(item, true)}>
      <span className="ChallengeItem__text">
        {item.name}
      </span>
      <span className="ChallengeItem__btn">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            removeChallenge(item);
            setDraftChallenge(null, true);
          }}
          strict
        >&times;</Button>
      </span>
    </div>
  );
}
