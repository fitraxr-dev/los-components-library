'use client';

import { Controller } from 'react-hook-form';

import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';

import useOtherRelated from './OtherRelated.hook';


const OtherRelatedPage = () => {
  const {
    control,
    gotoAddPage,
    isOtherRelatedListLoading,
    isViewOnly,
    isAutoSaveFetching,
    noPage,
    renderActionButtons,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeaderList,
    theme,
    otherRelatedListData,
    isMaster,
    isLoadingSaveRemark,
    handleSubmit,
    handleOnSave,
    setIsSubmit,

  } = useOtherRelated();

  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Pihak Terkait Lainnya" />
      <SectionTitle title="Pihak Terkait Lainnya" />
      <BaseContainer>
        <Table
          tableHeader={tableHeaderList}
          withConditional={true}
          tableData={tableData ?? []}
          isLoading={isOtherRelatedListLoading}
          totalPage={otherRelatedListData?.page?.totalPage ?? 1}
          currentPage={noPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          footer={ !isViewOnly &&
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
            disabled={isViewOnly || isLoadingSaveRemark || !roleCanEdit}
          />
        )}
      />
      {/* <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
        {renderActionButtons()}
      </RowWrapper> */}
      <ActionFooterDetail
        handleSave={handleSubmit(handleOnSave)}
        isAutoSaveFetching={isAutoSaveFetching}
        onChange={(value) => {
          if (value) {
            setIsSubmit(value);
            handleSubmit(handleOnSave)();
          }
        }}
        viewOnly={isViewOnly || !roleCanEdit}
      />
    </ColumnWrapper>
  );
};

export default OtherRelatedPage;
