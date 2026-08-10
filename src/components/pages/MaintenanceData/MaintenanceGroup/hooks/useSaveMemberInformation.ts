import NiceModal from '@ebay/nice-modal-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';
import { GroupV2ControllerApi } from '@/services/openapi/master-service';


interface SaveMemberInformationPayload {
  bucketProcessId: string;
  debtorCode: string;
  groupId: string;
  remark?: string;
  checkBox1?: boolean;
  checkBox2?: boolean;
  checkBox3?: boolean;
  checkBox4?: boolean;
  checkBox5?: boolean;
  hasFinancialDependency?: boolean;
  hasSharedDirectors?: boolean;
  isControlledBySameParty?: boolean;
  isControllingOther?: boolean;
  isGuarantorForOther?: boolean;
  initialValues?: any;
}

const useSaveMemberInformation = () => {
  const queryClient = useQueryClient();
  const { recordActivity } = useRecordLog();

  const { mutate: saveMemberInfo, isPending: isSaving } = useMutation({
    mutationFn: async (payload: SaveMemberInformationPayload) => {
      const api = new GroupV2ControllerApi();
      const response = await api.updateGroupMaintenanceMember(payload);
      return response.data;
    },
    onError: (error: any) => {
      showNiceModalV2({
        title: error?.response?.data?.errorDetail || 'Terjadi kesalahan, silahkan coba lagi',
        type: 'error',
      });
    },
    onSuccess: (data, variables) => {
      const changeAfter = {
        hasFinancialDependency: variables.hasFinancialDependency,
        hasSharedDirectors: variables.hasSharedDirectors,
        isControlledBySameParty: variables.isControlledBySameParty,
        isControllingOther: variables.isControllingOther,
        isGuarantorForOther: variables.isGuarantorForOther,
        remark: variables.remark,
      };

      const changeBefore = variables.initialValues ? {
        hasFinancialDependency: variables.initialValues.hasFinancialDependency,
        hasSharedDirectors: variables.initialValues.hasSharedDirectors,
        isControlledBySameParty: variables.initialValues.isControlledBySameParty,
        isControllingOther: variables.initialValues.isControllingOther,
        isGuarantorForOther: variables.initialValues.isGuarantorForOther,
        remark: variables.initialValues.remark,
      } : {};

      recordActivity({
        activity: ActivityType.EDIT,
        bucketProcessId: variables.bucketProcessId || variables.groupId || '',
        changeAfter: JSON.stringify(changeAfter),
        changeBefore: JSON.stringify(changeBefore),
        menuCode: 'maintenance-group',
        module: TypeModule.MAINTENANCE_GROUP,
        process: TypeProcess.MAINTENANCE_GROUP,
        remarks: `successfully edited member information for debtor ${variables.debtorCode}`,
      });

      showNiceModalV2({
        onClose: () => {
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({
            queryKey: ['member-information', {
              bucketProcessId: variables.bucketProcessId,
              debtorCode: variables.debtorCode,
              groupId: variables.groupId,
            }],
          });
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const showRemarkPopup = (formData: any) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        const payload = {
          bucketProcessId: formData.bucketProcessId,
          checkBox1: formData.checkBox1,
          checkBox2: formData.checkBox2,
          checkBox3: formData.checkBox3,
          checkBox4: formData.checkBox4,
          checkBox5: formData.checkBox5,
          debtorCode: formData.debtorCode,
          groupId: formData.groupId,
          hasFinancialDependency: formData.hasFinancialDependency,
          hasSharedDirectors: formData.hasSharedDirectors,
          initialValues: formData.initialValues,
          isControlledBySameParty: formData.isControlledBySameParty,
          isControllingOther: formData.isControllingOther,
          isGuarantorForOther: formData.isGuarantorForOther,
          remark: comment || '',
        };

        saveMemberInfo(payload);
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  return {
    isSaving,
    saveMemberInfo,
    showRemarkPopup,
  };
};

export default useSaveMemberInformation;
