import { useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import { modal as modalSpfp } from '../../FinancingOverview.constants';
import useGetListFinancingFacilityExisting from '../../hooks/useGetListFinancingFacilityExisting';

import { TABLE_PAYMENT_FACILITY_EXISTING } from './ModalTablePaymentFacilityExisting.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const usePopupTablePaymentFacilityExisting = ({ module, process }) => {
  const { debtorId, setFacilityId } = useIdentity();

  const [filter, setFilter] = useState(null);
  const [selected, setSelected] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const modalId = modalSpfp.TABLE_PAYMENT_FACILITY_EXISTING;
  const modal = useModal(modalId);

  const payload = {
    filter: {
      ...filter?.filter,
      debtorId,
    },
    page: {
      itemPerPage: pageSize,
      noPage: pageNo,
    },
    searchDetail: filter?.searchDetail,
    sortList: filter?.sortList,
  };

  const { data: dataPaymentFacilityExisting, isLoading, error } = useGetListFinancingFacilityExisting(payload);

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
    const selectedData = selected[0];
    const facilityId = selectedData?.facilityId;
    const id = selectedData?.id;
    setFacilityId(facilityId);

    // Pass the selected data to the modal form
    NiceModal.show(modalSpfp.FORM_FACILITY, {
      existing: true,
      id,
      module,
      process,
      selectedData, // Pass the selected row data
    });
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
