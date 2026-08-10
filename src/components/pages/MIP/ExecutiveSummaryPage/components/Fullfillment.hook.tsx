'use client';

import { useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { mip } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';

import useGetFulfillmentDetail from '../hooks/useGetFulfillmentDetail';
import useSaveFullfillmentLoanRequirement from '../hooks/useSaveFullfillmentLoanRequirement';


const useFullfillmentForm = () => {
  const [state] = useApp();
  const router = useCustomRouter();
  const { processId, id } = useParams();
  const [container, setContainer] = useState(undefined);

  const { data: fulfillmentData } = useGetFulfillmentDetail({
    id: Number(id),
  });

  const validationSchema = yup.object({
    category: yup.string().required().nonNullable(),
    fullfillment: yup.string().required().nonNullable(),
    requirementType: yup.string().nullable(),
    requirements: yup.string().required().nonNullable(),
  });

  const { watch, control, handleSubmit, reset, setValue, formState } = useForm({
    defaultValues: {
      category: '',
      fullfillment: '',
      requirementType: '',
      requirements: '',
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset(
      {
        category: fulfillmentData?.category,
        fullfillment: fulfillmentData?.fulfillment,
        requirementType: fulfillmentData?.termType,
        requirements: fulfillmentData?.term,
      }
    );
  }, [fulfillmentData]);

  useEffect(() => {
    if (formState.isDirty) {
      setValue('requirements', watch('requirementType'));
    }
  }, [watch('requirementType')]);

  const { data: listTermType } = useGetParameterList ('mipTermType', { label: 'key', value: 'value1' });
  const { data: listCategory } = useGetParameterList ('mipCategory', { label: 'key', value: 'value1' });
  const { data: listFullfillment } = useGetParameterList ('mipFulfillment', { label: 'value1', value: 'key' });


  const { isPending: isSaveLoading, mutate: saveFullfillmentLoanRequirement } = useSaveFullfillmentLoanRequirement({
    onSuccess: () => {
      showNiceModalV2({ onClose: () => {
        router.push(replacePath(mip.EXECUTIVE_OVERVIEW_PAGE, { processId }));
      }, type: 'success' });
    },
  });

  const handleSave = async () => {
    const termCondition = await convertToDocx(container);
    saveFullfillmentLoanRequirement({
      bucketProcessId: processId as string,
      category: watch().category,
      fulfillment: watch().fullfillment,
      id: Number(id) || '',
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
      term: watch().requirements,
      termCondition: termCondition,
      termType: watch().requirementType,
    });
  };

  return {
    container,
    control,
    fulfillmentData,
    handleSave,
    handleSubmit,
    listCategory,
    listFullfillment,
    listTermType,
    reset,
    router,
    setContainer,
    setValue,
    watch,
  };
};

export default useFullfillmentForm;
