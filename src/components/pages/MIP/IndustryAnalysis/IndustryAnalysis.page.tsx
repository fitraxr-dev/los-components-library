'use client';
import { useContext, useState } from 'react';

import { TypeProcess, TypeModule } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useIndustryAnalysis } from './IndustryAnalysis.hook';


const IndustryAnalysisPage = () => {
  const { viewOnly } = useViewOnly();
  const [state, _] = useApp();
  const [overviewContainer, setOverviewContainer] = useState(null);
  const [analysisContainer, setAnalysisContainer] = useState(null);

  const {
    isStaff,
    isAnalyst,
    activeTab,
    handleChangeTab,
    overviewDetail,
    isFetchOverviewLoading,
    isSaveOverviewLoading,
    analysisDetail,
    isFetchAnalysisLoading,
    isSaveAnalysisLoading,
    setShouldGoNext,
    handleSaveOverview,
    handleSaveAnalysis,
    handleSubmit,
    isSubmitLoading,
    buttons,
    superior,
    isActionSubmit,
    isTl,
  } = useIndustryAnalysis();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Analisis Industry & Overview" />
      <TableDebtorInformation module={state.pages.mipModule} process={state.pages.mipProcess} />

      <Tabs
        activeTab={activeTab}
        onChange={handleChangeTab}
        items={[
          { label: 'Analisis Industry & Overview' },
          { label: 'Analisis Industry & Overview - Keuangan' },
        ]}
      />

      <TabItem
        activeValue={activeTab}
        value={0}
      >
        <WordEditor
          isReadOnly={viewOnly || !isStaff}
          container={overviewContainer}
          setContainer={setOverviewContainer}
          isLoading={isFetchOverviewLoading || isSaveOverviewLoading}
          initialValue={overviewDetail?.description}
          onSave={(blob) => {
            setShouldGoNext(false);
            handleSaveOverview(blob);
          }}
        />
      </TabItem>

      <TabItem
        activeValue={activeTab}
        value={1}
      >
        <WordEditor
          isReadOnly={viewOnly || !isAnalyst}
          container={analysisContainer}
          setContainer={setAnalysisContainer}
          isLoading={isFetchAnalysisLoading || isSaveAnalysisLoading}
          initialValue={analysisDetail?.description}
          onSave={(blob) => {
            setShouldGoNext(false);
            handleSaveAnalysis(blob);
          }}
        />
      </TabItem>

      <RowWrapper sx={{ gap: 3, justifyContent: 'end', py: 3 }}>

        {!isAnalyst &&
        <Button
          isLoading={isSaveOverviewLoading || isSaveOverviewLoading}
          onClick={() => {
            setShouldGoNext(true);

            activeTab === 0
              ? convertToDocx(overviewContainer)
                .then(handleSaveOverview)
              : convertToDocx(analysisContainer)
                .then(handleSaveAnalysis);
          }}
        >
          {
            (viewOnly || (activeTab === 0 && !isStaff) || (activeTab === 1 && !isAnalyst))
              ? 'Next'
              : 'Save'
          }
        </Button>
        }

        {isAnalyst &&
        <>
          <Button
            isLoading={isSaveOverviewLoading || isSaveOverviewLoading}
            onClick={() => {
              activeTab === 0
                ? convertToDocx(overviewContainer)
                  .then(handleSaveOverview)
                : convertToDocx(analysisContainer)
                  .then(handleSaveAnalysis);
            }}
          >
            {
              (viewOnly || (activeTab === 0 && !isStaff) || (activeTab === 1 && !isAnalyst))
                ? 'Next'
                : 'Save'
            }
          </Button>

          {buttons['RETURN_TO_ANALYST'] && activeTab === 1 &&
            <Button
              isLoading={isSubmitLoading}
              disabled={viewOnly}
              onClick={() => {
                handleSubmit({ action: 'RETURN_TO_ANALYST' });
              }}
              color="info"
            >
              Return to Analyst
            </Button>
          }

          {buttons['SUBMIT'] && isActionSubmit && activeTab === 1 &&
          <Button
            isLoading={isSubmitLoading}
            disabled={viewOnly}
            onClick={() => {
              handleSubmit({ action: buttons['SUBMIT'] });
            }}
            color="success"
          >
            Submit
          </Button>
          }

          {buttons['APPROVE'] && isActionSubmit && activeTab === 1 &&
          <Button
            isLoading={isSubmitLoading}
            disabled={viewOnly}
            onClick={() => {
              handleSubmit({ action: buttons['APPROVE'] });
            }}
            color="success"
          >
            Approve
          </Button>
          }

          {buttons['COMPLETE'] && !isActionSubmit && activeTab === 1 &&
          <Button
            isLoading={isSubmitLoading}
            disabled={viewOnly}
            onClick={() => {
              handleSubmit({ action: buttons['COMPLETE'] });
            }}
            color="success"
          >
            {!isTl ? 'Submit' : 'Approve'}
          </Button>
          }

        </>
        }

      </RowWrapper>
    </ColumnWrapper>
  );
};

export default IndustryAnalysisPage;
