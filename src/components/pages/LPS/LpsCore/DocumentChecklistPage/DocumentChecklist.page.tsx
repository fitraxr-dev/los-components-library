'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import { useLpsCoreContext } from '@/components/layouts/LpsLayoutCore/LpsLayoutCore.context';

import DocumentChecklist from '../../components/DocumentChecklist';

import useDocumentChecklist from './DocumentChecklist.hook';


const DocumentChecklistPage = () => {
  const { bucketId, handleButton, sortedObject } = useDocumentChecklist();
  const { setIsDocumentSelected } = useLpsCoreContext();

  const renderActionButtons = () => {
    return sortedObject ? Object.entries(sortedObject).map((dt: [string, string]) => {
      return (handleButton(dt[0], dt[1]));
    }) : null;
  };

  return (
    <DocumentChecklist
      id={bucketId}
      module={TypeModule.LPS}
      process={TypeProcess.LPS_BAST}
      onSelectedChecked={setIsDocumentSelected}
      lpsType="core"
      renderAction={renderActionButtons}
    />
  );
};

export default DocumentChecklistPage;
