import * as React from 'react';

import { MODAL } from '@/configs/constants/modalId';
import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

import { TAB } from '../../Detail.constant';
import useGetParameterGroupDetail from '../../hooks/useGetParameterGroupDetail';
import useGetParameterGroupItemList from '../../hooks/useGetParameterGroupItemList';
import useGetParameterGroupLovCode from '../../hooks/useGetParameterGroupLovCode';
import useGetParameterGroupSubmissionDetail from '../../hooks/useGetParameterGroupSubmissionDetail';
import useSaveParameterGroupDetail from '../../hooks/useSaveParameterGroup';

import { TABLE_HEADER_ITEM } from './TabProcess.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


function hasLetter(value) {
  return /\p{L}/u.test(value);
}

const useTabProcess = (watchFields: any) => {
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();

  const {
    mode,
    isMaker,
    processId,
    isBucketProcessId,
    isViewOnly,
  } = useMasterParameter();

  const payloadDetail = hasLetter(processId) ? { bucketProcessId: processId } : { id: processId };

  const parameterGroupDetail = useGetParameterGroupDetail({
    id: Number(processId),
  });
  const parameterGroupSubmissionDetail = useGetParameterGroupSubmissionDetail({
    ...payloadDetail,
  });
  const { data: parameterGroupDetailData, isLoading: isParameterGroupLoading } =
    isBucketProcessId
      ? parameterGroupSubmissionDetail
      : parameterGroupDetail;

  const { data: applicationTypeOptions } = useGetParameterList('apApplicationCategory');
  const { data: referenceGroupOptions } = useGetParameterGroupLovCode({
    applicationType: 'APU_PPT',
    currentReferenceGroup: parameterGroupDetailData?.content?.referenceGroup,
  });

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const { data: itemListData, isLoading: isItemListLoading } = useGetParameterGroupItemList({
    filter: {
      bucketProcessId: isViewOnly ?
        null : parameterGroupDetailData?.content?.bucketProcessId,
      id: parameterGroupDetailData?.content?.id,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
  });

  const handleViewItemDetail = React.useCallback((data) => {
    const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_BENEFICIAL_OWNER_DETAIL_ITEM_PAGE, {
      id: data.id,
      mode: 'detail',
      processId,
    });
    router.push(nextPath);
  }, [router, processId]);

  const handleEditItemDetail = React.useCallback((data) => {
    const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_BENEFICIAL_OWNER_DETAIL_ITEM_PAGE, {
      id: data.id,
      mode: 'edit',
      processId,
    });
    router.push(nextPath);
  }, [router, processId]);

  const handleAddItem = React.useCallback(() => {
    const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_BENEFICIAL_OWNER_CREATE_ITEM_PAGE, {
      mode,
      processId,
    });
    router.push(nextPath);
  }, [router, processId]);

  const tableHeaderItem: TableHeader[] = React.useMemo(() => {
    return [
      ...TABLE_HEADER_ITEM,
      {
        key: 'action',
        label: 'Action',
        options: () => [
          {
            iconName: 'detail',
            onClick: handleViewItemDetail,
          },
          ...(isMaker && parameterGroupDetailData?.content?.isEditable ? [{
            iconName: 'edit',
            onClick: handleEditItemDetail,
          }] : [])
        ],
        sx: { maxWidth: '10vw' },
        type: 'action',
      },
    ];
  }, [isMaker, parameterGroupDetailData, handleViewItemDetail, handleEditItemDetail]);

  const { mutate: saveParameterGroup } = useSaveParameterGroupDetail({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disubmit',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: data?.content.bucketProcessId || '',
        changeAfter: JSON.stringify(data?.content),
        changeBefore: JSON.stringify(parameterGroupDetailData?.content),
        menuCode: 'parameter-beneficial-owner',
        module: TypeModule.PARAMETER_BENEFICIAL_OWNER,
        process: TypeProcess.PARAMETER_BENEFICIAL_OWNER,
        remarks: 'Successfully Saved Parameter Group Process',
      });

      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.GLOBAL.SUCCESS).then(() => {
            const nextPath = replacePath(
              `${MASTER_PARAMETER.PARAMETER_BENEFICIAL_OWNER_DETAIL_PAGE}?tab=${TAB.SUMMARY}`,
              {
                mode: 'submission',
                processId: data?.content.bucketProcessId,
              }
            );
            router.push(nextPath);
          });
        },
        title: 'Item Group Berhasil Disimpan!',
        type: 'success',
      });
    },
  });

  const handleSave = (payload) => {
    saveParameterGroup({
      ...payload,
      bucketProcessId: parameterGroupDetailData?.content?.bucketProcessId,
      code: parameterGroupDetailData?.content?.code || '',
      id: parameterGroupDetailData?.content?.id,
    });
  };

  // Auto-save payload
  const autoSavePayload = React.useMemo(() => () => {
    const payload = {
      additionalAction: watchFields.additionalAction,
      applicationType: watchFields.applicationType,
      applicationTypeKey: watchFields.applicationType,
      bucketProcessId: parameterGroupDetailData?.content?.bucketProcessId,
      code: parameterGroupDetailData?.content?.code || '',
      createdBy: parameterGroupDetailData?.content?.createdBy,
      createdDate: parameterGroupDetailData?.content?.createdDate,
      id: parameterGroupDetailData?.content?.id,
      isActive: watchFields.isActive,
      isEditable: parameterGroupDetailData?.content?.isEditable,
      itemGroup: watchFields.itemGroup,
      itemNo: watchFields.noItemGroup,
      modifiedBy: parameterGroupDetailData?.content?.modifiedBy,
      modifiedDate: parameterGroupDetailData?.content?.modifiedDate,
      module: parameterGroupDetailData?.content?.module || 'BENEFICIAL_OWNER',
      needConfirmation: watchFields.needConfirmation,
      noItemGroup: watchFields.noItemGroup,
      referenceGroup: watchFields.referenceGroup,
      status: parameterGroupDetailData?.content?.status,
      statusLabel: parameterGroupDetailData?.content?.statusLabel,
    };
    return Promise.resolve(payload);
  }, [watchFields, parameterGroupDetailData?.content]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isViewOnly && isMaker && !!parameterGroupDetailData?.content,
    payload: autoSavePayload,
    url: 'parameter.parameterGroup.store',
  });

  return {
    applicationTypeOptions,
    handleAddItem,
    handleSave,
    isAutoSaveFetching,
    isLoading: isParameterGroupLoading || isItemListLoading,
    page,
    pageSize,
    parameterGroupDetailData: parameterGroupDetailData?.content,
    referenceGroupOptions,
    setPage,
    setPageSize,
    tableDataItem: itemListData?.contents,
    tableHeaderItem,
    totalPage: itemListData?.page?.totalPage ?? 1,
  };
};

export default useTabProcess;
