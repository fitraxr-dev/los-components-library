import { createContext, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { engagementSubmission } from '@/configs/constants/pathname';
import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';


const initialState = {
  actionButtons: {},
  activeTab: 0,
};

export const EngagementSubmissionContext = createContext(undefined);

export const EngagementSubmissionProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const lastPath = getLastPath(engagementSubmission.PK_PROCESSING_TYPE_MONITORING);
  const [{ stepper }] = useApp();

  const updateActionButtons = () => {
    const btnAction = stepper.steps?.find((step) => step?.urlPath === lastPath && typeof step.action === 'object')?.action;
    setState({ ...state, actionButtons: btnAction });
  };


  useEffect(updateActionButtons, [stepper]);

  return (
    <EngagementSubmissionContext.Provider
      value={{
        setState,
        state,
      }}
    >
      {children}
    </EngagementSubmissionContext.Provider>
  );
};
