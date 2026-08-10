import { useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useAddGroupMember from '../../../hooks/Member/useAddGroupMember';
import useEditGroupMember from '../../../hooks/Member/useEditGroupMember';
import { modal } from '../../Detail.constants';

import type { ModalFormMemberProps } from './ModalFormMember.types';


const validationSchema = Yup.object().shape({
  cif: Yup.string().nullable(),
  gamName: Yup.string().nullable(),
  hasFinancialDependency: Yup.boolean().nullable(),
  hasSharedDirectors: Yup.boolean().nullable(),
  isControlledBySameParty: Yup.boolean().nullable(),
  isControllingOther: Yup.boolean().nullable(),
  isGuarantorForOther: Yup.boolean().nullable(),
  name: Yup.string().nullable(),
  remark: Yup.string().nullable(),
  sector: Yup.string().nullable(),
});

const useModalFormMember = ({
  groupId,
  data,
  type = 'edit',
}: ModalFormMemberProps) => {
  const theme = useTheme();
  const { recordActivity } = useRecordLog();
  const { debtorId, processId } = useIdentity();
  const modalId = modal.FORM_MEMBER_GROUP;
  const { visible } = useModal(modalId);

  // Dropdown data
  const { data: sectorDropdownList } = useGetParameterList('sector');

  //Get Customer Data
  const {
    data: debtorData,
  } = useGetDetailMasterDebtor({
    debtorId: debtorId,
  });

  //Save Member Data
  const { isPending: isSaveLoading, mutate: saveMember } = useAddGroupMember({
    onSuccess: () => {
      recordActivity({
        activity: type === 'edit' ? ActivityType.EDIT : ActivityType.ADD,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify(lastSavedPayload),
        changeBefore: type === 'edit' ? JSON.stringify(debtorDetail) : '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: `successfully ${type === 'edit' ? 'edited' : 'added'} group member`,
      });

      closeNiceModal(modalId);
      showNiceModal('success', 'Data berhasil disimpan');
    },
  });

  const [debtorDetail, setDebtorDetail] = useState<any>({
    cif: data?.cif,
    gamName: data?.gamName,
    hasFinancialDependency: (data as any)?.hasFinancialDependency || false,
    hasSharedDirectors: (data as any)?.hasSharedDirectors || false,
    id: data?.debtorId,
    isControlledBySameParty: (data as any)?.isControlledBySameParty || false,
    isControllingOther: (data as any)?.isControllingOther || false,
    isGuarantorForOther: (data as any)?.isGuarantorForOther || false,
    name: data?.name,
    remark: data?.remark,
    sector: data?.sector,
  });

  const [initialFormValues, setInitialFormValues] = useState<any>({});
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);


  useEffect(() => {
    if (!data) {
      const newDebtorDetail = {
        cif: debtorData?.cif,
        gamName: debtorData?.gamName,
        hasFinancialDependency: (debtorData as any)?.hasFinancialDependency || false,
        hasSharedDirectors: (debtorData as any)?.hasSharedDirectors || false,
        id: debtorData?.debtorId,
        isControlledBySameParty: (debtorData as any)?.isControlledBySameParty || false,
        isControllingOther: (debtorData as any)?.isControllingOther || false,
        isGuarantorForOther: (debtorData as any)?.isGuarantorForOther || false,
        name: debtorData?.name,
        remark: debtorData?.remark,
        sector: debtorData?.sector,
      };
      setDebtorDetail(newDebtorDetail);
      setInitialFormValues(newDebtorDetail);
    } else {
      setInitialFormValues(debtorDetail);
    }
  }, [debtorData, isSaveLoading]);

  const onSubmitHandler = (data: any) => {
    const payload = {
      bucketProcessId: processId,
      debtorId: debtorId,
      groupCode: groupId,
      hasFinancialDependency: data?.hasFinancialDependency,
      hasSharedDirectors: data?.hasSharedDirectors,
      isControlledBySameParty: data?.isControlledBySameParty,
      isControllingOther: data?.isControllingOther,
      isGuarantorForOther: data?.isGuarantorForOther,
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remark: data?.remark,
      sector: data?.sector,
    };
    setLastSavedPayload(payload);
    saveMember([payload as any]);
    setIsFormDirty(false);
    setInitialFormValues(data);
  };

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: debtorDetail,
    mode: 'onTouched',
    resolver: yupResolver(validationSchema),
  });

  // Watch form values to detect changes
  const watchedValues = watch();

  useEffect(() => {
    reset(debtorDetail);
  }, [debtorDetail]);

  // Check for form changes
  useEffect(() => {
    if (Object.keys(initialFormValues).length > 0) {
      const currentValues = {
        hasFinancialDependency: !!watchedValues.hasFinancialDependency,
        hasSharedDirectors: !!watchedValues.hasSharedDirectors,
        isControlledBySameParty: !!watchedValues.isControlledBySameParty,
        isControllingOther: !!watchedValues.isControllingOther,
        isGuarantorForOther: !!watchedValues.isGuarantorForOther,
        remark: watchedValues.remark || '',
      };

      const hasChanges = Object.keys(currentValues).some(
        (key) => currentValues[key] !== initialFormValues[key]
      );

      setIsFormDirty(hasChanges);
    }
  }, [watchedValues, initialFormValues]);

  const handleCloseModalWarning = () => {
    showNiceModal('confirm', 'Data belum disimpan, yakin ingin keluar?', () => closeNiceModal(modalId), 'Tidak', 'Ya');
  };

  return {
    control,
    handleCloseModalWarning,
    handleSubmit,
    initialFormValues,
    isFormDirty,
    isSaveLoading,
    modal,
    modalId,
    onSubmitHandler,
    sectorDropdownList,
    setIsFormDirty,
    theme,
    visible,
  };
};

export default useModalFormMember;
