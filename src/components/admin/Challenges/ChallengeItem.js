import React, { useContext } from 'react';

import { AppContext } from 'containers/admin/Layout';

import { Button } from 'ui/admin';

export default (props) => {
  const {
    setState,
  } = useContext(AppContext);

  const {
    item,
    removeChallenge,
  } = props;

  return (
    <div className="ChallengeItem" onClick={() => setState({
      updatedChallengeId: item.id,
    })}>
      <span className="ChallengeItem__text">
        {item.name}
      </span>
      <span className="ChallengeItem__btn">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            removeChallenge(item);
            setState({
              updatedChallengeId: null,
            });
          }}
          strict
        >&times;</Button>
      </span>
    </div>
  );
}
