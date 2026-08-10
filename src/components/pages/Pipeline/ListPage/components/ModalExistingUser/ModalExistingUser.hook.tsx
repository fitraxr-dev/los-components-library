import { useContext, useState } from 'react';


import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { businessActivityReport, pipeline } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useStandaloneBucket from '@/hooks/services/useStandaloneBucket';
import useValidateCheckDk from '@/hooks/services/useValidateCheckDk';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../List.constants';

import type { ModalExistingUserProps } from './ModalExistingUser.constant';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalExistingUser = (props: ModalExistingUserProps) => {
  const [selected, setSelected] = useState(null);
  const { recordActivity } = useRecordLog();
  const route = useCustomRouter();
  const { setDirtyMsg } = useContext(DirtyContext);

  const { hasDuplicate, callback, checkedName } = props;

  const { mutate, data: dkValidation } = useValidateCheckDk({});

  const { mutate: saveDebtorDetail } = useStandaloneBucket({
    onError() {
      showNiceModalV2({
        type: 'error',
      });
    },
    onSuccess(data) {
      recordActivity({
        activity: ActivityType.CREATE,
        bucketProcessId: data.content.bucketProcessId || '',
        changeAfter: JSON.stringify(data.content),
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully created pipeline with existing debtor',
      });

      showNiceModalV2({
        onClose: () => {
          setDirtyMsg(undefined);
          closeNiceModal(MODAL.EXISTING_USER);
          route.push(
            replacePath(pipeline.DETAIL_PAGE,
              {
                processId: data.content.bucketProcessId,
              }));
        }, type: 'success',
      });
    },
  });

  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => selected?.debtorId === data.debtorId,
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected?.debtorId === data.debtorId) {
          setSelected(null);
        } else {
          mutate({
            debtorId: data.debtorId,
            debtorName: data.debtorName,
            feature: 'DK',
          });
          setSelected(data);
        }
      },

      sx: { minWidth: '4%' },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '4%' },
      type: 'index',
    },
    {
      key: 'debtorId',
      label: 'Customer ID',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'cif',
      label: 'CIF',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'npwp',
      label: 'NPWP',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'divisionName',
      label: 'Divisi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'gamName',
      label: 'General Account Manager',
      sx: { minWidth: '10vw' },
    },
  ];


  const handleCreateNewDebiturAndPipeline = () => {
    if (hasDuplicate) {
      if (dkValidation?.hasDuplicate) {
        showNiceModalV2({
          cancelText: 'Close', title: 'Terdaftar dalam database DK. proses tidak dapat dilanjutkan.',
          type: 'error',
        });
      }

      showNiceModalV2({
        cancelText: 'Close', title: 'Maaf, anda tidak dapat menambahkan Customer dengan nama yang sudah ada',
        type: 'error',
      });
    } else {
      if (dkValidation?.hasSimilar) {
        showNiceModalV2({
          cancelText: 'Cancel',
          onSubmit: () => {
            callback();
            closeNiceModal(MODAL.EXISTING_USER);
          },
          submitText: 'Save',
          title: (
            <TextStyle sx={{ textAlign: 'center' }}>
              Terdapat kemiripan dengan database DK.
              <TextStyle
                sx={{
                  color: '#0C8CE9',
                  textDecoration: 'underline',
                }}
                onClick={handleViewData}
              >
                View Data Details
              </TextStyle>
            </TextStyle>
          ),
          type: 'warning',
        });
      }

      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          callback();
          closeNiceModal(MODAL.EXISTING_USER);
        },
        submitText: 'Ya',
        title: 'Terdapat Nama Customer yang serupa pada rekomendasi, yakin ingin menambahkan?',
        type: 'warning',
      });
    }
  };

  const handleCreatePipelineWithExisting = () => {
    saveDebtorDetail({
      debtorId: selected.debtorId,
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
    });
  };

  const handleViewData = () => {
    NiceModal.show(modal.CUSTOMER_DK_VALIDATION, { data: dkValidation?.similarDebtorList });
  };

  const dkStatus: 'isDuplicated' | 'isSimilar' | undefined = dkValidation?.hasDuplicate ? 'isDuplicated' : dkValidation?.hasSimilar ? 'isSimilar' : undefined;


  return {
    dkStatus,
    dkValidation,
    handleCreateNewDebiturAndPipeline,
    handleCreatePipelineWithExisting,
    handleViewData,
    route,
    selected,
    tableHeader,
  };
};
