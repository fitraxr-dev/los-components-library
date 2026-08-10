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
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useRegionalFinance } from './RegionalFinance.hook';


const ProfilePage = () => {
  const { viewOnly } = useViewOnly();
  const [state, _] = useApp();

  const [container, setContainer] = useState(null);

  const {
    regionalFinanceDetail,
    isFetchLoading,
    isSaveLoading,
    setShouldGoNext,
    handleSave,
    isAutoSaveFetching,
    isAnalyst,
    handleSubmit,
    isSubmitLoading,
    buttons,
    superior,
    isActionSubmit,
    isTl,
  } = useRegionalFinance(container);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Keuangan Daerah" />

      <TableDebtorInformation module={state.pages.mipModule} process={state.pages.mipProcess} />

      <WordEditor
        isReadOnly={viewOnly}
        container={container}
        setContainer={setContainer}
        isLoading={isFetchLoading || isSaveLoading}
        initialValue={regionalFinanceDetail?.description}
        onSave={(blob) => {
          setShouldGoNext(false);
          handleSave(blob);
        }}
      />

      {!isAnalyst &&
        <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
          <Button
            disabled={isAutoSaveFetching}
            isLoading={isSaveLoading}
            onClick={() => {
              setShouldGoNext(true);
              convertToDocx(container).then(handleSave);
            }}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : viewOnly ? 'Next' : 'Save'}
          </Button>
        </RowWrapper>
      }

      {isAnalyst &&
        <>
          <RowWrapper sx={{ gap: 3, justifyContent: 'end', py: 3 }}>
            <Button
              disabled={isAutoSaveFetching}
              isLoading={isSaveLoading}
              onClick={() => {
                convertToDocx(container).then(handleSave);
              }}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : viewOnly ? 'Next' : 'Save'}
            </Button>

            {buttons['RETURN_TO_ANALYST'] &&
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

            {buttons['SUBMIT'] && isActionSubmit &&
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

            {buttons['APPROVE'] && isActionSubmit &&
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

            {buttons['COMPLETE'] && !isActionSubmit &&
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
          </RowWrapper>
        </>
      }
    </ColumnWrapper>
  );
};

export default ProfilePage;
