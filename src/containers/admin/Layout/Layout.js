import React, { useEffect, useReducer, createContext } from 'react';

import { Navbar } from 'components/admin';

export const AppContext = createContext({});

// mock
const CHALLENGES = [
  {
    id: 14, // not sure
    name: `First quest`,
    gift_photo: `https://i.ebayimg.com/00/s/MTI1NlgxNDU3/z/oQ4AAOSwX6NdVJlO/$_57.JPG`,
    gift_description: `You will get a lego`,
    pass_phrase: 'qwerty',
  },
];

const ctxStateReducer = (state, newState) => ({
  ...state,
  ...newState,
});
const initialCtxState = {
  draftChallenge: null,
  initialChallenge: null,
  challenges: null,
};

export default (props) => {
  const [ctxState, setCtxState] = useReducer(ctxStateReducer, initialCtxState);
  const setDraftChallenge = (newState, force) => setCtxState(force
    ? {
      draftChallenge: newState,
      initialChallenge: { ...newState },
    }
    : {
      draftChallenge: {
        ...(ctxState.draftChallenge || {}),
        ...newState,
      },
    });
  const saveChallenge = () => {
    const {
      draftChallenge,
      challenges,
    } = ctxState;

    if (draftChallenge.id) {
      setCtxState({
        initialChallenge: { ...draftChallenge },
        challenges: challenges.map((item) =>
          item.id === draftChallenge.id ? ({ ...draftChallenge }) : item
        ),
      });
    } else {
      const draftChallenges = [...challenges];
      draftChallenge.id = Math.random();
      draftChallenges.push({
        ...draftChallenge,
      });
      setCtxState({
        initialChallenge: { ...draftChallenge },
        challenges: draftChallenges,
      });
    }
  }
  const removeChallenge = ({ id }) => {
    const items = [...ctxState.challenges];
    setCtxState({
      challenges: items.filter((item) => item.id !== id),
    });
  }
  const isDraftChallenge = () =>
    JSON.stringify(ctxState.initialChallenge) !== JSON.stringify(ctxState.draftChallenge);

  useEffect(() => {
    setCtxState({
      challenges: CHALLENGES,
      draftChallenge: CHALLENGES[0],
    });
  }, []);

  return (
    <AppContext.Provider value={{
      ...ctxState,
      isDraftChallenge,
      removeChallenge,
      saveChallenge,
      setState: setCtxState,
      setDraftChallenge,
    }}>
      <div className="Layout">
        <div className="Layout__block1">
          <Navbar />
        </div>
        <div className="Layout__block2">
          {props.children}
        </div>
      </div>
    </AppContext.Provider>
  );
}