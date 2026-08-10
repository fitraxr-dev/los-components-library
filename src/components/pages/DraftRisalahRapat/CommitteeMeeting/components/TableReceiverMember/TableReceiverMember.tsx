import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useGetReceiverMember from '../../hooks/useGetReceiverMember';

import { tableHeader } from './TableReceiverMember.constant';


const TableReceiverMember = () => {
  const { processId } = useIdentity();

  const { data, isLoading, isFetching } = useGetReceiverMember({
    bucketProcessId: processId,
    module: TypeModule.RISALAH_RAPAT,
    process: TypeProcess.RISALAH_RAPAT,
  });

  return (
    <SectionTitle title="Penerima Kuasa" isOpen>
      <Table
        tableHeader={tableHeader}
        tableData={data || []}
        isLoading={isLoading || isFetching}
      />
    </SectionTitle>
  );
};

export default TableReceiverMember;
