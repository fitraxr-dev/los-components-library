import { Box, Tooltip, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import useCustomRouter from '@/hooks/useCustomRouter';

import TableDebtorInformation from '@/components/pages/BmppSimulation/DetailPage/components/TableDebtorInformation';
import useMemberInformationDetail from '@/components/pages/MaintenanceData/MaintenanceGroup/DetailMemberPage/MemberInformation/MemberInformationDetail/MemberInformationDetail.hook';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';


const Bmpk = () => {
  const { control } = useFormContext();
  const theme = useTheme();
  const router = useCustomRouter();

  const {
    tableHeaderBMPK,
    bmpkList,
    dataAsOfDateBmpk,
    pageBmpk,
    setPageBmpk,
    setPageSizeBmpk,
    filterBmpk,
    setFilterBmpk,
    filterDropdownListBmpk,
    filterContentListBmpk,
  } = useMemberInformationDetail();

  const { debtorDetail } = useMemberInformationDetail();

  const debtor = debtorDetail?.data?.content;
  return (
    <ColumnWrapper sx={{ gap: 3, paddingY: theme.spacing(2) }}>
      <TableDebtorInformation
        debtorName={debtor?.name ?? '-'}
        gamName={debtor?.gamName ?? '-'}
        staffName={debtor?.staffName ?? '-'}
        isNewClient={debtor?.isNewDebtor ?? false}
        cif={debtor?.cif ?? '-'}
        division={debtor?.divisionName ?? '-'}
        debtorId={debtor?.debtorId ?? '-'}
        createdAt={debtor?.createdDate ?? '-'}
      />

      <SectionTitle title="BMPK/BMPD/BMPP" isOpen>
        <Box display="flex" alignItems="center" py={3} gap={1} px={3}>
          <TextStyle variant="body4">
            Data as of : {dataAsOfDateBmpk}
          </TextStyle>
          <Tooltip
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: theme.palette.primary.main,
                },
              },
            }}
            title="Tanggal dan jam update data terakhir"
            placement="right"
          >
            <Box display="flex" alignItems="center">
              <Icon iconName="information-shape" />
            </Box>
          </Tooltip>
        </Box>
        <BaseContainer>
          <RowWrapper sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box width="45vw">
              <Input
                type="search"
                value={filterBmpk}
                onChange={setFilterBmpk}
                placeholder="Pencarian..."
                dropdownList={filterDropdownListBmpk}
                contentList={filterContentListBmpk}
              />
            </Box>
          </RowWrapper>
          <Table
            tableHeader={tableHeaderBMPK}
            tableData={bmpkList?.contents || []}
            currentPage={pageBmpk}
            totalPage={bmpkList?.page?.totalPage ?? 1}
            handlePageChange={setPageBmpk}
            onPageSizeChange={setPageSizeBmpk}
          />
        </BaseContainer>

      </SectionTitle>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => router.back()}>Close</Button>
      </Box>
    </ColumnWrapper>
  );
};

export default Bmpk;
