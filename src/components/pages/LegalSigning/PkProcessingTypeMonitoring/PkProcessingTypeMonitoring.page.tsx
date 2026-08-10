'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import PkProcessingTypeMonitoring from '@/components/shared/SmiSection/PK/PkProcessingTypeMonitoring';


const PkProcessingTypeMonitoringPage = () => {

  return (
    <PkProcessingTypeMonitoring
      module={TypeModule.ENGAGEMENT_AGREEMENT}
      process={TypeProcess.LEGAL_SIGNING}
      isLegalSigning
    />
  );
};

export default PkProcessingTypeMonitoringPage;
