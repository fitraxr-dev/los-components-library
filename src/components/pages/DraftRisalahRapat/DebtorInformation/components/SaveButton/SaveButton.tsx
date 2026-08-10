'use client';

import useGoToNextStep from '@/hooks/useGoToNextStep';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';

import { TABS } from '../../../Attachment/Attachment.constants';


type SaveButtonProps = {
  activeTab?: string; setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
}
const SaveButton = ({ activeTab, setActiveTab }: SaveButtonProps) => {
  const goToNextStep = useGoToNextStep();

  const handleSaveAndNext = () => {
    if (activeTab === TABS.CORRECTIVE_ACTION) {
      setActiveTab(TABS.REPORT_ROUTINE);
    } else {
      goToNextStep();
    }
  };

  return (
    <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
      <Button onClick={() => handleSaveAndNext()}>
        Next
      </Button>
    </RowWrapper>

  );
};


export default SaveButton;
