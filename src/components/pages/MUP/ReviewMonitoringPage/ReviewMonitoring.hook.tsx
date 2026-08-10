import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';


import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { mip } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetBucketChildList from '@/hooks/services/useGetBucketChildList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import { reviewMonitoringAskForInfoRm, reviewMonitoringItemStatus } from './ReviewMonitoring.constants';


const useReviewMonitoring = () => {
  const [hasAskForInfo, setHasAskForInfo] = useState(false);
  const [state] = useApp();
  const [hasCompletedItem, setHasCompletedItem] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { processId } = useIdentity();
  const [list, setList] = useState([]);
  const queryClient = useQueryClient();
  const router = useCustomRouter();
  const path = usePathname();
  const stepper = state.stepper;
  let actions = [];
  const isRm = state.currentRole.includes(roles.RM);

  const buttons = {};

  if (stepper) {
    actions = stepper.steps.filter((steps) => steps.urlPath === getLastPath(path))[0]?.action;
  }

  for (const key in actions) {

    if (key.includes('ASK_FOR_INFO')) {
      buttons['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
    } else if (key.includes('EDIT')) {
      // isEdit = true;
    } else {
      buttons[key] = actions[key];
    }
  }

  const { mutate: submitReviewMonitoringRequest, isPending: isSubmitLoading } = useSubmitBucket({
  });

  const { data: bucketData } = useGetBucketById(
    {
      bucketProcessId: processId,
      module: TypeModule.MUP,
      process: TypeProcess.MUP });

  const { data, isFetching } = useGetBucketChildList({
    filter: {
      bucketParent: bucketData?.bucketParentId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.MIP_REVIEW,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });

  useEffect(() => {
    let foundAskForInfo = false;
    let foundCompleted = false;

    if (data) {
      const listContents = data.contents?.filter((item) => {return (
        (item.process === TypeProcess.REVIEWER_DELST) ||
        (item.process === TypeProcess.REVIEWER_DEPI) ||
        (item.process === TypeProcess.REVIEWER_DH) ||
        (item.process === TypeProcess.REVIEWER_DK)
      ); });
      setList(listContents);

      for (const item of listContents) {
        for (const key of reviewMonitoringAskForInfoRm) {
          if (item.status === key) {
            foundAskForInfo = true;
            break;
          }
        }
        for (const [key, _] of Object.entries(reviewMonitoringItemStatus).filter((obj) => obj[0].includes('COMPLETED'))) {
          if (item.status === key) {
            foundCompleted = true;
            break;
          }
        }

        if (foundAskForInfo && foundCompleted) break;
      }
    }

    setHasAskForInfo(foundAskForInfo);
    setHasCompletedItem(foundCompleted);
  }, [data]);

  const onSuccess = (action) =>
  {
    const paths = path.split('/');
    if (action === 'SUBMIT') {
      showNiceModalV2({
        onClose: () => {
          router.push(paths.slice(0, -2).join('/'));
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    } else if (action === 'CANCEL') {
      showNiceModalV2({
        onClose: () => {
          router.push(paths.slice(0, -2).join('/'));
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });

    } else if (action === 'RETURN_STAFF') {
      showNiceModalV2({
        onClose: () => {
          router.push(paths.slice(0, -2).join('/'));
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    } else if (action === 'RETURN_TL') {
      showNiceModalV2({
        onClose: () => {
          router.push(paths.slice(0, -2).join('/'));
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    } else if (action === 'CREATE_MEMO_SUPP') {
      router.push(
        replacePath(
          mip.MEMO_SUPPLEMENT_PAGE,
          {
            processId: processId,
          },
        ),
      );
    } else if (action === 'REVISION') {
      router.push(
        replacePath(
          mip.PROPOSAL_PAGE,
          {
            processId: processId,
          },
        ),
      );
    }
  };

  const handleSubmitAskForInfo = ({ id, process, action, comment }) => {
    submitReviewMonitoringRequest({
      submitRequestDto: {
        action,
        bucketProcessId: String(id),
        comment,
        module: state.pages.mipModule,
        process: process,
      },
    }, {
      onError: () => showNiceModalV2({ title: 'Terjadi kesalahan silahkan coba kembali.', type: 'error' }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        queryClient.invalidateQueries({ queryKey: ['bucket-child-list']});
      },
    });
  };

  const handleSubmit = (
    { action, showComment = true }: {action: string; showComment?: boolean}
  ) => {
    if (showComment) {
      if (action === 'SUBMIT') {
        if (isRm) {
          NiceModal.show(MODAL.GLOBAL.CONFIRM, {
            agreeText: 'Ya',
            cancelText: 'Tidak',
            onCancel: () => { closeNiceModal(MODAL.GLOBAL.CONFIRM); },
            onSubmit: async () => {
              closeNiceModal(MODAL.GLOBAL.CONFIRM);
              NiceModal.show(
                MODAL.GLOBAL.COMMENT,
                {
                  onSave: ({ comment }) => {
                    closeNiceModal(MODAL.GLOBAL.COMMENT);
                    submitReviewMonitoringRequest({
                      submitRequestDto: {
                        action,
                        bucketProcessId: String(processId),
                        comment,
                        module: state.pages.mipModule,
                        process: state.pages.mipProcess,
                      },
                    }, {
                      onError: () => showNiceModalV2({ title: 'Terjadi kesalahan silahkan coba kembali.', type: 'error' }),
                      onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
                        onSuccess(action);
                      },
                    });
                  },
                },
              );

            },
            title: 'Apakah anda yakin ingin Submit ke MUP?',
          });
        } else {
          NiceModal.show(
            MODAL.GLOBAL.COMMENT,
            {
              onSave: ({ comment }) => {
                closeNiceModal(MODAL.GLOBAL.COMMENT);
                submitReviewMonitoringRequest({
                  submitRequestDto: {
                    action,
                    bucketProcessId: String(processId),
                    comment,
                    module: state.pages.mipModule,
                    process: state.pages.mipProcess,
                  },
                }, {
                  onError: () => showNiceModalV2({ title: 'Terjadi kesalahan silahkan coba kembali.', type: 'error' }),
                  onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
                    onSuccess(action);
                  },
                });
              },
            },
          );
        }
      } else if (action === 'CANCEL') {
        NiceModal.show(
          MODAL.GLOBAL.COMMENT,
          {
            onSave: ({ comment, radioValue }) => {
              const bucketAction = radioValue === 1 ? 'CANCEL' : 'REJECT';
              closeNiceModal(MODAL.GLOBAL.COMMENT);
              submitReviewMonitoringRequest({
                submitRequestDto: {
                  action: bucketAction,
                  bucketProcessId: String(processId),
                  comment,
                  module: state.pages.mipModule,
                  process: state.pages.mipProcess,
                },
              }, {
                onError: () => showNiceModalV2({ title: 'Terjadi kesalahan silahkan coba kembali.', type: 'error' }),
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
                  onSuccess(action);
                },
              });
            },
            radioLabel: 'Declined',
            radioOptions: [
              { label: 'Canceled', value: '1' },
              { label: 'Rejected', value: '2' }
            ],
          },
        );
      }
    } else {
      submitReviewMonitoringRequest({
        submitRequestDto: {
          action,
          bucketProcessId: String(processId),
          comment: action,
          module: state.pages.mipModule,
          process: state.pages.mipProcess,
        },
      }, {
        onError: () => showNiceModalV2({ title: 'Terjadi kesalahan silahkan coba kembali.', type: 'error' }),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
          onSuccess(action);
        } });
    }
  };

  return {
    buttons,
    handleSubmit,
    handleSubmitAskForInfo,
    hasAskForInfo,
    hasCompletedItem,
    isFetching,
    isSubmitLoading,
    list,
    page,
    pageSize,
    setPage,
    setPageSize,
  };
};

export default useReviewMonitoring;
