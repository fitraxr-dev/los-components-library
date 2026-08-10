import BaseContainer from '@/components/shared/BaseContainer';
import Search from '@/components/shared/Input/components/Search';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import { tableHeaderList } from './TableRefinaDocument.constants';
import useTableRefinaDocument from './TableRefinaDocument.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const TableRefinaDocument = ({ title, ...props }: SmiComponentProps) => {
  const {
    refinaDocumentLoading,
    refinaDocumentList,
    refinaDocumentPage,
    noPage,
    setNoPage,
    setItemPerPage,
    handleAddDocument,
    handlePreviewRefinaDocument,
    isBusinessDivision,
    isPreviewLoading,
    readOnly,
    viewOnly,
    filter,
    setFilter,
    filterContentList,
    filterDropdownList,
  } = useTableRefinaDocument(props);

  const tableHeaderDocument: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          apiDownload: 'bucket.refina.watermarkedDocument',
          iconName: 'preview-document',
          isDisabled: refinaDocumentLoading || isPreviewLoading,
          isPreview: true,
          // isUseOnclick: true,
          // onClick: (data) => handlePreviewRefinaDocument(data),
        },
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    },
  ];

  return (
    <SectionTitle title="Document Refina" isOpen>
      <Search
        value={filter}
        isDebounced
        hasFilter
        onChange={setFilter}
        placeholder="Pencarian..."
        dropdownList={filterDropdownList}
        contentList={filterContentList}
      />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeaderDocument}
          tableData={refinaDocumentList}
          isLoading={refinaDocumentLoading}
          currentPage={noPage}
          totalPage={refinaDocumentPage?.totalPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
        />
      </BaseContainer>
    </SectionTitle>
  );
};

export default TableRefinaDocument;
