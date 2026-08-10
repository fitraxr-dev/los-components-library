import { useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';


import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetAllDirectorate from '@/hooks/services/useGetAllDirectorate';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useSearchAllUser from '@/hooks/services/useSearchUser';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';


import useGetUserCollaborationDetail from '../../../hooks/useGetUserCollaborationDetail';
import useSaveUserAssignToConsent from '../../../hooks/useSaveUserAssignToConsent';
import { MODAL } from '../../../RisalahRapatResult.contants';

import { validationScheme } from './SignatoryModal.consts';

import type { SignatoryModalProps } from './SignatoryModal.types';


const useSignatoryModal = (props: SignatoryModalProps) => {
  const { assignedTo, id } = props;

  const { processId } = useIdentity();
  const modalId = MODAL.SIGNATORY;
  const modal = useModal(modalId);
  const [hasSKU, setHasSKU] = useState<boolean>(false);
  const [directorat, setDirectorat] = useState('');

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
    setValue,
    resetField,
    watch,
    register,
  } = useForm({
    context: { hasSKU },
    mode: 'onChange',
    resolver: yupResolver(validationScheme),
  });

  const watchValue = watch();

  const { data: rolesData } = useGetParameterList('userCollaborationConsentRole', {
    id: 'key',
    label: 'value1',
  });

  const { data: divisionByDirectorate } = useSearchAllDivision({
    directorateCode: watch('directorForm.directorate.id'), value: '',
  },
  {
    enabled: !!watch('directorForm.directorate.id'),
  }
  );

  const { data: skuDivisionByDirectorate } = useSearchAllDivision({
    directorateCode: watch('skuForm.directorate.id'), value: '',
  },
  {
    enabled: !!watch('skuForm.directorate.id'),
  }
  );

  const divisionDropdownList = divisionByDirectorate?.contents?.map((item) => ({
    id: item.id,
    label: item.name,
  }));

  const skuDivisionDropdownList = skuDivisionByDirectorate?.contents?.map((item) => ({
    id: item.id,
    label: item.name,
  }));

  const { data: directoratData } = useGetAllDirectorate({ value: directorat });

  const directorateDropdownList = directoratData?.contents?.map((item) => ({
    id: item.id,
    label: item.name,
  }));


  const { data: userData } = useSearchAllUser({
    division: watch('directorForm.division.id'),
    value: watch('directorForm.data.fullName'),
  }, { enabled: id === null });

  const { data: userSKUData } = useSearchAllUser({
    division: watch('skuForm.division.id'),
    value: watch('skuForm.fullName') ? watch('skuForm.fullName') : '',
  });


  const { data: detailData, isLoading: detailDataIsLoading, isSuccess } = useGetUserCollaborationDetail({
    id,
  }, { enabled: id !== null });

  const { mutate, isPending } = useSaveUserAssignToConsent({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
      closeNiceModal(modalId);
    },
  });

  const directorDataName = userData?.contents?.map((data) => ({ ...data, id: data.userId, label: data.fullName }));

  const skuDataName = userSKUData?.contents?.map((data) => ({ ...data, id: data.userId, label: data.fullName }));

  useEffect(() => {

    if (detailData && !detailDataIsLoading) {
      setValue('directorForm.role', detailData.consentRoleLabel);
      setValue('directorForm.directorate.id', detailData.directorateId);
      setValue('directorForm.directorate.label', detailData.directorateLabel);
      setValue('directorForm.division.id', detailData.divisionId);
      setValue('directorForm.division.label', detailData.divisionLabel);
      setValue('directorForm.fullName', detailData.staffName);
      setValue('directorForm.data', {
        ...detailData, division: [{
          directorate: {
            directorateCode: detailData.directorateId,
            name: detailData.directorateLabel,
          },
        }],
        fullName: detailData.staffName,
        roleRefactor: { name: detailData.jobPositionLabel },
        userId: detailData.staffId?.toString(),
      });


      if (detailData.sku) {
        setHasSKU(true);
        setValue('skuForm.date', detailData.sku.skuDate);
        setValue('skuForm.number', detailData.sku.skuNo);
        setValue('skuForm.directorate.id', detailData.sku.directorateId);
        setValue('skuForm.directorate.label', detailData.sku.directorateLabel);
        setValue('skuForm.division.id', detailData.sku.divisionId);
        setValue('skuForm.division.label', detailData.sku.divisionLabel);
        setValue('skuForm.fullName', detailData.sku.staffName);
        setValue('skuForm.data', {
          ...detailData.sku, division: [{
            directorate: {
              directorateCode: detailData.sku.directorateId,
              name: detailData.sku.directorateLabel,
            },
          }],
          fullName: detailData.sku.staffName,
          roleRefactor: { name: detailData.sku.jobPositionLabel },
          userId: detailData.sku.staffId.toString(),
        });

      }
    }
  }, [detailData, detailDataIsLoading, isSuccess]);

  const handleSubmitCollaborator = (props) => {
    const { directorForm, skuForm } = props;

    mutate({
      assignedTo: assignedTo,
      bucketProcessId: processId,
      consentRole: directorForm.role.id,
      directorateId: directorForm.data.division[0].directorate.directorateCode,
      divisionId: directorForm.data.division[0].divisionCode,
      id: id,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
      sku: hasSKU ? {
        directorateId: skuForm.data.division[0].directorate.directorateCode,
        divisionId: skuForm.data.division[0].divisionCode,
        skuDate: skuForm.date,
        skuNo: skuForm.number,
        staffId: skuForm.data.userId,
      } : null,
      staffId: directorForm.data.userId,
    });
  };

  const handleChangeSKU = () => {
    setHasSKU(!hasSKU);
    resetField('skuForm');
  };

  // const handleChangeDirectorName = (val) => {
  //   setValue('directorForm.data', val);
  //   setValue('directorForm.fullName', val.label);
  // };

  return {
    control,
    detailDataIsLoading,
    directorDataName,
    directorateDropdownList,
    divisionDropdownList,
    errors,
    getValues,
    handleChangeSKU,
    handleSubmit,
    handleSubmitCollaborator,
    hasSKU,
    isValid,
    modal,
    modalId,
    register,
    resetField,
    rolesData,
    setDirectorat,
    setHasSKU,
    setValue,
    skuDataName,
    skuDivisionDropdownList,
    watch,
    watchValue,
  };
};

export default useSignatoryModal;
