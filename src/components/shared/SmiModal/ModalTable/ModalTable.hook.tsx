import { formatDate } from '@/helpers/date';
import { downloadFile, previewFile } from '@/helpers/utils';

import { TABLE_HEADER_CREDIT_CHECKING } from './ModalTable.constants';

import type { ModalTableProps } from './ModalTable.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useModalTableHook = (props: ModalTableProps) => {
  const { data } = props;


  const tableData = data?.map((item) => ({
    ...item,
    documentCategory: item.documentCategoryLabel ?? '-',
    documentDate: item.documentDate ? formatDate(new Date(item.documentDate)) : '-',
    documentGroup: item.documentGroupLabel ?? '-',
    documentNumber: item.documentNumber ? item.documentNumber : '-',
    documentType: item.documentTypeLabel ?? '-',
    documentUpload: item.fileName ?? '-',
  }));


  const tableHeaderDebtor: Array<TableHeader> = [
    ...TABLE_HEADER_CREDIT_CHECKING,
    {
      key: 'action',
      label: 'Action',
      options: [
        { iconName: 'preview-document', onClick: (data: any) => previewFile(data.document) },
        { iconName: 'download', onClick: (data: any) => downloadFile(data.document, data.fileName) },
      ],
      sx: {
        minWidth: '9vw',
      },
      type: 'action',
    },
  ];

  return {
    tableData,
    tableHeaderDebtor,
  };
};

export default useModalTableHook;
