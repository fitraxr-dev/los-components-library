import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { tableHeader } from './TabSummary.constants';
import useMupBmppSummary from './TabSummary.hook';

import type { TabSummaryProps } from './TabSummary.types';


const TabSummary = (props: TabSummaryProps) => {
  const {
    module,
    process,
    viewOnly = false,
    withTableDebtorInformation = false,
    standaloneBmppSimulation,
    isUseGetMasterDetail = false,
  } = props;
  const theme = useTheme();
  const {
    remark,
    setRemark,
    handleOnSave,
    isLoading,
    isLoadingList,
    noPage,
    setItemPerPage,
    setNoPage,
    tableData,
    tablePage,
    isSummaryRemarkLoading,
    dataAsOfDate,
  } = useMupBmppSummary(props);

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      {withTableDebtorInformation && (
        <TableDebtorInformation module={module} process={process} isUseGetMasterDetail={isUseGetMasterDetail} />
      )}
      <SectionTitle title="Summary BMPP" isOpen>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Box
            sx={{
              borderBottom: '0.02vw solid',
              borderColor: theme.palette.custom.gray30,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              mb: 1,
              py: 2,
            }}
          >
            <ColumnWrapper sx={{ justifyContent: 'center' }}>
              <TextStyle
                variant="body3"
                color={theme.palette.custom.gray30}
              >
                Data as of
              </TextStyle>
            </ColumnWrapper>

            <ColumnWrapper sx={{ justifyContent: 'center' }}>
              <TextStyle
                variant="body3"
                color={theme.palette.custom.gray30}
              >
                : {dataAsOfDate}
              </TextStyle>
            </ColumnWrapper>
          </Box>
          <Table
            isLoading={isLoading || isLoadingList}
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={tablePage?.totalPage ?? 1}
            pageSize={tablePage?.itemPerPage}
            currentPage={noPage}
            onPageSizeChange={setItemPerPage}
            handlePageChange={setNoPage}
          />
        </BaseContainer>

        {standaloneBmppSimulation ? <RowWrapper sx={{ py: theme.spacing(2) }}></RowWrapper> : (
          <>
            <RowWrapper sx={{ marginY: theme.spacing(2) }}>
              <Input
                type="area"
                label="Keterangan"
                placeholder="Input keterangan"
                containerSx={{ flex: 1 }}
                rows={4}
                onChange={(e) => setRemark(e)}
                value={remark}
                disabled={viewOnly}
              />
            </RowWrapper>
          </>
        )
        }
      </SectionTitle>

      <RowWrapper sx={{ justifyContent: 'end', py: theme.spacing(3) }}>
        <Button
          isLoading={isSummaryRemarkLoading}
          onClick={handleOnSave}
        >
          {viewOnly || standaloneBmppSimulation ? 'Next' : 'Save'}
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default TabSummary;
