'use client';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';

import { ReportProvider, useReportContext } from './Report.context';
import UseReport from './Report.hook';


const ReportContent = ({ children }) => {
  const { renderDetailLayout, handleBack, isCreationPage } = UseReport();

  return (
    <>
      {renderDetailLayout ? <BackButton handleClick={handleBack} /> : null}
      {isCreationPage
        ? children
        : (
          <BaseContainer>
            {children}
          </BaseContainer>
        )}
    </>
  );
};

const ReportLayout = ({ children }) => {
  return (
    <ReportProvider>
      <ReportContent>
        {children}
      </ReportContent>
    </ReportProvider>
  );
};

export default ReportLayout;
