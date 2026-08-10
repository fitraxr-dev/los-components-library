import { createContext, useContext } from 'react';


export const MupDiscussionContext = createContext(undefined);

export const useMupDiscussionContext = () => {
  const ctx = useContext(MupDiscussionContext);
  return ctx;
};
