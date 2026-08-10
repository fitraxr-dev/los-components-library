'use client';

import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import ActionButtons from '@/components/shared/ActionButtons';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';

import useManagement from './Management.hook';


const ManagementPage = () => {
  const {
    actions,
    data,
    gotoAddPage,
    handleChangeRemark,
    handleClose,
    handleOpenSubmitModal,
    handleSave,
    isDetailPage,
    isPending,
    isAutoSaveFetching,
    isSubmitLoading,
    itemPerPage,
    noPage,
    remark,
    setItemPerPage,
    setNoPage,
    tableHeaderList,
    theme,
    isViewOnly,
    setIsSubmit,
  } = useManagement();

  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  return (
    <ColumnWrapper gap={theme.spacing(3)} paddingY={theme.spacing(3)}>
      <Title title="Management" />
      <SectionTitle title="Management" />
      <BaseContainer>
        <Table
          tableHeader={tableHeaderList}
          withConditional={true}
          tableData={data?.contents ?? []}
          isLoading={false}
          totalPage={data?.page?.totalPage ?? 1}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          pageSize={itemPerPage}
          currentPage={noPage}
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
                    onClick={gotoAddPage}
                  >
                    Add New
                  </Button>
                </RowWrapper>
              )
          }
        />
      </BaseContainer>
      <Input
        type="area"
        label="Keterangan"
        disabled={!roleCanEdit || isViewOnly}
        rows={4}
        value={remark}
        onChange={(e) => handleChangeRemark(e)}
      />


      <ActionFooterDetail
        handleSave={handleSave}
        onChange={(value) => {
          if (value) {
            setIsSubmit(value);
            handleSave();
          }
        }}
        isAutoSaveFetching={isAutoSaveFetching}
        viewOnly={isViewOnly || !roleCanEdit}
      />

    </ColumnWrapper>
  );
};

export default ManagementPage;
