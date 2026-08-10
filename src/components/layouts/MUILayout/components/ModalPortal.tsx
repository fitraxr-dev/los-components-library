import { ModalDef } from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';

import AuditTrailCompareModal from '@/components/pages/FastTrack/ValidationPage/components/AuditTrailCompareModal';
import AuditTrailDetailModal from '@/components/pages/FastTrack/ValidationPage/components/AuditTrailDetailModal';
import SearchListModal from '@/components/pages/Review/components/SearchListModal';
import ChangePasswordModal from '@/components/shared/SmiModal/ChangePasswordModal/ChangePasswordModal';
import ConfirmModal from '@/components/shared/SmiModal/ConfirmModal';
import ErrorModal from '@/components/shared/SmiModal/ErrorModal';
import ModalAssign from '@/components/shared/SmiModal/ModalAssign';
import CommentModal from '@/components/shared/SmiModal/ModalComment';
import ModalDirty from '@/components/shared/SmiModal/ModalDirty';
import ModalInputList from '@/components/shared/SmiModal/ModalInputList';
import ModalReassign from '@/components/shared/SmiModal/ModalReassign';
import ModalWatermark from '@/components/shared/SmiModal/ModalWatermark/ModalWatermark';
import SelectorModal from '@/components/shared/SmiModal/SelectorModal';
import SuccessModal from '@/components/shared/SmiModal/SuccessModal';
import WarningModal from '@/components/shared/SmiModal/WarningModal';
import ModalDebtor from '@/components/shared/SmiTable/ManagementAndShareholder/TableDebtor/components/ModalDebtor/ModalDebtor';
import ModalDebtorDetail from '@/components/shared/SmiTable/ManagementAndShareholder/TableDebtor/components/ModalDebtorDetail';
import ModalManagement from '@/components/shared/SmiTable/ManagementAndShareholder/TableManagement/components/ModalManagement';
import PopupManagementDetail from '@/components/shared/SmiTable/ManagementAndShareholder/TableManagement/components/ModalManagementDetail';
import PopupShareholder from '@/components/shared/SmiTable/ManagementAndShareholder/TableShareholder/components/ModalShareholder';
import ModalShareholderDetail from '@/components/shared/SmiTable/ManagementAndShareholder/TableShareholder/components/ModalShareholderDetail';


const ModalPortal = () => {

  return (
    <>
      {/* GLOBAL */}
      <ModalDef
        id={MODAL.GLOBAL.CONFIRM}
        component={ConfirmModal}
      />
      <ModalDef
        id={MODAL.GLOBAL.WARNING}
        component={WarningModal}
      />
      <ModalDef
        id={MODAL.GLOBAL.SUCCESS}
        component={SuccessModal}
      />
      <ModalDef
        id={MODAL.GLOBAL.ERROR}
        component={ErrorModal}
      />
      <ModalDef
        id={MODAL.GLOBAL.SELECTOR}
        component={SelectorModal}
      />
      <ModalDef
        id={MODAL.GLOBAL.COMMENT}
        component={CommentModal}
      />
      <ModalDef
        id={MODAL.GLOBAL.WATERMARK}
        component={ModalWatermark}
      />
      <ModalDef
        id={MODAL.MODAL_INPUT_LIST}
        component={ModalInputList}
      />
      <ModalDef
        id={MODAL.IS_DIRTY}
        component={ModalDirty}
      />

      {/* Managemement & Shareholder */}
      <ModalDef
        id={MODAL.MASTER.MANAGEMENT_DEBTOR}
        component={ModalDebtor}
      />
      <ModalDef
        id={MODAL.MASTER.MANAGEMENT_DEBTOR_DETAIL}
        component={ModalDebtorDetail}
      />
      <ModalDef
        id={MODAL.MASTER.MANAGEMENT}
        component={ModalManagement}
      />
      <ModalDef
        id={MODAL.MASTER.MANAGEMENT_DETAIL}
        component={PopupManagementDetail}
      />
      <ModalDef
        id={MODAL.MASTER.SHAREHOLDER}
        component={PopupShareholder}
      />
      <ModalDef
        id={MODAL.MASTER.SHAREHOLDER_DETAIL}
        component={ModalShareholderDetail}
      />

      {/* Review */}
      <ModalDef
        id={MODAL.REVIEW.SEARCH_LIST}
        component={SearchListModal}
      />

      {/* Assign */}
      <ModalDef
        id={MODAL.ASSIGN_TO}
        component={ModalAssign}
      />

      {/* Re-Assign */}
      <ModalDef
        id={MODAL.REASSIGN_TO}
        component={ModalReassign}
      />
      <ModalDef
        id={MODAL.CHANGE_PASSWORD}
        component={ChangePasswordModal}
      />
      {/* Fast Track */}
      <ModalDef
        id={MODAL.FAST_TRACK.AUDIT_TRAIL_DETAIL}
        component={AuditTrailDetailModal}
      />
      <ModalDef
        id={MODAL.FAST_TRACK.AUDIT_TRAIL_COMPARE}
        component={AuditTrailCompareModal}
      />
    </>
  );
};
export default ModalPortal;
