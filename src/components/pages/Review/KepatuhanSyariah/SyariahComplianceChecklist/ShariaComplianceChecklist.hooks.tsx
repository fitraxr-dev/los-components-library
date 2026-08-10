import { useContext, useMemo, useState } from 'react';

import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import TextStyle from '@/components/shared/TextStyle';

import useGetShariaComplianceList from '../hooks/useGetShariaComplianceList';
import useGetShariaComplianceSyncfusion from '../hooks/useGetShariaComplianceSyncfusion';
import useSaveShariaComplianceSyncfusion from '../hooks/useSaveShariaComplianceSyncfusion';
import { useShariahComplianceAccess } from '../hooks/useShariahComplianceAccess';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useShariaComplianceChecklist = (container?: any) => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const route = useCustomRouter();
  const path = usePathname();
  const goToNextStep = useGoToNextStep();
  const queryClient = useQueryClient();
  const { setDirtyMsg } = useContext(DirtyContext);

  const { data } = useGetShariaComplianceList({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DK,
  });

  const { data: synfcusion } = useGetShariaComplianceSyncfusion({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DK,
  });

  const {
    hasAnyUpdateAccess: canUpdateShariahCompliance,
  } = useShariahComplianceAccess();

  const { isPending: isSaveLoading, mutate: saveAdditionalInformation } = useSaveShariaComplianceSyncfusion({
    onError: () => showNiceModalV2({ type: 'error' }),
    onSuccess: () => {
      setDirtyMsg(undefined);
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      showNiceModalV2({ title: 'Additional information berhasil disimpan', type: 'success' });
    },
  });

  const NEW_DATA = data?.reduce((acc, curr) => {
    if (curr?.subShariaComplianceChecklist.length > 0) {
      const { subShariaComplianceChecklist, ...rest } = curr;

      acc.push({
        ...rest,
        isParent: true,
      });

      subShariaComplianceChecklist?.forEach((subReport, index) => {
        acc.push({
          ...subReport,
          alphabet: String.fromCharCode(97 + index),
          isSub: true,
        });
      });
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);


  function handleClickStepper(lastPath: string, id: string | number | undefined, sub: string | undefined) {
    const segments: string[] = path.split('/');
    const basePath: string = `${segments.slice(0, -1).join('/')}/checklist-syariah-compliance/[id]/${lastPath}`;
    const validSub = sub && sub !== 'undefined' ? sub : '';
    const newPath = replacePath(basePath, { id, processId, sub: validSub });


    const urlWithParams = validSub ? `${newPath}?sub=${validSub}` : newPath;

    route.push(urlWithParams);
  };

  const TABLE_HEADER: Array<TableHeader> = [
    {
      key: 'alphabet',
      label: 'No',
      render: (row, index) => {
        let count = 1;

        for (let i = 0; i < index; i++) {
          if (NEW_DATA[i].parentId === row.parentId) {
            count++;
          }
        }

        if (row.alphabet) {
          return (
            <TextStyle
              variant="body4"
              sx={{
                pl: 3,
              }}
            >
              {row.alphabet}
            </TextStyle>
          );
        }

        return <TextStyle variant="body4">{count}</TextStyle>;
      },
    },
    {
      key: 'aspect',
      label: 'Aspek Syariah',
      render: (row) => {
        if (row.isSub) {
          return <TextStyle variant="body4">{row.subAspect}</TextStyle>;
        }

        return <TextStyle variant="body4">{row.aspect}</TextStyle>;
      },
      sx: { width: '85%' },
    },
    {
      key: 'isCheckDk',
      label: 'Ya/Tidak',
      render: (row) => {
        if (row.isParent) return null;
        if (row.isCheckDk === null) return <TextStyle variant="body4">-</TextStyle>;

        if (row.isCheckDk) {
          return <TextStyle variant="body4">Ya</TextStyle>;
        }

        return <TextStyle variant="body4">Tidak</TextStyle>;
      },
      sx: { width: '10%' },
    },
    {
      key: 'action',
      label: 'Action',
      options: (props) => {
        if (props?.isParent) {
          return [];
        }

        if (viewOnly) {
          return [{
            iconName: 'detail',
            onClick: (data) => handleClickStepper('detail', data.id, data?.alphabet),
          }];
        }

        if (canUpdateShariahCompliance) {
          return [{
            iconName: 'edit',
            onClick: (data) => handleClickStepper('edit', data.id, data?.alphabet),
          }];
        }

        return [];
      },
      type: 'action',
    }
  ];

  const handleSave = (blob: Blob, options?: { goToNext?: boolean }) => {
    const { goToNext = false } = options || {};

    if (viewOnly) {
      goToNextStep();
    } else {
      saveAdditionalInformation({
        bucketProcessId: String(processId),
        description: blob,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DK,
      }, {
        onSuccess: () => {
          if (goToNext) {
            goToNextStep();
          }
        },
      });
    }
  };

  const handleSaveOnly = (blob: Blob) => handleSave(blob, { goToNext: false });
  const handleSaveAndNext = (blob: Blob) => handleSave(blob, { goToNext: true });

  const handleNext = () => goToNextStep();

  const autoSavePayload = useMemo(() => async () => {

    const blob = await convertToDocx(container);

    return {
      bucketProcessId: String(processId),
      description: blob,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
    };
  }, [container, processId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && canUpdateShariahCompliance && !!processId,
    payload: autoSavePayload,
    url: 'mip.compliance.save',
  });

  return {
    NEW_DATA,
    TABLE_HEADER,
    canUpdateShariahCompliance,
    goToNextStep,
    handleNext,
    handleSaveAndNext,
    handleSaveOnly,
    isAutoSaveFetching,
    isSaveLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    synfcusion,
    theme,
    viewOnly,
  };
};

export default useShariaComplianceChecklist;
