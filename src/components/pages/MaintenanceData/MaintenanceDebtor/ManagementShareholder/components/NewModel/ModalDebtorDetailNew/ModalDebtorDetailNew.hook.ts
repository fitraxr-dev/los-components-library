import { useEffect, useState } from 'react';

import useGetDebtorById from '../../../hooks/useGetDebtorById';


const useModalDebtorDetailNew = ({ id }: { id: string }) => {
  const [cellDataWithDetail, setCellDataWithDetail] = useState([
    { label: 'Nama', sx: { gridColumn: '1 / span 2' }, value: null },
    { label: 'NPWP', value: null },
    { label: 'NPWP Document', url: null, value: null }
  ]);

  const { data, isSuccess } = useGetDebtorById({ debtorId: id });

  useEffect(() => {
    if (isSuccess && data) {

      const {
        name,
        npwp,
        npwpUrl,
        npwpFileName,
      } = data;


      setCellDataWithDetail([
        { label: 'Nama', sx: { gridColumn: '1 / span 2' }, value: name },
        { label: 'NPWP', value: npwp === null ? '-' : npwp },
        { label: 'NPWP Document', url: npwpUrl, value: npwpFileName === null ? '-' : npwpFileName }
      ]);
    }
  }, [data, isSuccess]);

  return {
    cellDataWithDetail,
  };
};

export default useModalDebtorDetailNew;
