'use client';
import { ModalDef } from '@ebay/nice-modal-react';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Title from '@/components/shared/Title';

import RejectModal from '../components/RejectModal/RejectModal';
import Table from '../components/Table/Table';

import { modal } from './TATDetail.constants';
import useTATDetail from './TATDetail.hook';


const TATDetailPage = () => {
  const {
    TABLE_HEADER_MAINTENANCE_TAT_DETAIL,
    TABLE_HEADER_MAINTENANCE_TAT_APPROVAL,
    MAINTENANCE_TAT_DETAIL,
    MAINTENANCE_TAT_APPROVAL,
    viewOnly,
    setViewOnly,
    handleApprove,
    handleReject,
  } = useTATDetail();
  return (
    <>
      <Title
        title={viewOnly ? 'Maintenance Turn Around Time  (TAT)' : 'Approval Maintenance Turn Around Time  (TAT)'}
      />
      {!viewOnly && <SectionTitle title="Update" sx={{ marginTop: '24px' }} />}
      <BaseContainer>
        <Table
          tableHeader={viewOnly ? TABLE_HEADER_MAINTENANCE_TAT_DETAIL : TABLE_HEADER_MAINTENANCE_TAT_APPROVAL}
          tableData={viewOnly ? MAINTENANCE_TAT_DETAIL : MAINTENANCE_TAT_APPROVAL}
        />
        <RowWrapper sx={{ gap: 3, justifyContent: 'flex-end', py: 3 }}>
          <Button
            color="primary"
            onClick={() => setViewOnly((prev) => !prev)}
          >
            Next
          </Button>
          {!viewOnly && (
            <>
              <Button
                color="success"
                onClick={handleApprove}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleReject}
              >
                Reject
              </Button>
            </>
          )}
        </RowWrapper>
      </BaseContainer>

      <ModalDef
        id={modal.REJECT_MODAL}
        component={RejectModal}
      />
    </>
  );
};

export default TATDetailPage;
