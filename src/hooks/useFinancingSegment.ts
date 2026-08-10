import { PEMDA, PUBLIC } from '@/configs/constants';

import useApp from './useApp';


const useFinancingSegment = () => {
  const [state] = useApp();
  const segmentFinancing = state.userData.userDivision.segmentFinance === PUBLIC
    ? PEMDA : state.userData.userDivision.segmentFinance.toUpperCase();

  // const segmentFinancing = 'KONVEN';

  return segmentFinancing;
};

export default useFinancingSegment;
