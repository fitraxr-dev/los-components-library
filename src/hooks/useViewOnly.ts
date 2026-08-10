import { reducer } from '@/components/layouts/AppLayout/App.constants';

import useApp from './useApp';


const useViewOnly = () => {
  const [state, dispatch] = useApp();
  const { viewOnly } = state;

  function setViewOnly(viewOnly: boolean) {
    dispatch({
      data: viewOnly,
      type: reducer.SET_VIEW_ONLY,
    });
  }

  return { setViewOnly, viewOnly };
};

export default useViewOnly;
