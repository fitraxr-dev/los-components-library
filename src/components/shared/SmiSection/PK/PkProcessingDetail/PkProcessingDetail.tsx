'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableValidation from '@/components/shared/SmiTable/TableValidation';
import Tabs, { TabItem } from '@/components/shared/Tabs';

import AssumedQualifications from '../components/AssumedQualifications/AssumedQualifications';
import DraftMemo from '../components/DraftMemo';
import PkProcessingType from '../components/PkProcessingType';
import TableMappingFacility from '../components/TableMappingFacility';


import { tab } from './PkProcessingDetail.constants';
import usePkProcessingDetail from './PkProcessingDetail.hook';

import type { PkProcessingProps } from '../PK.types';


const PkProcessingDetail = ({ isLegalSigning = false, ...props }: PkProcessingProps) => {
  const {
    activeTab,
    handleChangeTab,
    handleNextTabPk,
    handleNextAssumsi,
    handleNextDraftMemo,
    childId,
    LIST_TAB,
    actionBtn,
    isAskForInfoPK,
    isCompletedPK,
    pkStatus,
  } = usePkProcessingDetail(isLegalSigning);
  return (
    <ColumnWrapper gap={3}>
      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => handleChangeTab(val)}
        items={LIST_TAB}
      />
      <TabItem activeValue={activeTab} value={tab.TAB_1}>
        <TableMappingFacility
          // props PkTabsProps
          handleNextTab={handleNextTabPk}
          isLegalSigning={isLegalSigning}
          isViewOnly={(!isLegalSigning && isCompletedPK)}
          pkStatus={pkStatus}
        />
      </TabItem>
      <TabItem activeValue={activeTab} value={tab.TAB_2}>
        <PkProcessingType
          // {...props} = {module, process}
          {...props}
          handleNextTab={handleNextAssumsi}
          isAskForInfo={isAskForInfoPK}
          isLegalSigning={isLegalSigning}
        />
      </TabItem>
      <TabItem activeValue={activeTab} value={tab.TAB_3}>
        {isLegalSigning ?
          <AssumedQualifications
            // props PkTabsProps
            actionBtn={actionBtn}
            handleNextTab={handleNextDraftMemo}
          />
          : <TableValidation
            module={TypeModule.ENGAGEMENT_AGREEMENT}
            process={TypeProcess.PROCESSING_TYPE_PK}
            id={childId}
          />}
      </TabItem>
      <TabItem activeValue={activeTab} value={tab.TAB_4}>
        {isLegalSigning ?
          <DraftMemo />
          :
          <TableValidation
            module={TypeModule.ENGAGEMENT_AGREEMENT}
            process={TypeProcess.PROCESSING_TYPE_PK}
            id={childId}
          />
        }

      </TabItem>
      <TabItem activeValue={activeTab} value={tab.TAB_5}>
        <TableValidation
          module={TypeModule.ENGAGEMENT_AGREEMENT}
          process={TypeProcess.PROCESSING_TYPE_PK}
          id={childId}
        />
      </TabItem>
    </ColumnWrapper>
  );
};

export default PkProcessingDetail;
