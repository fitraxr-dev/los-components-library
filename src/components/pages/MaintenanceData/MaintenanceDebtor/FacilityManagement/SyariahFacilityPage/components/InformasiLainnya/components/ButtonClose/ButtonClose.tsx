import { Box } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';

import useProposedFacilityTab from '../../../ProposedFacilityTab/ProposedFacilityTab.hook';


const ButtonClose = () => {
  const pathname = usePathname();
  const modul = pathname.split('/')[3];
  const { processId } = useIdentity();
  const router = useRouter();
  const { clearSessionStorage } = useProposedFacilityTab();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const parentId = sessionStorage.getItem('currentIdLimitInduk');
  const fromLimitInduk = sessionStorage.getItem('currentModeFromLimitInduk');

  const handleClose = () => {
    if (from === 'limitInduk') {
      let targetPath = maintenanceDebtor.EDIT_LIMIT_INDUK;
      if (fromLimitInduk === 'detail') {
        targetPath = maintenanceDebtor.DETAIL_LIMIT_INDUK;
      } else if (fromLimitInduk === 'add') {
        targetPath = maintenanceDebtor.ADD_FACILITY_SYARIAH;
      }
      router.push(replacePath(targetPath, {
        id: parentId || '',
        module: modul,
        processId: processId,
      }));
    } else {
      clearSessionStorage();
      router.push(replacePath(maintenanceDebtor.FACILITY_SYARIAH_PAGE, {
        module: modul,
        processId: processId,
      }));
    }
  };

  return (
    <Box>
      <Button
        onClick={handleClose}
        variant="outlined"
      >
        Close
      </Button>
    </Box>
  );
};
export default ButtonClose;
