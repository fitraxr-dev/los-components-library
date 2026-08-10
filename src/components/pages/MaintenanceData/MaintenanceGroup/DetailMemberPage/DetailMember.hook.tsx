import { useEffect } from 'react';

import { useParams, usePathname } from 'next/navigation';

import { maintenanceGroup } from '@/configs/constants/pathname';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useMaintenanceGroupContext } from '@/components/layouts/MaintenanceGroupLayout/MaintenanceGroup.context';


const useDetailMember = () => {
  const { handleSetBreadcrumb } = useMaintenanceGroupContext();
  const { groupId, memberId } = useParams<{ groupId: string; memberId: string }>();
  const path = usePathname();
  const [currentPositionForm, setCurrentPositionForm] = useSessionStorage('maintenance-group-session-page', null);

  useEffect(() => {
    handleSetBreadcrumb([
      {
        label: currentPositionForm === 'edit' ? 'Edit Group' : 'Detail Group',
        url: replacePath(
          (currentPositionForm === 'edit' ?
            maintenanceGroup.EDIT_PAGE :
            maintenanceGroup.DETAIL_PAGE),
          { groupId: groupId }
        ),
      },
      {
        label: 'Detail Member Information',
        url: '',
      },

    ]);
  }, []);
  return {
    groupId,
    memberId,
  };
};

export default useDetailMember;
