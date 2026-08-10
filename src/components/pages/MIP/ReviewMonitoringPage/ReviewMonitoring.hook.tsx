import { useContext, useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';


import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { mip } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketChildList from '@/hooks/services/bucket/useGetBucketChildList';
import useBucketSubmit from '@/hooks/services/processor/useBucketSubmit';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableHistoryAskForInfo from '@/components/shared/SmiTable/TableHistoryAskForInfo';

import {
  REVIEW_MONITORING_CHILD_FILTER,
  REVIEW_MONITORING_ITEM_STATUS,
  REVIEW_MONITORING_TABLE_HEADER,
  DIVISI_OPTION,
} from './ReviewMonitoring.constants';

import type { TitleButtons, SUBMIT_ACTION } from './ReviewMonitoring.constants';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const formatActionToComment = (action: string): string => {
  const actionCommentMap: Record<string, string> = {
    CREATE_MEMO_SUPP: 'Create Memo Supplement',
    REVISION: 'Revision',
  };

  return actionCommentMap[action] || action;
};

const useReviewMonitoring = () => {
  const [hasAskForInfo, setHasAskForInfo] = useState(false);
  const [state] = useApp();
  const { recordActivity } = useRecordLog();
  const [hasCompletedItem, setHasCompletedItem] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [noPage, setNoPage] = useState(1);
  const [action, setAction] = useState(null);
  const { processId } = useIdentity();
  const [id, setId] = useState('');
  const [list, setList] = useState([]);
  const queryClient = useQueryClient();
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const path = usePathname();
  const stepper = state.stepper;
  let actions = [];
  const isTl = state.currentRole.includes(roles.TL);
  const isRm = state.currentRole.includes(roles.RM);
  const isChecker = state.currentRole.includes(roles.CHECKER);
  const isMaker = state.currentRole.includes(roles.MAKER);
  const isKadiv = state.currentRole.includes(roles.KADIV);
  const isStaffSuperAdmin = state.currentPosition.includes('TASK_FORCE');

  const buttons = {};

  if (stepper) {
    actions = stepper.steps.filter((steps) => steps.urlPath === getLastPath(path))[0]?.action;
  }

  for (const key in actions) {
    console.log('buttons', key);

    if (key.includes('ASK_FOR_INFO')) {
      buttons['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
    } else if (key.includes('EDIT')) {
      // isEdit = true;
    } else {
      buttons[key] = actions[key];
    }
  }

  const {
    mutate: submitBucket,
    isPending: isSubmitLoading,
  } = useBucketSubmit({
    onError: () => showNiceModalV2({
      title: 'Terjadi kesalahan silahkan coba kembali.',
      type: 'error',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-child-list']});
      onSuccess(action);
    },
  });

  const { data: stepperData, isFetching: isStepperLoading } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const { data, isFetching } = useGetBucketChildList({
    enabled: !!processId,
    filter: {
      bucketParent: String(processId),
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    },
    page: {
      itemPerPage: pageSize,
      noPage: noPage,
    },
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });

  useEffect(() => {
    let foundAskForInfo = false;
    let foundCompleted = false;

    if (data) {
      const listContents = data.contents?.filter((item) => REVIEW_MONITORING_CHILD_FILTER.includes(item.process));
      setList(listContents);
      console.log(listContents);

      let completedCount = 0;
      const completedStatuses = Object.entries(REVIEW_MONITORING_ITEM_STATUS)
        .filter((obj) => obj[0].includes('COMPLETED'))
        .map(([key, _]) => key);

      for (const item of listContents) {
        if (isRm || isMaker) {
          if (item.status === REVIEW_MONITORING_ITEM_STATUS.ASK_FOR_INFO) {
            foundAskForInfo = true;
          }
        }

        if (completedStatuses.includes(item.status)) {
          completedCount++;
        }
      }

      foundCompleted = listContents.length > 0 && completedCount === listContents.length;
    }

    setHasAskForInfo(foundAskForInfo);
    setHasCompletedItem(foundCompleted);
  }, [data]);

  const onSuccess = (action) => {
    const paths = path.split('/');
    if (action === 'SUBMIT' || action === 'CANCEL' || action === 'REJECT') {
      showNiceModalV2({
        onClose: () => {
          router.push(paths.slice(0, -2).join('/'));
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    } else if (action === 'CREATE_MEMO_SUPP') {
      const memoSupplementPath = replacePath(
        mip.MEMO_SUPPLEMENT_PAGE,
        {
          processId: processId,
        },
      );
      window.location.href = `${memoSupplementPath}?refresh=true`;
    } else if (action === 'REVISION') {
      router.push(
        replacePath(
          mip.MIP_REVIEW_REVISION_PAGE,
          {
            processId: processId,
          },
        ),
      );
    }
  };

  const addedSection = (id: string, processName: string) => (
    <ColumnWrapper sx={{ gap: 3, mb: 5 }}>
      <SectionTitle title="History Ask for Info" isOpen={false}>
        <TableHistoryAskForInfo
          module={state.pages.mipModule}
          process={processName}
          id={id}
        />
      </SectionTitle>
    </ColumnWrapper>
  );

  const handleEditAskForInfo = (id, divisionId, processName) => {
    const isAskForInfo = list?.find((item) =>
      item.bucketProcessId === id)?.status ===
      REVIEW_MONITORING_ITEM_STATUS.ASK_FOR_INFO;
    const isWaitingKadivReviewMonitoring = list?.find((item) =>
      item.bucketProcessId === id)?.status ===
      REVIEW_MONITORING_ITEM_STATUS.BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_KADIV;

    const tempRadtioOption = [
      { label: DIVISI_OPTION[divisionId], value: 'SUBMIT' },
      {
        label: isRm ? 'TL' : (isMaker && isAskForInfo) ? 'Checker' : 'KADIV',
        value: isRm ? 'ASK_FOR_INFO_TL' : (isMaker && isAskForInfo) ? 'ASK_FOR_INFO_CHECKER' : 'ASK_FOR_INFO_KADIV',
      }
    ];

    const radioOptionByRole = ((isKadiv || isChecker) ||
      (isMaker && isWaitingKadivReviewMonitoring)) ? null : tempRadtioOption;

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      addedSection: addedSection(id, processName),
      isLoading: isSubmitLoading,
      isRadioMandatory: true,
      onSave: async ({ comment, radioValue }) => {
        submitBucket({
          action: (isKadiv || isChecker || (isMaker && isWaitingKadivReviewMonitoring)) ? 'SUBMIT' : radioValue,
          bucketProcessId: String(id),
          comment,
          module: state.pages.mipModule,
          process: processName,
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Forward To',
      radioOptions: radioOptionByRole,
    });
  };

  const checkEditable = (status) => {
    const statusRoleMap = {
      [REVIEW_MONITORING_ITEM_STATUS.ASK_FOR_INFO]: [
        roles.RM,
        roles.MAKER,
      ],

      [REVIEW_MONITORING_ITEM_STATUS.BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_TL]: [
        roles.TL,
        roles.MAKER,
      ],

      [REVIEW_MONITORING_ITEM_STATUS.BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_KADIV]: [
        roles.KADIV,
        roles.MAKER,
      ],

      [REVIEW_MONITORING_ITEM_STATUS.BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_CHECKER]: [
        roles.CHECKER,
        roles.TL,
        roles.KADIV,
      ],

      [REVIEW_MONITORING_ITEM_STATUS.BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_KADIV_MAKER]: [
        roles.KADIV,
        roles.CHECKER,
      ],
    };

    const allowedRoles = statusRoleMap[status];

    if (!allowedRoles) return false;

    return allowedRoles.some((role) =>
      state.currentRole.includes(role),
    );
  };


  const shouldHideButtons = (stepperData?.from === 'REVISION' ||
    stepperData?.from === 'MEMO_SUPPLEMENT_CREATED') || isStaffSuperAdmin;

  const tableHeader: Array<TableHeader> = viewOnly || shouldHideButtons ?
    [...REVIEW_MONITORING_TABLE_HEADER] :
    [
      ...REVIEW_MONITORING_TABLE_HEADER,
      {
        key: 'action',
        label: 'Action',
        options: (row) => {
          const editable = checkEditable(row.status) ? [
            {
              iconName: 'edit',
              onClick: (data) => handleEditAskForInfo(data.bucketProcessId, row.divisionId, row.process),
            },
          ] : [];
          return [...editable];
        },
        sx: { minWidth: '8vw' },
        type: 'action',
      },
    ];

  const handleSubmit = (action: SUBMIT_ACTION) => {
    setAction(action);
    if (action === 'SUBMIT') {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        isLoading: isSubmitLoading,
        onSave: async ({ comment }: { comment: string }) => {
          submitBucket({
            action,
            bucketProcessId: String(processId),
            comment,
            module: state.pages.mipModule,
            process: state.pages.mipProcess,
          });
          closeNiceModal(MODAL.GLOBAL.COMMENT);
        },
        onclose: isSubmitLoading === false,
      });
    } else if (action === 'DECLINE') {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        isLoading: isSubmitLoading,
        isRadioMandatory: true,
        onSave: ({ comment, radioValue }) => {
          submitBucket({
            action: radioValue,
            bucketProcessId: String(processId),
            comment,
            module: state.pages.mipModule,
            process: state.pages.mipProcess,
          });
          closeNiceModal(MODAL.GLOBAL.COMMENT);
        },
        radioLabel: 'Declined',
        radioOptions: [
          { label: 'Canceled', value: 'CANCEL' },
          { label: 'Rejected', value: 'REJECT' },
        ],
      });
    } else {
      NiceModal.show(
        MODAL.GLOBAL.CONFIRM,
        {
          onSubmit: () => {
            submitBucket({
              action,
              bucketProcessId: String(processId),
              comment: formatActionToComment(action),
              module: state.pages.mipModule,
              process: state.pages.mipProcess,
            });
            closeNiceModal(MODAL.GLOBAL.CONFIRM);
          },
          title: action === 'REVISION' ? 'Apakah anda yakin ingin revisi MIP?' : 'Apakah anda yakin ingin Create Memo Supplement?',
        },
      );
    }
  };

  const buttonSubmit: TitleButtons[] = [
    {
      color: 'success',
      isLoading: isSubmitLoading,
      label: isRm ? 'Submit' : 'Approve Ask For info',
      onClick: () => handleSubmit('SUBMIT'),
    }
  ];

  const buttonDecline: TitleButtons[] = [
    {
      color: 'error',
      isLoading: isSubmitLoading,
      label: 'Decline',
      onClick: () => handleSubmit('DECLINE'),
      variant: 'outlined',
    }
  ];

  const buttonAskForInfo: TitleButtons[] = [
    {
      color: 'info',
      isLoading: isSubmitLoading,
      label: 'Memo Supplement',
      onClick: () => handleSubmit('CREATE_MEMO_SUPP'),
    }, {
      color: 'lightYellow',
      isLoading: isSubmitLoading,
      label: 'Revisi MIP',
      onClick: () => handleSubmit('REVISION'),
    }
  ];

  const listButtonRM = hasAskForInfo
    ? hasCompletedItem
      ? [...buttonAskForInfo, ...buttonDecline, ...buttonSubmit]
      : [...buttonAskForInfo, ...buttonDecline]
    : hasCompletedItem
      ? [...buttonDecline, ...buttonSubmit]
      : [...buttonDecline];

  const listButtonTlKadiv = [...buttonDecline, ...buttonSubmit];

  // const listButton = !viewOnly && isRm ? listButtonRM : listButtonTlKadiv;
  const listButton = !shouldHideButtons && !viewOnly && (isRm || isMaker) ? listButtonRM : [];

  return {
    buttons,
    handleEditAskForInfo,
    handleSubmit,
    hasAskForInfo,
    hasCompletedItem,
    id,
    isFetching,
    isSubmitLoading,
    list,
    listButton,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
    tableHeader,
  };
};

export default useReviewMonitoring;
