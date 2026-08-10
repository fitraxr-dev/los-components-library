import { useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetListFinancingFacilityExisting from '../../hooks/useGetListFinancingFacilityExisting';
import { MODALPK } from '../../PK.constants';

import { TABLE_PAYMENT_FACILITY_EXISTING } from './ModalTablePaymentFacilityExisting.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const usePopupTablePaymentFacilityExisting = () => {
  const { debtorId, setFacilityId, processId } = useIdentity();

  const [filter, setFilter] = useSessionStorage('filter-component-pk-financingoverview', null);
  const [selected, setSelected] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const modalId = MODALPK.TABLE_PAYMENT_FACILITY_EXISTING;
  const modal = useModal(modalId);

  const payload = {
    filter: {
      ...filter?.filter,
      bucketProcessId: processId,
      debtorId,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.ENGAGEMENT_AGREEMENT,
    },
    page: {
      itemPerPage: pageSize,
      noPage: pageNo,
    },
    searchDetail: filter?.searchDetail,
    sortList: filter?.sortList,
  };

  const { data: dataPaymentFacilityExisting } = useGetListFinancingFacilityExisting(payload);

  const tableHeader: Array<TableHeader> = [
    {
      isDisabled: () => false,
      isSelected: (data) => selected.some((el) => el.id === data.id),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected.some((el) => el.id === data.id)) {
          setSelected([]);
        } else {
          setSelected([data]);
        }
      },
      type: 'checkbox',
    },
    ...TABLE_PAYMENT_FACILITY_EXISTING
  ];


  const popupFormFacilityHandler = () => {
    const facilityId = selected[0]?.facilityId;
    const id = selected[0]?.id;
    setFacilityId(facilityId);

    NiceModal.show(MODALPK.FORM_FACILITY, { existing: true, id });
    closeNiceModal(modalId);
  };

  return {
    dataPaymentFacilityExisting,
    filter,
    modal,
    modalId,
    pageNo,
    pageSize,
    popupFormFacilityHandler,
    selected,
    setFilter,
    setPageNo,
    setPageSize,
    tableHeader,
  };
};

export default usePopupTablePaymentFacilityExisting;
