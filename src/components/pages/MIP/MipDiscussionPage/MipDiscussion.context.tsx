import { createContext, useContext } from 'react';


export const MipDiscussionContext = createContext(undefined);

export const useMipDiscussionContext = () => {
  const ctx = useContext(MipDiscussionContext);
  return ctx;
};
