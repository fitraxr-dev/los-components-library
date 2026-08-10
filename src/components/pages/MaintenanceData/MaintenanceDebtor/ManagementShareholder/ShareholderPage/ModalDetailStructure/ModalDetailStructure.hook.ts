import { useEffect, useMemo } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';


import { TypeModule } from '@/enums/Module';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';


import { modal as MODAL } from '../ShareHolder.constant';

import { ShareHolderSchema } from './ModalDetailStructure.constants';

import type { ModalShareholderProps } from './ModalDetailStructure.types';


const useModalDetailStructure = (props: ModalShareholderProps) => {
  const modalId = MODAL.STRUCTURE_MODAL;
  const modal = useModal(modalId);

  const { control, handleSubmit, formState, reset, watch } = useForm(
    {
      defaultValues: {
        beneficialOwner: '',
        informationSource: '',
        isParentLevel: false,
        level: 0,
        module: '',
        name: '',
        percentage: '',
        prefix: '',
        shareholder: '',
        shares: '',
        suffix: '',
        type: '',
        typeLabel: '',
      },
      mode: 'onChange',
      reValidateMode: 'onChange',
      resolver: yupResolver(ShareHolderSchema),
    }
  );


  useEffect(() => {
    const defaultVal = {
      beneficialOwner: props.beneficialOwner,
      informationSource: props.informationSource,
      isParentLevel: props.isParentLevel,
      level: props.level,
      module: TypeModule.APU_PPT,
      name: props.name,
      percentage: props.percentage,
      prefix: props.prefix,
      shareholder: props.shareholder,
      shares: props.shares,
      suffix: props.suffix,
      type: props.type,
      typeLabel: props.typeLabel,
    };
    reset(defaultVal as any);
  }, []);

  const { data: institutionTypeList } = useGetParameterList('institutionType');


  const fieldList = [
    'beneficialOwner',
    'id',
    'percentage',
    'shareholderName',
    'shares',
    'type',
  ];

  // const shareHolderList = shareHolder?.contents?.map((res) => ({
  //   label: res?.name,
  //   value: res?.id,
  // })) || [];

  const isIndividualType = useMemo(() => {
    return (watch('type') === 'INDIVIDUAL') ? true : false;
  }, [watch('type')]);


  return {
    control,
    fieldList,
    formState,
    handleSubmit,
    institutionTypeList,
    isIndividualType,
    modal,
    modalId,
    // shareHolderList,
  };
};

export default useModalDetailStructure;
