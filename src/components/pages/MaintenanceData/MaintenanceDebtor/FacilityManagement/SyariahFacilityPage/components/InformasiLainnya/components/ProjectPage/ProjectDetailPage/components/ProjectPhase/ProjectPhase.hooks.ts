import useGetProjectPhase from '@/components/pages/MaintenanceData/MaintenanceDebtor/FacilityManagement/SyariahFacilityPage/hooks/useGetProjectPhase';

import { TableHeaderList } from './ProjectPhase.constants';


const useProjectPhase = () => {

  const { data } = useGetProjectPhase({
    filter: {
      id: 1,
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
  });

  return {
    TableHeaderList,
    data,
  };
};

export default useProjectPhase;
