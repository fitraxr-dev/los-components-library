'use client';
import { TypeProcess, TypeModule } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useProfile } from './Profile.hook';


const ProfilePage = () => {
  const { viewOnly } = useViewOnly();

  const {
    profileDetail,
    isFetchLoading,
    isSaveLoading,
    handleSave,
    goToNextStep,
    container,
    setContainer,
  } = useProfile();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Profil" />

      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />

      <WordEditor
        isReadOnly={viewOnly}
        container={container}
        setContainer={setContainer}
        isLoading={isFetchLoading || isSaveLoading}
        initialValue={profileDetail?.description}
        onSave={handleSave}
      />

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button
          isLoading={isSaveLoading}
          onClick={
            viewOnly ? goToNextStep : handleSave
          }
        >
          {viewOnly ? 'Next' : 'Save'}
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ProfilePage;
