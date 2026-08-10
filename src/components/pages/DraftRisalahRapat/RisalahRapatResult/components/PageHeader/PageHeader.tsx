import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import useRisalahRapatResult from '../../RisalahRapatResult.hooks';


const RenderButtons = () => {
  const canEditDivisi = useCheckAccess(accessid.DRAFT_LIST_UPDATE);

  const {
    handleDivisiModal,
    handleLembarPersetujuan,
    handlePreviewPersetujuan,
    isDivisiAvailable,
    viewOnly,
  } = useRisalahRapatResult();

  if (!isDivisiAvailable) {
    return (
      <RowWrapper sx={{ gap: 4 }}>
        <Button startIcon="filter-3" onClick={handlePreviewPersetujuan}>Preview Lembar Persetujuan</Button>
        {!viewOnly ?
          <>
            <Button startIcon="add" onClick={handleLembarPersetujuan}>Lembar Persetujuan</Button>
            {canEditDivisi && (
              <Button startIcon="edit" onClick={() => handleDivisiModal('Edit')}>Edit Divisi</Button>
            )}
          </> : null}
      </RowWrapper>);
  } else {
    return (
      <Button startIcon="add" onClick={() => handleDivisiModal('Add')}>Add Divisi</Button>
    );
  }
};

const PageHeader = () => {

  return (
    <RowWrapper sx={{ justifyContent: 'space-between' }}>
      <Title title="Hasil Verifikasi Risalah Rapat" />
      {RenderButtons()}
    </RowWrapper>
  );
};

export default PageHeader;
