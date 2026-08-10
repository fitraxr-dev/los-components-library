import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableDocumentRefina = () => {

  const tableHeader: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: {
        width: '4vw',
      },
      type: 'index',
    },
    {
      key: 'fileName',
      label: 'Nama File',
      sx: {
        width: '30vw',
      },
    },
    {
      key: 'fileLink',
      label: 'Link File',
      sx: {
        width: '30vw',
      },
    },
  ];

  const documentRefinaList = [
    {
      fileLink: '-',
      fileName: '-',
    },
    {
      fileLink: '-',
      fileName: '-',
    }
  ];

  return {
    documentRefinaList,
    tableHeader,
  };
};

export default useTableDocumentRefina;
