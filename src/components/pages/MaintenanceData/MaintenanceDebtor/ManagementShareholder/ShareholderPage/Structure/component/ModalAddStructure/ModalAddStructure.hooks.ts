import { useEffect } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';


import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useGetBucketDetail from '@/components/pages/MaintenanceData/MaintenanceDebtor/hooks/useGetBucketDetail';

import useSaveStructure from '../../../hooks/useSaveStructure';
import { modal as MODAL } from '../../Structure.constants';

import { structureSchema } from './ModalAddStructure.constant';


const useModalAddStructure = (props: any) => {
  const theme = useTheme();
  const modalId = MODAL.STRUCTURE_ADD_MODAL;
  const modal = useModal(modalId);
  const { processId } = useIdentity();
  const isEdit = props.action === 'edit';
  const { recordActivity } = useRecordLog();
  const {
    data: bucketDetail,
  } = useGetBucketDetail({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  });

  const {
    control,
    handleSubmit,
    formState,
    reset,
    watch,
    setValue,
    formState: { isValid, isDirty },
    getValues,
  } = useForm(
    {
      mode: 'onChange',
      reValidateMode: 'onChange',
      resolver: yupResolver(structureSchema),
    }
  );

  const { data: institutionTypeList, isSuccess: isSuccessInstitutionType } = useGetParameterList('institutionType', { label: 'value1', value: 'key' });

  useEffect(() => {
    if (props.action === 'edit') {
      reset(props);
    }
  }, [props, isSuccessInstitutionType, institutionTypeList]);


  const { mutate: saveStructure, isPending: isSaveLoading } = useSaveStructure({
    onError: () => {
      recordActivity({
        activity: ActivityType.EDIT,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(props),
        menuCode: 'maintenance-customer',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'gagal edit maintenance customer structure',
      });
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(modalId);
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(props),
        menuCode: 'maintenance-customer',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save maintenance customer structure',
      });
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSaveStructure = () => {
    const payload = {
      beneficialOwner: watch('beneficialOwner') || '',
      bucketProcessId: processId.includes('MAI') ? processId : '',
      debtorId: processId.includes('DEBT') ? processId : bucketDetail?.data?.content?.debtorId,
      informationSource: watch('informationSource') || '',
      level: isEdit ? watch('level') : props.level,
      module: TypeModule.MAINTENANCE_DATA,
      name: watch('name') || '',
      parentId: watch('parentId') || '',
      percentage: watch('percentage'),
      prefix: watch('prefix') || '',
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      shareholderId: watch('shareholderCode') || null,
      shares: watch('shares') || '',
      suffix: watch('suffix') || '',
      type: watch('type') || '',
    };

    saveStructure(payload);
  };

  return {
    control,
    formState,
    handleSaveStructure,
    handleSubmit,
    institutionTypeList,
    isDirty,
    isEdit,
    isSaveLoading,
    isSuccessInstitutionType,
    isValid,
    modal,
    modalId,
    theme,
    watch,
  };
};

export default useModalAddStructure;
