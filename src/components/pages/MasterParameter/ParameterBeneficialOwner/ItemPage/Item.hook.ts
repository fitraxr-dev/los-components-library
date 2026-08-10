import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

import useGetParameterGroupDetail from './hooks/useGetParameterGroupDetail';
import useGetParameterGroupItemDetail from './hooks/useGetParameterGroupItemDetail';
import useGetParameterGroupItemNumber from './hooks/useGetParameterGroupItemNumber';
import useGetParameterGroupLovCode from './hooks/useGetParameterGroupLovCode';
import useGetParameterGroupSubmissionDetail from './hooks/useGetParameterGroupSubmissionDetail';
import useGetParameterGroupSubItemList from './hooks/useGetParamterGroupSubItemList';
import useSaveParameterGroupItem from './hooks/useSaveParameterGroupItem';
import { ITEM_MODAL_IDS, TABLE_HEADER_SUBITEM } from './Item.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useItemPage = (watchFields: any) => {
  const router = useCustomRouter();
  const { id } = useParams();
  const { recordActivity } = useRecordLog();

  const {
    mode,
    isMaker,
    processId,
    isBucketProcessId,
  } = useMasterParameter();

  const parameterGroupDetail = useGetParameterGroupDetail({
    id: Number(processId),
  });
  const parameterGroupSubmissionDetail = useGetParameterGroupSubmissionDetail({
    bucketProcessId: processId,
  }, { enabled: isBucketProcessId });
  const { data: parameterGroupDetailData, isLoading: isParameterGroupDetailLoading } =
        isBucketProcessId
          ? parameterGroupSubmissionDetail
          : parameterGroupDetail;

  const { data: parameterGroupItemData, isLoading: isParameterGroupItemLoading } = useGetParameterGroupItemDetail({
    bucketProcessId: processId,
    id: Number(id),
  });

  const { data: referenceItemOptions } = useGetParameterGroupLovCode({
    applicationType: 'APU_PPT',
    currentReferenceGroup: parameterGroupItemData?.content?.referenceGroup,
    from: 'item',
  });
  const { data: itemNumberOptions } = useGetParameterGroupItemNumber({
    applicationType: parameterGroupDetailData?.content?.applicationTypeKey,
    currentItemNo: parameterGroupItemData?.content?.itemNo,
    from: 'item',
  });

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const { data: subItemListData, isLoading: isSubItemListLoading } = useGetParameterGroupSubItemList({
    filter: {
      bucketProcessId: parameterGroupItemData?.content?.bucketProcessId,
      id: parameterGroupItemData?.content?.id,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
  });

  const handleOpenSubItemModal = React.useCallback(({ row, mode }: { row?: any; mode: string }) => {
    NiceModal.show(ITEM_MODAL_IDS.SUBITEM_MODAL, {
      groupApplicationTypeKey: parameterGroupDetailData?.content?.applicationTypeKey,
      mode,
      subItemId: row?.id,
    });
  }, [parameterGroupDetailData]);

  const tableHeaderSubItem: TableHeader[] = React.useMemo(() => {
    return [
      ...TABLE_HEADER_SUBITEM,
      {
        key: 'action',
        label: 'Action',
        options: () => [
          {
            iconName: 'detail',
            onClick: (row) => handleOpenSubItemModal({ mode: 'detail', row }),
          },
          ...(isMaker && parameterGroupDetailData?.content?.isEditable ? [{
            iconName: 'edit',
            onClick: (row) => handleOpenSubItemModal({ mode: 'edit', row }),
          }] : [])
        ],
        type: 'action',
      },
    ];
  }, [isMaker, parameterGroupDetailData, handleOpenSubItemModal]);

  const { mutate: saveParameterGroupItem } = useSaveParameterGroupItem({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disubmit',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: data?.content.bucketProcessId || processId || '',
        changeAfter: JSON.stringify(data?.content),
        changeBefore: '',
        menuCode: 'parameter-beneficial-owner',
        module: TypeModule.PARAMETER_BENEFICIAL_OWNER,
        process: TypeProcess.PARAMETER_BENEFICIAL_OWNER,
        remarks: 'Successfully Saved Parameter Group Item',
      });

      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.GLOBAL.SUCCESS).then(() => {
            const nextPath = replacePath(
              MASTER_PARAMETER.PARAMETER_BENEFICIAL_OWNER_DETAIL_PAGE,
              {
                mode,
                processId: data?.content.bucketProcessId,
              }
            );
            router.push(nextPath);
          });
        },
        title: 'Item Berhasil Disimpan!',
        type: 'success',
      });
    },
  });

  const handleSave = (payload) => {
    saveParameterGroupItem({
      ...payload,
      bucketProcessId: parameterGroupDetailData?.content?.bucketProcessId || processId || '',
      id: id ?? null,
    });
  };

  // Auto-save payload
  const autoSavePayload = React.useMemo(() => () => {
    const payload = {
      additionalAction: watchFields.additionalAction,
      bucketProcessId: parameterGroupDetailData?.content?.bucketProcessId || processId || '',
      code: parameterGroupItemData?.content?.code,
      createdBy: parameterGroupItemData?.content?.createdBy,
      createdDate: parameterGroupItemData?.content?.createdDate,
      id: id ?? null,
      isActive: watchFields.isActive,
      item: watchFields.item,
      itemNo: watchFields.itemNo,
      modifiedBy: parameterGroupItemData?.content?.modifiedBy,
      modifiedDate: parameterGroupItemData?.content?.modifiedDate,
      module: parameterGroupItemData?.content?.module || 'BENEFICIAL_OWNER',
      needConfirmation: watchFields.needConfirmation,
      reference: parameterGroupItemData?.content?.reference,
      referenceItem: watchFields.referenceItem,
      status: parameterGroupItemData?.content?.status,
    };
    return Promise.resolve(payload);
  }, [
    watchFields,
    parameterGroupDetailData?.content?.bucketProcessId,
    parameterGroupItemData?.content,
    processId,
    id
  ]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !!id && isMaker && !!parameterGroupItemData?.content,
    payload: autoSavePayload,
    url: 'parameter.parameterGroup.itemStore',
  });

  return {
    handleOpenSubItemModal,
    handleSave,
    isAutoSaveFetching,
    isLoading: isParameterGroupDetailLoading || isParameterGroupItemLoading || isSubItemListLoading,
    itemNumberOptions,
    page,
    pageSize,
    parameterGroupDetailData: parameterGroupDetailData?.content,
    parameterGroupItemData: parameterGroupItemData?.content,
    referenceItemOptions,
    setPage,
    setPageSize,
    tableDataSubItem: subItemListData?.contents,
    tableHeaderSubItem,
    totalPage: subItemListData?.page?.totalPage ?? 1,
  };
};

export default useItemPage;
