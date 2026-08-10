'use client';


import { TypeModule, TypeProcess } from '@/enums/Module';

import ViewAllDocument from '../../components/ViewAllDocument';

import useViewAllDocLpsCore from './ViewAllDocument.hook';


const ViewAllDocumentPage = () => {
  const { bucketId } = useViewAllDocLpsCore();

  return (
    <ViewAllDocument
      module={TypeModule.LPS}
      process={TypeProcess.LPS_BAST}
      id={bucketId}
    />
  );
};

export default ViewAllDocumentPage;
