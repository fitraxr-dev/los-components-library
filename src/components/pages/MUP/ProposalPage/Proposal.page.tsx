'use client';

import { useTheme } from '@mui/material';

import { mup } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { tab, TAB_ITEMS } from './Proposal.constant';
import useProposal from './Proposal.hook';


const ExecutiveOverviewPage = () => {
  const theme = useTheme();
  const router = useCustomRouter();

  const {
    activeTab,
    handleChangeTab,
    containerProposal,
    setContainerProposal,
    isFetchLoading,
    isSaveLoading,
    handleSave,
    tableHeader,
    financingProposalDetail,
    financingProposalList,
    isFetchingList,
    page,
    setPage,
    itemPerPage,
    setItemPerPage,
    processId,

  } = useProposal();
  const { viewOnly } = useViewOnly();

  return (

    <ColumnWrapper gap={3}>
      <Title title="Usulan" />
      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />

      <Tabs activeTab={activeTab} onChange={(val: string) => handleChangeTab(val)} items={TAB_ITEMS} />
      <RowWrapper>
        <TabItem activeValue={activeTab} value={tab.PROPOSAL} sx={{ width: '100%' }}>
          <ColumnWrapper gap={3}>
            <WordEditor
              isReadOnly={false}
              container={containerProposal}
              setContainer={setContainerProposal}
              isLoading={isFetchLoading || isSaveLoading}
              initialValue={financingProposalDetail?.description}
              onSave={handleSave}
            />
          </ColumnWrapper>
        </TabItem>
      </RowWrapper>
      <RowWrapper>
        <TabItem activeValue={activeTab} value={tab.STRUCTURE} sx={{ width: '100%' }}>
          <ColumnWrapper gap={3}>
            <Table
              tableHeader={tableHeader}
              tableData={financingProposalList?.contents}
              isLoading={isFetchingList}
              totalPage={financingProposalList?.page?.totalPage ?? 1}
              currentPage={page}
              handlePageChange={setPage}
              onPageSizeChange={setItemPerPage}
              pageSize={itemPerPage}
              footer={
                <RowWrapper
                  sx={{
                    justifyContent: 'end',
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon="add-2"
                    startIconSx={{ fontSize: theme.spacing(3) }}
                    sx={{
                      height: theme.spacing(6),
                      padding: theme.spacing(1),
                    }}
                    onClick={() => {
                      router.push(
                        replacePath(mup.MUNICIPAL_FINANCING_STRUCTURE_PROPOSAL_ADD_PAGE, { processId }));
                    }}
                  >
                    Add New
                  </Button>
                </RowWrapper>
              }
            />
          </ColumnWrapper>
        </TabItem>
      </RowWrapper>
      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button
          isLoading={isSaveLoading}
          onClick={handleSave}
        >
          {viewOnly ? 'Next' : 'Save'}
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ExecutiveOverviewPage;
