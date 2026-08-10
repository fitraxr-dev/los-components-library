import React, { useState } from 'react';

import { roles } from '@/configs/constants';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import WordEditor from '@/components/shared/WordEditor';

import { useDPOP } from './DPOP.hook';


const useDPOPPage = (props) => {
  const bucket = useSpfpBucketContext();
  const [state] = useApp();
  const { stepper } = state;
  const { viewOnly } = useViewOnly();
  const [container, setContainer] = useState(null);
  const { activeTab = 0, onSaveExternal, saveType = 'response' } = props;

  const isDpop = (state.userData.user as any)?.accessManagementActive?.userDivision?.divisionCode?.includes('DPOP');
  const isMaker = state.currentRole.includes(roles.MAKER);
  const isChecker = state.currentRole.includes(roles.CHECKER);
  const isTaskForce = state.currentPosition.includes('TASK_FORCE');
  const isDti = (isMaker || isChecker || isTaskForce);
  const isSPFPDpop = bucket.process === TypeProcess.SPDP;


  // If activeTab is 1 (DPOP), enable fields (if not viewOnly and other conditions)
  // Otherwise, disable fields
  const isDpopTabActive = activeTab === 1;
  const shouldDisable = !isDpopTabActive || viewOnly || (!isDpop && !isDti) || (isDti && !isSPFPDpop) || stepper.from === 'DPOP_STAFF_ASSIGNMENT' || stepper.from === 'SPFP_FINAL';

  const {
    // isFetching,
    isSaveLoading,
    setShouldGoNext,
    handleSave,
  } = useDPOP(props);

  // Expose handleSave and container to parent via callback
  React.useEffect(() => {
    if (onSaveExternal) {
      onSaveExternal({
        container,
        handleSave: (blob) => handleSave(blob, saveType),
      });
    }
  }, [container, handleSave, onSaveExternal, saveType]);

  return (

    <RowWrapper sx={{ mt: 3 }}>
      <WordEditor
        id={props?.id}
        isReadOnly={shouldDisable}
        container={container}
        setContainer={setContainer}
        isLoading={isSaveLoading || props?.isLoading}
        initialValue={props?.data}
        isLandscape={props?.isLandscape}
        onSave={(blob) => {
          handleSave(blob, saveType);
        }}
      />
    </RowWrapper>
  );
};

export default useDPOPPage;
