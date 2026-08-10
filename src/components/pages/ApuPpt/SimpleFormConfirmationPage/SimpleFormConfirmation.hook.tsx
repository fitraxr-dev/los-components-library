import { useEffect, useMemo, useState } from 'react';

import { Checkbox, useTheme } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';

import useCreateMappingStepper from './hooks/useCreateMappingStepper';
import useGetBucketProcessStep from './hooks/useGetBucketProcessStep';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useSimpleFormConfirmation = () => {
  const theme = useTheme();
  const { process } = useApuPpt();
  const { processId } = useIdentity();
  const [selected, setSelected] = useState([]);
  const goToNextStep = useGoToNextStep();
  const { viewOnly } = useViewOnly();
  const isViewOnly = processId?.split('-')[0] === 'APDP' || viewOnly;
  const { recordActivity } = useRecordLog();

  const { mutate: createMappingStep, isPending: isCreateLoading } = useCreateMappingStepper({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    }, onSuccess: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify({ bucketProcessId: processId,
          keys: selected || [],
          module: TypeModule.APU_PPT,
          process: TypeProcess.APU_PPT,
          typeStep: 'SIMPLE_FORM' }),
        changeBefore: '',
        module: TypeModule.APU_PPT,
        process: TypeProcess.APU_PPT,
        remarks: 'save simple form confirmation in APU PPT step',
      });
    },
  });

  const handleCreateMappingStep = ({ goToNext }: { goToNext?: boolean }) => {
    createMappingStep({
      bucketProcessId: processId,
      keys: selected || [],
      module: TypeModule.APU_PPT,
      process: TypeProcess.APU_PPT,
      typeStep: 'SIMPLE_FORM',
    }, {
      onSuccess: () => {
        showNiceModalV2({
          onClose: goToNext ? goToNextStep : undefined,
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      },
    });
  };

  const { data, defaultChecked, isLoading, isSuccess } = useGetBucketProcessStep({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    paramModule: 'simpleFormConfirmation',
    process,
  });

  const onChangeChecked = (val, status) => {
    if (selected.some((item) => item === val)) {
      setSelected(selected.filter((item) => item !== val));
    } else {
      setSelected([...selected, val]);
    }
  };

  useEffect(() => {
    if (isSuccess && defaultChecked?.length > 0) {
      setSelected(defaultChecked);
    }
  }, [isSuccess, defaultChecked]);

  const tableHeader: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '5%' },
      type: 'index',
    },
    {
      key: 'label',
      label: 'Pertanyaan',
      sx: { minWidth: '80%' },
    },
    {
      key: 'answer',
      label: 'Jawaban',
      render: (row) => (
        <RowWrapper alignItems="center">
          <Input
            type="radio"
            label=""
            value={selected?.includes(row?.value)}
            radioList={[
              { label: 'Ya', value: true },
              { label: 'Tidak', value: false }
            ]}
            onChange={(e) => {
              onChangeChecked(row?.value, e.target.value);
            }}
            sx={{ flex: 1, marginY: 1 }}
            disabled={isViewOnly}
          />
        </RowWrapper>
      )
      ,
      sx: { minWidth: '20%' },
    },
  ];

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = {
      bucketProcessId: processId,
      keys: selected || [],
      module: TypeModule.APU_PPT,
      process: TypeProcess.APU_PPT,
      typeStep: 'SIMPLE_FORM',
    };

    return Promise.resolve(payload);
  }, [processId, selected]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isViewOnly && isSuccess && !!data,
    payload: autoSavePayload,
    url: 'processor.apuppt.mappingStep',
  });

  return {
    data,
    handleCreateMappingStep,
    isAutoSaveFetching,
    isCreateLoading,
    isLoading,
    isViewOnly,
    process,
    selected,
    tableHeader,
    theme,
  };
};

export default useSimpleFormConfirmation;
