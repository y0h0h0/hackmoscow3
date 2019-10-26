import React, { useReducer, createContext } from 'react';

import { Navbar } from 'components/admin';

export const AppContext = createContext({});

// mock
// const CHALLENGES = [
//   {
//     id: 14, // not sure
//     name: `First quest`,
//     gift_photo: `https://i.ebayimg.com/00/s/MTI1NlgxNDU3/z/oQ4AAOSwX6NdVJlO/$_57.JPG`,
//     gift_description: `You will get a lego`,
//     pass_phrase: 'qwerty',
//   },
// ];

const ctxStateReducer = (state, newState) => ({
  ...state,
  ...newState,
});
const initialCtxState = {
  challenges: [],
  updatedChallengeId: null,
};

export default (props) => {
  const [ctxState, setCtxState] = useReducer(ctxStateReducer, initialCtxState);
  return (
    <AppContext.Provider value={{
      ...ctxState,
      setState: setCtxState,
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