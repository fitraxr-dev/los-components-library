import { useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useAddGroupMemberV2 from '../../../hooks/Member/useAddGroupMemberV2';
import useEditGroupMember from '../../../hooks/Member/useEditGroupMember';
import useGetDebtorGroupMemberDetail from '../../../hooks/Member/useGetDebtorGroupMemberDetail';
import { modal } from '../../Detail.constants';

import type { ModalFormMemberProps } from './ModalFormMember.types';


const validationSchema = Yup.object().shape({
  cif: Yup.string().nullable(),
  gamName: Yup.string().nullable(),
  hasFinancialDependency: Yup.boolean(),
  hasSharedDirectors: Yup.boolean(),
  isControlledBySameParty: Yup.boolean(),
  isControllingOther: Yup.boolean(),
  isGuarantorForOther: Yup.boolean(),
  name: Yup.string().nullable(),
  remark: Yup.string().nullable(),
  sector: Yup.string().nullable(),
});

const useModalFormMember = ({
  groupId,
  data,
  type = 'edit',
  isBarCreation = false,
}: ModalFormMemberProps) => {
  const theme = useTheme();
  const { debtorId }: {debtorId: string} = useParams();
  const modalId = modal.FORM_MEMBER_GROUP;
  const { visible } = useModal(modalId);
  const { processId } = useIdentity();

  // Dropdown data
  const { data: sectorDropdownList } = useGetParameterList('sector');

  //Get Customer Data
  const {
    data: debtorData,
  } = useGetDetailMasterDebtor({
    debtorId: debtorId,
  });

  //Get Checkbox
  const { data: debtorMemberDetail } = useGetDebtorGroupMemberDetail({
    bucketProcessId: processId,
    debtorCode: debtorId,
    groupId: groupId,
  });

  //Save Member Data
  const { isPending: isSaveLoading, mutate: saveMember } = useAddGroupMemberV2({
    onSuccess: () => { closeNiceModal(modalId); showNiceModal('success', 'Data berhasil disimpan'); },
  });

  //Update Member Data
  const { isPending: isUpdateLoading, mutate: updateMember } = useEditGroupMember({
    onSuccess: () => { closeNiceModal(modalId); showNiceModal('success', 'Data berhasil disimpan'); },
  });

  const [debtorDetail, setDebtorDetail] = useState({
    cif: data?.cif,
    gamName: data?.gamName,
    hasFinancialDependency: data?.hasFinancialDependency || false,
    hasSharedDirectors: data?.hasSharedDirectors || false,
    id: data?.debtorId,
    isControlledBySameParty: data?.isControlledBySameParty || false,
    isControllingOther: data.isControllingOther || false,
    isGuarantorForOther: data.isGuarantorForOther || false,
    name: data?.name,
    remark: data?.remark,
    sector: data?.infrastructureSector,
  });

  useEffect(() => {
    if (!data) {
      setDebtorDetail({
        cif: debtorData?.cif,
        gamName: debtorData?.gamName,
        hasFinancialDependency: debtorMemberDetail.content.hasFinancialDependency,
        hasSharedDirectors: debtorMemberDetail.content.hasSharedDirectors,
        id: debtorData?.debtorId,
        isControlledBySameParty: debtorMemberDetail.content.isControlledBySameParty,
        isControllingOther: debtorMemberDetail.content.isControllingOther,
        isGuarantorForOther: debtorMemberDetail.content.isGuarantorForOther,
        name: debtorData?.name,
        remark: debtorData?.remark,
        sector: debtorData?.infrastructureSector,
      });
    }
  }, [debtorData, isSaveLoading]);

  const onSubmitHandler = (data: any) => {
    saveMember([{
      bucketProcessId: processId,
      debtorId: debtorId,
      groupCode: groupId,
      hasFinancialDependency: data.hasFinancialDependency,
      hasSharedDirectors: data.hasSharedDirectors,
      isControlledBySameParty: data.isControlledBySameParty,
      isControllingOther: data.isControllingOther,
      isGuarantorForOther: data.isGuarantorForOther,
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
      remark: data?.remark,
      sector: data?.sector,
    }]);
  };

  const { control, handleSubmit, reset } = useForm({
    defaultValues: debtorDetail,
    mode: 'onTouched',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset(debtorDetail);
  }, [debtorDetail]);

  const handleCloseModalWarning = () => {
    if (isBarCreation) {
      showNiceModal('confirm', 'Data belum disimpan, yakin ingin keluar?', () => closeNiceModal(modalId), 'Tidak', 'Ya');
    } else {
      closeNiceModal(modalId);
    }
  };
  return {
    control,
    handleCloseModalWarning,
    handleSubmit,
    isSaveLoading,
    isUpdateLoading,
    modal,
    modalId,
    onSubmitHandler,
    sectorDropdownList,
    theme,
    visible,
  };
};

export default useModalFormMember;
