import { useMemo, useState } from 'react';

import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useFormContext } from 'react-hook-form';

import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';


const useFormUploadDocument = () => {
  const theme = useTheme();
  const [state] = useApp();
  const { debiturName } = useIdentity();

  const [keywordDocumentGroup, setKeyworDocumentGroup] = useState('');
  const [keywordDocumentType, setKeyworDocumentType] = useState('');

  const { watch, formState, setValue, register, control } = useFormContext();
  const { data: documentGroupData, isFetching: isFetchDocumentGroupLoading } = useGetParameterDocumentGroup(
    {
      filter: {
        documentCategory: watch('documentCategory'),
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
      searchDetail: {
        key: 'documentTypeName',
        value: keywordDocumentGroup,
      },
    },
    { enabled: !!watch('documentCategory') }
  );

  const { data: documentTypeData, isFetching: isFetchDocumentTypeLoading } = useGetParameterDocumentType(
    {
      filter: {
        documentGroupCode: watch('documentGroup')?.id,
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
      searchDetail: {
        key: 'documentGroupName',
        value: keywordDocumentType,
      },
    },
    { enabled: !!watch('documentGroup')?.id }
  );

  const fullName = state?.userData?.user?.fullName;

  const documentName = useMemo(() => {
    const { documentType = '', documentNumber, documentDate } = watch();

    const documentTypeLabel = documentType?.label?.length === 0 || documentType?.label === undefined || documentType?.label === null ? '[Jenis Dokumen]' : documentType?.label;
    const documentNumberLabel = documentNumber?.length === 0 ? '[Dokumen Number]' : documentNumber;
    const documentDateLabel = documentDate ? dayjs(documentDate).format('DDMMYYYY') : '[Tanggal Dokumen]';
    return `${documentTypeLabel}_${debiturName}_${documentNumberLabel}_${documentDateLabel}`;
  }, [watch(), debiturName]);

  return {
    control,
    documentGroupData,
    documentName,
    documentTypeData,
    formState,
    fullName,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    register,
    setKeyworDocumentGroup,
    setKeyworDocumentType,
    setValue,
    theme,
    watch,
  };
};

export default useFormUploadDocument;
