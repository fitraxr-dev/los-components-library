'use client';

import { useContext, useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { mup } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';

import useGetFulfillmentDetail from '../hooks/useGetFulfillmentDetail';
import useSaveFullfillmentLoanRequirement from '../hooks/useSaveFullfillmentLoanRequirement';


const useFullfillmentForm = () => {
  const router = useCustomRouter();
  const { processId, id } = useParams();
  const [container, setContainer] = useState(undefined);
  const [firstRender, setFirstRender] = useState(true);
  const { setDirtyMsg } = useContext(DirtyContext);

  const { data: fulfillmentData } = useGetFulfillmentDetail({
    id: Number(id),
  });

  const validationSchema = yup.object({
    category: yup.string().required().nonNullable(),
    fullfillment: yup.string().required().nonNullable(),
    requirementType: yup.string().nullable(),
    requirements: yup.string().required().nonNullable(),
  });

  const { watch, control, handleSubmit, reset, setValue } = useForm({
    defaultValues: useMemo(() => {
      return {
        category: fulfillmentData?.category,
        fullfillment: fulfillmentData?.fulfillment,
        requirementType: fulfillmentData?.termType,
        requirements: fulfillmentData?.term,
      };
    }, [fulfillmentData]),
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
    setFirstRender(true);
  }, [fulfillmentData]);


  const { data: listTermType } = useGetParameterList ('muppTermType', { label: 'key', value: 'value1' });
  const { data: listCategory } = useGetParameterList ('muppCategory', { label: 'key', value: 'value1' });
  const { data: listFullfillment } = useGetParameterList ('muppFulfillment', { label: 'value1', value: 'key' });


  const { isPending: isSaveLoading, mutate: saveFullfillmentLoanRequirement } = useSaveFullfillmentLoanRequirement({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({ onClose: () => {
        router.push(replacePath(mup.EXECUTIVE_OVERVIEW_PAGE, { processId }));
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
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      term: watch().requirements,
      termCondition: termCondition,
      termType: watch().requirementType,
    });
  };

  return {
    container,
    control,
    firstRender,
    fulfillmentData,
    handleSave,
    handleSubmit,
    isSaveLoading,
    listCategory,
    listFullfillment,
    listTermType,
    reset,
    router,
    setContainer,
    setFirstRender,
    setValue,
    watch,
  };
};

export default useFullfillmentForm;
