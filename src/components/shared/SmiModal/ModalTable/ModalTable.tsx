import Table from '@/components/shared/Table';

import useModalTableHook from './ModalTable.hook';

import type { ModalTableProps } from './ModalTable.types';


const ModalTable = (props: ModalTableProps) => {
  const { setItemPerPage, setNoPage, page, isLoading } = props;
  const {
    tableHeaderDebtor,
    tableData,
  } = useModalTableHook(props);

  return (
    <>
      <Table
        isLoading={isLoading}
        tableHeader={tableHeaderDebtor}
        tableData={tableData}
        pageSize={page?.itemPerPage}
        currentPage={page?.noPage}
        handlePageChange={setNoPage}
        totalPage={page?.totalPage}
        onPageSizeChange={setItemPerPage}
      />
    </>
  );
};

export default ModalTable;
