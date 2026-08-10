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
import useCustomRouter from '@/hooks/useCustomRouter';

import useGetStructureDetail from '../hooks/useGetStructureDetail';
import useSaveFinancingStructure from '../hooks/useSaveStructureDetail';


const useFinancingStructureForm = () => {
  const router = useCustomRouter();
  const { processId, id } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [container, setContainer] = useState(undefined);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    description: true,
  });

  const validationSchema = yup.object({
    title: yup.string().required('Title is required').nonNullable(),
  });

  const { data: structureDetailData } = useGetStructureDetail({
    id: Number(id),
  });

  const { isPending: isSaveLoading, mutate: saveFinancingStructure } = useSaveFinancingStructure({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({ onClose: () => {
        router.push(replacePath(mup.PROPOSAL_PAGE, { processId }));
      }, type: 'success' });
    },
  });

  const { watch, control, handleSubmit, reset, setValue, formState: { isValid, isDirty } } = useForm({
    defaultValues: useMemo(() => {
      return {
        title: structureDetailData?.title,
      };
    }, [structureDetailData]),
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset(
      {
        title: structureDetailData?.title,
      }
    );
  }, [structureDetailData]);

  const handleSave = async (data) => {
    const description = await convertToDocx(container);
    saveFinancingStructure({
      bucketProcessId: processId as string,
      description: description,
      financingType: 'MUNICIPAL_FINANCING',
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      title: data.title,
      ...(id ? { id: Number(id) } : {}),
    });
  };
  const handleCancel = () => {
    router.push(replacePath(mup.PROPOSAL_PAGE, { processId }));
  };
  return {
    container,
    control,
    handleCancel,
    handleSave,
    handleSubmit,
    id,
    isDirty,
    isValid,
    isWordEditorEmpty,
    router,
    setContainer,
    setIsWordEditorEmpty,
    setValue,
    structureDetailData,
    watch,
  };
};

export default useFinancingStructureForm;
