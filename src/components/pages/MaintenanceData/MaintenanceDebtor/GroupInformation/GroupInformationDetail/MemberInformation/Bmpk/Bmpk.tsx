import { Box, Tooltip, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import useBmpk from './Bmpk.hook';


const Bmpk = () => {
  const theme = useTheme();
  const {
    bmpkList,
    isLoadingBmpk,
    pageBmpk,
    pageSizeBmpk,
    setPageBmpk,
    setPageSizeBmpk,
    tableHeaderBmpk,
    dataAsOfDate,
  } = useBmpk();

  return (
    <ColumnWrapper sx={{ gap: 3, paddingY: theme.spacing(2) }}>
      {/* <TableDebtorInformation module={TypeModule.MAINTENANCE_DEBTOR} process={TypeProcess.MAINTENANCE_DEBTOR} /> */}
      <SectionTitle title="BMPK/BMPD/BMPP Individual" isOpen>
        <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Data as of : {dataAsOfDate}
          </TextStyle>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.error.main}
          >
            <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
              <Box display="flex" alignItems="center">
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </TextStyle>
        </RowWrapper>

        <BaseContainer>
          <Table
            tableHeader={tableHeaderBmpk}
            tableData={bmpkList?.contents}
            pageSize={pageSizeBmpk}
            totalPage={bmpkList?.page?.totalPage ?? 0}
            currentPage={pageBmpk}
            isLoading={isLoadingBmpk}
            handlePageChange={setPageBmpk}
            onPageSizeChange={setPageSizeBmpk}
          />
        </BaseContainer>
      </SectionTitle>

    </ColumnWrapper>
  );
};

export default Bmpk;
