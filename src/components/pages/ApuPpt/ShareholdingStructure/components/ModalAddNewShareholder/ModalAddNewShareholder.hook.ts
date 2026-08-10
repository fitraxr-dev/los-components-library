import { useEffect, useMemo } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';


import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';

import useGetStructureListByLevel from '../../hooks/useGetStructureListByLevel';
import useSaveShareHoldingStructure from '../../hooks/useSaveShareHoldingStructure';
import { modal as MODAL } from '../../ShareholdingStructure.constant';

import { ShareHolderSchema } from './ModalAddNewShareholder.constants';

import type { ModalShareholderProps } from './ModalAddNewShareholder.types';
import type { ShareholderStructureRequestDto } from '@/services/openapi/mip-service';


const useModalAddNewShareholder = (props: ModalShareholderProps) => {
  const modalId = MODAL.SHAREHOLDER_MODAL;
  const modal = useModal(modalId);
  const { processId } = useIdentity();
  const { process } = useApuPpt();

  const {
    data: shareHolder,
  } = useGetStructureListByLevel({
    bucketProcessId: processId,
    level: props?.shareHolderLevel,
    module: TypeModule.APU_PPT,
    process,
  });

  const { control, handleSubmit, formState, reset, watch } = useForm(
    {
      defaultValues: {
        beneficialOwner: '',
        id: 0,
        informationSource: '',
        isParentLevel: false,
        level: 0,
        module: '',
        name: '',
        parentId: '',
        percentage: '',
        prefix: '',
        shares: '',
        suffix: '',
        type: '',
      },
      mode: 'onChange',
      reValidateMode: 'onChange',
      resolver: yupResolver(ShareHolderSchema),
    }
  );


  useEffect(() => {
    if (props?.action === 'edit') {
      const defaultVal = {
        beneficialOwner: props.beneficialOwner,
        id: props.id,
        informationSource: props.informationSource,
        isParentLevel: props.isParentLevel,
        level: props.level,
        module: TypeModule.APU_PPT,
        name: props.name,
        parentId: props?.parentId,
        percentage: props.percentage,
        prefix: props.prefix,
        shares: props.shares,
        suffix: props.suffix,
        type: props.type,
      };
      reset(defaultVal as any);
    } else {
      reset({
        beneficialOwner: '',
        id: 0,
        level: props?.level,
        module: TypeModule.APU_PPT,
        name: '',
        parentId: '',
        percentage: '',
        prefix: '',
        shares: '',
        suffix: '',
        type: '',

      });
    }
  }, [props?.action, reset]);

  const { data: institutionTypeList } = useGetParameterList('institutionType');


  const { mutate: saveShareholdingStructure } = useSaveShareHoldingStructure({
    onError(err) {
      showNiceModalV2({ title: `${err?.response?.data?.errorDetail}`, type: 'error' });

    },
    onSuccess() {
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(modalId);
        }, type: 'success',
      });
    },
  });

  const handleSaveShareholder = (body) => {
    const payload: ShareholderStructureRequestDto = {
      beneficialOwner: body.beneficialOwner,
      bucketProcessId: processId,
      id: body.id,
      informationSource: body.informationSource,
      level: body.level,
      module: TypeModule.APU_PPT,
      name: body.name,
      parentId: body.parentId,
      percentage: body.percentage,
      prefix: body.prefix,
      process,
      shares: body.shares,
      suffix: body.suffix,
      type: body.type,
    };

    saveShareholdingStructure({ submitRequestDto: payload });
  };

  const fieldList = [
    'beneficialOwner',
    'id',
    'percentage',
    'shareholderName',
    'shares',
    'type',
  ];

  const shareHolderList = shareHolder?.contents?.map((res) => ({
    label: res?.name,
    value: res?.id,
  })) || [];

  const isIndividualType = useMemo(() => {
    return (watch('type') === 'INDIVIDUAL') ? true : false;
  }, [watch('type')]);

  const watchedValues = watch();

  // Payload Autosave
  const autoSavePayload = useMemo(() => () => {
    return Promise.resolve({
      beneficialOwner: watchedValues.beneficialOwner,
      bucketProcessId: processId,
      id: watchedValues.id,
      informationSource: watchedValues.informationSource,
      level: watchedValues.level,
      module: TypeModule.APU_PPT,
      name: watchedValues.name,
      parentId: String(watchedValues.parentId),
      percentage: watchedValues.percentage,
      prefix: watchedValues.prefix,
      process,
      shares: watchedValues.shares,
      suffix: watchedValues.suffix,
      type: watchedValues.type,

    });
  }, [watchedValues, processId, process]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: props?.action === 'edit' && !!processId,
    payload: autoSavePayload,
    url: 'mip.apuppt.saveShareholder',
  });


  return {
    control,
    fieldList,
    formState,
    handleSaveShareholder,
    handleSubmit,
    institutionTypeList,
    isAutoSaveFetching,
    isIndividualType,
    modal,
    modalId,
    shareHolderList,
  };
};

export default useModalAddNewShareholder;
