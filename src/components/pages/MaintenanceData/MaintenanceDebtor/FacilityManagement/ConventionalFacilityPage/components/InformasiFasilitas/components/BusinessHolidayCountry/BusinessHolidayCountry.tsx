import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';


import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ButtonClose from '../../../ButtonClose/ButtonClose';

import { modal } from './BusinessHolidayCountry.constant';
import { useBusinessHolidayCountry } from './BusinessHolidayCountry.hooks';
import BusinessHolidayCountryForm from './Component/BusinessHolidayCountryForm.page';


const BusinessHolidayCountry = ({ facilityInformation }: { facilityInformation: any }) => {
  const {
    itemPerPage,
    noPage,
    setNoPage,
    setItemPerPage,
    theme,
    tableData,
    filterDropdownList,
    filterContentList,
    filter,
    setFilter,
    tableHeaderList,
    isViewOnly,
    anomalyRowStyle,
    totalPage,
  } = useBusinessHolidayCountry();
  return (
    <>
      <Title title="Business Holiday Country" sx={{ mb: theme.spacing(3) }} />
      <ColumnWrapper sx={{ gap: 3 }}>

        <SectionTitle
          isOpen
          title="Business Holiday Country"
          subtitle={`Facility No: ${facilityInformation?.facilityNo ? facilityInformation?.facilityNo : '-'} | RM: ${facilityInformation?.relationshipManager ? facilityInformation?.relationshipManager : '-'} | Divisi: ${facilityInformation?.division ? facilityInformation?.division : '-'}`}
        >

          <Box sx={{ width: '45vw' }}>
            <Input
              type="search"
              value={filter}
              hasFilter
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={filterDropdownList}
              contentList={filterContentList}
            />
          </Box>
          <Table
            tableHeader={tableHeaderList}
            tableData={tableData ?? []}
            pageSize={itemPerPage}
            currentPage={noPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            totalPage={totalPage}
            anomalyRow={anomalyRowStyle}
            footer={
              isViewOnly ? null :
                (
                  <RowWrapper
                    sx={{ justifyContent: 'end', mb: 2 }}
                  >
                    <Button
                      variant="outlined"
                      startIcon="add-2"
                      startIconSx={{ fontSize: theme.spacing(3) }}
                      sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                      onClick={() => {
                        NiceModal.show(modal.MODAL_ADD);

                      }}
                    >
                      Add New
                    </Button>
                  </RowWrapper>
                )
            }
          />
        </SectionTitle>
      </ColumnWrapper>
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', pb: 2, pt: 3 }}>
        <ButtonClose />
      </RowWrapper>

      <ModalDef
        id={modal.MODAL_ADD}
        component={BusinessHolidayCountryForm}
      />
    </>
  );
};
export default BusinessHolidayCountry;
