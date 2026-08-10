'use client';


import { Box, TableCell } from '@mui/material';
import { Controller } from 'react-hook-form';

import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';

import useShareHolder from './ShareHolder.hook';


const ShareHolderPage = () => {
  const {
    tableHeaderList,
    theme,
    gotoAddPage,
    tableData,
    totalPercentage,
    totalShares,
    listButtons,
    itemPerPage,
    noPage,
    setItemPerPage,
    setNoPage,
    filter,
    filterContentList,
    setFilter,
    filterDropdownList,
    renderActionButtons,
    control,
    isViewOnly,
    isAutoSaveFetching,
    canEditShareholder,
    differentDataWithApu,
    isDebtor,
    handleOnSave,
    handleSubmit,
    setIsSubmit,
  } = useShareHolder();

  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Shareholder" buttons={listButtons} />
      {roleCanEdit && differentDataWithApu && (
        <RowWrapper
          alignItems="center"
          width="100%"
          mb={2}
          sx={{ backgroundColor: '#fffce4', gap: 2, padding: 2 }}
        >
          <Icon
            textVariant="body1"
            iconName="warning-2"
          />
          <TextStyle>
            Data Shareholder APU PPT telah berubah, silahkan sesuaikan kembali.
          </TextStyle>
        </RowWrapper>
      )}

      { roleCanEdit && !isDebtor && !canEditShareholder && (
        <RowWrapper
          alignItems="center"
          width="100%"
          mb={2}
          sx={{ backgroundColor: '#fffce4', gap: 2, padding: 2 }}
        >
          <Icon
            textVariant="body1"
            iconName="warning-2"
          />
          <TextStyle>
            Dalam proses pengajuan APU PPT, data tidak dapat diubah.
          </TextStyle>
        </RowWrapper>
      )}


      <SectionTitle title="Tingkat 1" isOpen sx={{ mb: 1 }}></SectionTitle>
      <BaseContainer>
        <Table
          tableHeader={tableHeaderList}
          tableData={tableData?.contents ?? []}
          isLoading={false}
          totalPage={tableData?.page?.totalPage ?? 1}
          pageSize={itemPerPage}
          currentPage={noPage}
          onPageSizeChange={setItemPerPage}
          handlePageChange={setNoPage}
          withConditional={true}
          renderAdditonalRow={() => (
            <>
              <TableCell colSpan={4}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.primary.main}
                >
                  Total
                </TextStyle>
              </TableCell>
              <TableCell>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.primary.main}
                >
                  {totalShares || '-'}
                </TextStyle>
              </TableCell>
              <TableCell>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.primary.main}
                >
                  {`${totalPercentage} %` || '-'}
                </TextStyle>
              </TableCell>
            </>
          )}
          footer={
            isViewOnly || !canEditShareholder ? null :
              (
                <RowWrapper
                  sx={{ justifyContent: 'end', mb: 2 }}
                >
                  <Button
                    variant="outlined"
                    startIcon="add-2"
                    startIconSx={{ fontSize: theme.spacing(3) }}
                    sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                    onClick={gotoAddPage}
                  >
                    Add New
                  </Button>
                </RowWrapper>
              )
          }
        />
      </BaseContainer>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <Input
            {...field}
            type="area"
            label="Keterangan"
            rows={4}
            disabled={isViewOnly || !roleCanEdit}
          />
        )}
      />

      {/* <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
        {renderActionButtons()}
      </RowWrapper> */}

      <ActionFooterDetail
        handleSave={handleSubmit(handleOnSave)}
        onChange={(value) => {
          if (value) {
            setIsSubmit(value);
            handleSubmit(handleOnSave)();
          }
        }}
        isAutoSaveFetching={isAutoSaveFetching}
        viewOnly={isViewOnly || !roleCanEdit}
      />

    </ColumnWrapper>
  );
};

export default ShareHolderPage;
