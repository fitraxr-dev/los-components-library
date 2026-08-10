'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import PkProcessingDetail from '@/components/shared/SmiSection/PK/PkProcessingDetail';


const PkProcessingDetailPage = () => {
  return (
    <PkProcessingDetail
      process={TypeProcess.PROCESSING_TYPE_PK}
      module={TypeModule.ENGAGEMENT_AGREEMENT}
    />
  );
};

export default PkProcessingDetailPage;
