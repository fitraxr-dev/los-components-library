'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import PkProcessingDetail from '@/components/shared/SmiSection/PK/PkProcessingDetail';


const PkProcessingDetailPage = () => {
  return (
    <PkProcessingDetail
      process={TypeProcess.PROCESSING_TYPE_PK}
      module={TypeModule.ENGAGEMENT_AGREEMENT}
      isLegalSigning
    />
  );
};

export default PkProcessingDetailPage;
