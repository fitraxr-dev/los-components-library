import NiceModal, { ModalDef, useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import InputAutocompleteV2 from '@/components/shared/Input/components/Search/components/InputAutocompleteV2';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../SyariahFacility.constants';
import ModalInquiryAccountList from '../ModalInquiryAccountList';
import ModalInquiryLimitList from '../ModalInquiryLimitList';

import useModalInquiry from './ModalInquiry.hook';


const ModalInqury = NiceModal.create(() => {
  const modalId = modal.INQUIRY;
  const modalLimitListId = modal.INQUIRY_LIMIT_LIST;
  const modalAccountListId = modal.INQUIRY_ACCOUNT_LIST;
  const { visible } = useModal(modalId);

  const {
    setSearchValue,
    cifValue,
    setCifValue,
    isLoading,
    listCifOption,
  } = useModalInquiry();

  const handleInquiryLimit = () => {
    const id = cifValue.label;

    NiceModal.show(modalLimitListId, { cif: id });
  };

  const handleInquiryAccount = () => {
    const id = cifValue.label;

    NiceModal.show(modalAccountListId, { cif: id });
  };

  const footer = (
    <RowWrapper sx={{ gap: '24px', justifyContent: 'end', mt: 5 }}>
      <Button
        disabled={!cifValue.id}
        onClick={handleInquiryLimit}
        color="blueRefina"
      >
        Inquiry Limit
      </Button>
      <Button
        disabled={!cifValue.id}
        onClick={handleInquiryAccount}
      >
        Inquiry Account
      </Button>
    </RowWrapper>
  );

  return (
    <>
      <SectionModal
        isOpen={visible}
        onClose={() => closeNiceModal(modalId)}
        containerSx={{
          maxHeight: '90vh',
          maxWidth: '75vw',
        }}
        customFooter={footer}
        title="Inquiry"
      >
        <InputAutocompleteV2
          key="cif"
          label="CIF"
          isLoading={isLoading}
          dropdownList={listCifOption}
          onChange={(value) => {
            setCifValue(value);
          }}
          onInputChange={(keyword) => {
            setSearchValue(keyword);
          }}
          value={cifValue}
        />
      </SectionModal>
      <ModalDef
        id={modalAccountListId}
        component={ModalInquiryAccountList}
      />
      <ModalDef
        id={modalLimitListId}
        component={ModalInquiryLimitList}
      />
    </>
  );
});
export default ModalInqury;
