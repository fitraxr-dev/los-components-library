import { useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { fastTrack } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';

import { modal } from '../FastTrackRequestResultPage/FastTrackRequestResult.constants';
import useSubmitFastTrack from '../FastTrackRequestResultPage/hooks/useSubmitFastTrack';

import useGetMandatoryChecklist from './hooks/useGetMandatoryChecklist';
import { tableHeader } from './MandatoryChecklist.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { SubmitRequestDto } from '@/services/openapi/processor-service';


const useMandatoryChecklist = () => {
  const theme = useTheme();
  const { processId } = useIdentity();
  const [filter, setFilter] = useState<SearchValue>();
  const pathname = usePathname();
  const router = useCustomRouter();
  const [state] = useApp();
  const { data: mandatoryChecklistData, isLoading } = useGetMandatoryChecklist({
    bucketProcessId: String(processId),
  });

  const filterContentList = [];
  const filterDropdownList = [];

  const headerTable: TableHeader[] = [
    ...tableHeader,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            if (data?.id) {
              handleOpenEditModal(data.id, data.sourceSection, true);
            }
          },
        },
      ],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
  ];

  const handleOpenEditModal = (id: number, sourceSection?: string, isViewOnly?: boolean) => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, {
      id,
      isViewOnly,
      module: TypeModule.FAST_TRACK,
      process: TypeProcess.FAST_TRACK,
      sourceSection,
      title: isViewOnly ? 'Detail Document Pembiayaan' : 'Edit Document Pembiayaan',
    });
  };

  const { isPending: isSubmitLoading, mutate: submitFastTrack } = useSubmitFastTrack({
    onError: (error?: any) => {
      const errorDetail =
            error?.response?.data?.errorDetail ||
            'Data gagal dikirim';
      showNiceModalV2({
        title: errorDetail,
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        onClose: () => {
          router.replace(fastTrack.REQUEST_PAGE);
        },
        title: 'Data berhasil dikirim',
        type: 'success',
      });
    },
  });

  const handleSubmit = async (value: string) => {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment }: any) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload: SubmitRequestDto = {
            action: value,
            bucketProcessId: String(processId),
            comment,
            module: TypeModule.FAST_TRACK,
            process: TypeProcess.FAST_TRACK,
          };
          submitFastTrack(payload);
        },
      },
    );
  };

  const handleDecline = async () => {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment, radioValue }: any) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload: SubmitRequestDto = {
            action: radioValue,
            bucketProcessId: String(processId),
            comment,
            module: TypeModule.FAST_TRACK,
            process: TypeProcess.FAST_TRACK,
          };
          submitFastTrack(payload);
        },
        radioLabel: 'Declined',
        radioOptions: [
          { label: 'Cancelled', value: 'CANCELED' },
          { label: 'Rejected', value: 'REJECTED' }
        ],
      },
    );
  };

  const actionButtons = state.stepper?.steps.filter((dt: any) => dt.urlPath === getLastPath(pathname))[0]?.action;
  const sortArray = ['COMMENT', 'DECLINE', 'SAVE', 'RETURN_TO_STAFF', 'RETURN_TO_MAKER', 'SUBMIT', 'CLOSE'];

  const modifiedObject = useMemo(() => {
    let actionObject: any = {};
    for (const key in actionButtons) {
      if (key.includes('CANCEL') || key.includes('REJECT')) {
        actionObject['DECLINE'] = 'DECLINE';
      } else {
        actionObject[key] = actionButtons[key];
      }
    }
    return actionObject;
  }, [actionButtons]);

  const sortedKeys = sortArray.filter((key) => Object.keys(modifiedObject).includes(key));

  let sortedObject: any = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = modifiedObject[key];
  });


  const handleButton = (key: string, value: string) => {
    switch (key) {
      // case 'SAVE':
      //   return (
      //     <Button
      //       key={key}
      //       variant="contained"
      //       sx={{ bgcolor: theme.palette.primary.dark }}
      //       onClick={handleSaveRemark}
      //       isLoading={isSaveRemarkLoading}
      //     >
      //       Save
      //     </Button>
      //   );
      case 'DECLINE':
        return (
          <Button key={key} variant="outlined" color="error" sx={{ bgcolor: 'white' }} onClick={handleDecline} isLoading={isSubmitLoading}>
            Decline
          </Button>
        );
      case 'SUBMIT':
      case 'RETURN_TO_STAFF':
      case 'RETURN_TO_MAKER':
        return (
          <Button key={key} variant="contained" color="success" onClick={() => handleSubmit(key)} isLoading={isSubmitLoading}>
            {value || 'Submit'}
          </Button>
        );
      default:
        return (
          <Button key={key} variant="contained" disabled sx={{ bgcolor: theme.palette.custom.gray30 }}>
            {value}
          </Button>
        );
    }
  };

  const renderActionButtons =
      sortedObject
        ? Object.entries(sortedObject).map(([key, value]: [string, string]) => handleButton(key, value))
        : null;

  return {
    filter,
    filterContentList,
    filterDropdownList,
    headerTable,
    isLoading,
    mandatoryChecklistData,
    renderActionButtons,
    setFilter,
    theme,
  };
};

export default useMandatoryChecklist;
