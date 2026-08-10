import useViewOnly from '@/hooks/useViewOnly';

import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import useTableMeetingMember from './TableMeetingMember.hook';


const TableMeetingMember = () => {
  const { viewOnly } = useViewOnly();

  const {
    handleOpenMemberModal,
    isLoading,
    tableData,
    tableHeader,
  } = useTableMeetingMember();

  return (
    <SectionTitle title="Anggota Rapat" isMandatory isOpen>
      <Table
        tableHeader={tableHeader}
        tableData={tableData}
        isLoading={isLoading}
        footer={!viewOnly && <TableFooter onClick={() => handleOpenMemberModal(null, 'add')} />}
      />
    </SectionTitle>
  );
};

export default TableMeetingMember;
