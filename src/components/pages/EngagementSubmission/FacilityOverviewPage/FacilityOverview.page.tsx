'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import FacilityOverview from '@/components/shared/SmiSection/PK/FacilityOverview';


const FacilityOverviewPage = () => {
  return (
    <>
      <FacilityOverview
        process={TypeProcess.ENGAGEMENT_AGREEMENT}
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        showTableShariaLimit={true}
        isPK={true}
      />
    </>
  );
};

export default FacilityOverviewPage;
