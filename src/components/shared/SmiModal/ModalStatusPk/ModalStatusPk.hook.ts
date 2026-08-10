import useGetListProcessingType from './hooks/useGetListProcessingType';

import type { ModalStatusPkProps } from './ModalStatusPk.types';


const useModalStatusPk = (props: ModalStatusPkProps) => {
  const { module, process, id } = props;
  const { data, isFetching: isLoading } = useGetListProcessingType(
    {
      bucketProcessId: id,
      module,
      process,
    }
  );

  const contentDataList = data?.contents?.map((process) => ({
    ...process,
    effectiveConditions: process.effectiveConditions ?? '-',
    pkName: process.pkName.split('-')[0] ?? '-',
    pkNumber: process.pkNumber ?? '-',
    signingConditions: process.signingConditions ?? '-',
  }));


  return {
    contentDataList,
    isLoading,
  };
};

export default useModalStatusPk;
