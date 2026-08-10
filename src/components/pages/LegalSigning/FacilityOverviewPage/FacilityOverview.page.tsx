'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import FacilityOverview from '@/components/shared/SmiSection/PK/FacilityOverview';


const FacilityOverviewPage = () => {
  return (
    <FacilityOverview
      module={TypeModule.ENGAGEMENT_AGREEMENT}
      process={TypeProcess.LEGAL_SIGNING}
      showTableShariaLimit={true}
      isLegalSigning={true}
    />
  );
};

export default FacilityOverviewPage;
