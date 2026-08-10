import { useEffect, useState } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { fastTrack } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { matchesPathname, replacePath } from '@/helpers/navigation';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useFastTrackContext } from '@/components/layouts/FastTrackLayout/FastTrack.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';

import { useFastTrackRequestResultContext } from '../../FastTrackRequestResult.context';
import ConfirmationInfo from '../ConfirmationInfo';

import ModalVerificationUploadDocument from './components/ModalVerificationUploadDocument';
import TableDebtor from './components/TableDebtor';
import TableManagement from './components/TableManagement';
import TableOtherRelation from './components/TableOtherRelation';
import TableShareholder from './components/TableShareholder';
import { TAB_ITEMS, modal, tab } from './ManagementShareholder.constants';
import useManagementShareholder from './ManagementShareholder.hook';


const ManagementShareholder = () => {
  const pathname = usePathname();
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { bucketDetail, selectedDebtor } = useFastTrackRequestResultContext();
  const [hasAutoSwitched, setHasAutoSwitched] = useState(false);
  const newRequestPagePath = replacePath(fastTrack.DETAIL_REQUEST_PAGE, { processId });
  const isRequestMode = matchesPathname(pathname, newRequestPagePath);
  const pathSegments = pathname.split('/').filter((segment) => segment);
  const isResult = pathSegments[4] === 'result';
  const { tableType } = useFastTrackContext();
  const isSummary = tableType === 'SUMMARY';

  const {
    activeTab,
    handleRemarkChange,
    handleViewMaintenanceCustomer,
    isDisabledRemarkByStatus,
    remarkValue,
    setActiveTab,
    isRequestModule,
  } = useManagementShareholder();

  useEffect(() => {
    if (!hasAutoSwitched && selectedDebtor && selectedDebtor.length > 0) {

      setActiveTab(tab.SHAREHOLDER);
      const timer = setTimeout(() => {
        setActiveTab(tab.DEBTOR);
        setHasAutoSwitched(true);
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [selectedDebtor, hasAutoSwitched]);


  return (
    <>
      <ColumnWrapper gap={3}>
        <RowWrapper sx={{ justifyContent: 'space-between' }}>
          <Input
            disabled
            type="dropdown"
            label=""
            value={bucketDetail?.debtorName}
            placeholder="Choose Customer"
            dropdownList={[{ label: bucketDetail?.debtorName, value: bucketDetail?.debtorName }]}
            containerSx={{ width: '25%' }}
          />
          {isRequestMode && (
            <Button onClick={handleViewMaintenanceCustomer} disabled={viewOnly}>
              Go to Maintenance Customer
            </Button>
          )}
        </RowWrapper>

        <Tabs activeTab={activeTab} onChange={setActiveTab} items={TAB_ITEMS} />
        <TableDebtorInformation
          module={TypeModule.FAST_TRACK}
          process={TypeProcess.FAST_TRACK}
        />

        <TabItem activeValue={activeTab} value={tab.DEBTOR}>
          <TableDebtor />
        </TabItem>
        <TabItem activeValue={activeTab} value={tab.SHAREHOLDER}>
          <TableShareholder />
        </TabItem>
        <TabItem activeValue={activeTab} value={tab.MANAGEMENT}>
          <TableManagement />
        </TabItem>
        <TabItem activeValue={activeTab} value={tab.OTHER_RELATION}>
          <TableOtherRelation />
        </TabItem>

        <Input
          disabled={viewOnly || isDisabledRemarkByStatus}
          type="area"
          label="Keterangan"
          placeholder="Input Keterangan"
          rows={4}
          value={remarkValue}
          onChange={handleRemarkChange}
        />
      </ColumnWrapper>

      <ModalDef
        id={modal.VERIFICATION_UPLOAD_DOCUMENT}
        component={ModalVerificationUploadDocument}
      />
    </>
  );
};

export default ManagementShareholder;
