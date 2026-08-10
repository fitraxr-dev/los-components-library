import { useMemo } from 'react';

import { useParams } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

import useGetParameterGroupItemNumber from '../../hooks/useGetParameterGroupItemNumber';
import useGetParameterGroupLovCode from '../../hooks/useGetParameterGroupLovCode';
import useGetParameterGroupSubItemDetail from '../../hooks/useGetParameterGroupSubItemDetail';
import useSaveParameterGroupSubItem from '../../hooks/useSaveParameterGroupSubItem';
import { ITEM_MODAL_IDS } from '../../Item.constant';


interface UseSubItemModalProps {
  subItemId?: number | string;
  groupApplicationTypeKey?: string;
  form?: any;
  mode: 'add' | 'edit' | 'detail' ;
}

const useSubItemModal = ({ subItemId, groupApplicationTypeKey, form, mode }: UseSubItemModalProps) => {
  const { id: itemId } = useParams();
  const { recordActivity } = useRecordLog();

  const { processId } = useMasterParameter();

  const { data: parameterGroupSubItemData } = useGetParameterGroupSubItemDetail({
    bucketProcessId: processId,
    id: Number(subItemId),
  });

  const { data: referenceSubItemOptions } = useGetParameterGroupLovCode({
    applicationType: 'APU_PPT',
    currentReferenceGroup: parameterGroupSubItemData?.content?.referenceGroup,
    from: 'subitem',
  });
  const { data: subItemNumberOptions } = useGetParameterGroupItemNumber({
    applicationType: groupApplicationTypeKey,
    currentItemNo: parameterGroupSubItemData?.content?.subItemNo,
    from: 'subitem',
  });

  const { mutate: saveParameterGroupItem } = useSaveParameterGroupSubItem({
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
        remarks: 'Successfully Saved Parameter Group Sub Item',
      });

      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.GLOBAL.SUCCESS);
          closeNiceModal(ITEM_MODAL_IDS.SUBITEM_MODAL);
        },
        title: 'Sub Item Berhasil Disimpan!',
        type: 'success',
      });
    },
  });

  const handleSave = (payload) => {
    saveParameterGroupItem({
      ...payload,
      bucketProcessId: processId || '',
      groupItemId: itemId ?? null,
      id: subItemId ?? null,
    });
  };

  const watchedValues = form.watch();

  const autoSavePayload = useMemo(() => () => {
    return Promise.resolve({
      ...watchedValues,
      bucketProcessId: processId || '',
      groupItemId: itemId ?? null,
      id: subItemId ?? null,
    });
  }, [watchedValues, processId, itemId, subItemId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: mode === 'edit' && !!parameterGroupSubItemData,
    payload: autoSavePayload,
    url: 'parameter.parameterGroup.subItemStore',
  });

  return {
    handleSave,
    isAutoSaveFetching,
    parameterGroupSubItemData: parameterGroupSubItemData?.content,
    referenceSubItemOptions,
    subItemNumberOptions,
  };
};

export default useSubItemModal;
