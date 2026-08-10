import { useMemo, useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useParams, usePathname } from 'next/navigation';


import { MODAL } from '@/configs/constants/modalId';
import { lpaReview } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetParameterListByModule from '@/hooks/services/useGetParameterListByModule';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useGetCurrentModule from '../../../hooks/useGetCurrentModule';
import { modal } from '../../DetailInformation.constants';
import useSaveNewCollateral from '../../hooks/useSaveNewCollateral';


const ModalAddNewCollateral = NiceModal.create(() => {
  const modalId = modal.ADD_NEW_COLLATERAL;
  const { visible } = useModal(modalId);

  const { module, process } = useGetCurrentModule();
  const { recordActivity } = useRecordLog();
  const [selected, setSelected] = useState(null);
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);

  const { processId, parentId }: { processId: string; parentId: string } = useParams();
  const path = usePathname();
  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];

  const { data, isLoading } = useGetParameterList('typeCollateralLPA');
  const router = useCustomRouter();

  const { mutate } = useSaveNewCollateral({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: (data) => {
      // Record activity for creating new collateral
      recordActivity({
        activity: ActivityType.CREATE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          collateralId: data,
          type: lastSavedPayload?.type,
        }),
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully created new collateral in lpa review',
      });

      showNiceModalV2({
        onClose: () => {
          router.push(replacePath(lpaReview.COLLATERAL_DETAIL, {
            id: data,
            module: moduleIndex,
            parentId,
            processId,
          }));
        }, type: 'success',
      });
      closeNiceModal(modalId);
    },
  });

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
      <Button
        variant="outlined"
        sx={{ mr: 1 }}
        onClick={() => closeNiceModal(modalId)}
      >
        Cancel
      </Button>
      <Button
        isLoading={isLoading}
        disabled={!selected}
        onClick={() => {
          const payload = {
            bucketProcessId: processId,
            module,
            parentId,
            process,
            type: selected,
          };
          setLastSavedPayload(payload);
          mutate(payload);
        }}
      >
        Save
      </Button>
    </RowWrapper>
  );

  return (

    <SectionModal
      title="Add New Agunan"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxWidth: '52vw',
        minWidth: '52vw',
      }}
      customFooter={footer}
    >
      {/* Add search dan filter berdasarkan jenis agunan */}
      <Input
        type="dropdown"
        label="Jenis Agunan"
        placeholder="Pilih Jenis Agunan"
        dropdownList={data}
        value={selected}
        onChange={setSelected}
      />
    </SectionModal>
  );
});

export default ModalAddNewCollateral;
