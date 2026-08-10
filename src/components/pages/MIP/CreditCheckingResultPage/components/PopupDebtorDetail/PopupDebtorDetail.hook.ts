import { useEffect, useState } from 'react';

import useIdentity from '@/hooks/useIdentity';

import useGetDebtorDetailById from '@/components/pages/Pipeline/PipelineCreationPage/hooks/useGetDebtorDetailById';


export const usePopupManagementDetail = (id: string) => {
  const { processId } = useIdentity();

  const [cellDataWithDetail, setCellDataWithDetail] = useState([]);

  const { data, isSuccess } = useGetDebtorDetailById({
    bucketProcessId: processId,
    debtorId: id,
  });

  useEffect(() => {
    if (isSuccess && data) {

      const name = data.npwpFileName;
      const pattern = /^(.+)\.([a-zA-Z]+)$/;
      let match = null, filename = null, fileExtension = null;

      if (name)
      {
        match = name.match(pattern);
        filename = match[1];
        fileExtension = match[2];
      }

      const npwpObj = data.npwpFileName ? {
        documentType: 'NPWP',
        extension: fileExtension,
        name: filename + '.',
        url: data.npwpUrl,
      } : null;

      setCellDataWithDetail([{ label: 'Nama', value: data?.name },
        { label: 'NPWP', value: data?.npwp },
        { label: 'NPWP Document', url: npwpObj?.url, value: data.npwpFileName ? (npwpObj?.name + npwpObj?.extension) : null,
        }]);
    }
  }, [data, isSuccess]);

  return { cellDataWithDetail };
};
