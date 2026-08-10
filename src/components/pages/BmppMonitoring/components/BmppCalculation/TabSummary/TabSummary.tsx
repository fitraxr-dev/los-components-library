import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { tableHeader } from './TabSummary.constants';
import useTabSummary from './TabSummary.hook';

import type { TabSummaryProps } from './TabSummary.types';


const TabSummary = (props: TabSummaryProps) => {
  const { module, process, viewOnly = false } = props;
  const theme = useTheme();
  const {
    noPage,
    setPageSize,
    setNoPage,
    tableData,
    tablePage,
    dataAsOfDate,
    isLoading,
  } = useTabSummary(props);

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
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
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={tablePage?.totalPage ?? 1}
            pageSize={tablePage?.itemPerPage ?? 10}
            currentPage={noPage}
            onPageSizeChange={setPageSize}
            handlePageChange={setNoPage}
          />
        </BaseContainer>
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default TabSummary;
