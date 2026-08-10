import { usePathname, useRouter } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';


const ButtonClose = (props: { isViewOnly?: boolean; handleSave?: () => void; isDisabled?: boolean }) => {
  const {
    isViewOnly = true,
    handleSave = () => { },
    isDisabled = false,
  } = props;
  const pathname = usePathname();
  const modul = pathname.split('/')[3];
  const isFacilitySyariah = pathname.split('/')[6] === 'facility-syariah';
  const { processId } = useIdentity();
  const router = useRouter();

  const handleClose = () => {
    if (isFacilitySyariah) {
      router.push(replacePath(maintenanceDebtor.FACILITY_SYARIAH_PAGE, {
        module: modul,
        processId: processId,
      }));
    } else {
      router.push(replacePath(maintenanceDebtor.CONVENTIONAL_FACILITY_PAGE, {
        debtorId: processId,
        module: modul,
      }));
    }
  };

  return (
    <>
      <Button
        onClick={handleClose}
        variant="outlined"
      >
        Close
      </Button>
      {!isViewOnly && (
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isDisabled}
        >
          Save
        </Button>
      )}
    </>
  );
};
export default ButtonClose;
