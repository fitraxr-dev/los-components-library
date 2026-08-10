import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import SummaryDetailModal from './components/SummaryDetailModal';
import { SUMMARY_MODAL_IDS } from './TabSummary.constant';
import useTabSummary from './TabSummary.hook';


const TabSummary = () => {
  const theme = useTheme();

  const {
    isLoading,
    renderButtons,
    tableData,
    tableHeaders,
  } = useTabSummary();

  const hasRows = (rows) => Array.isArray(rows) && rows.length > 0;
  const showGroupAdd = hasRows(tableData.group?.add);
  const showGroupUpdate = hasRows(tableData.group?.update);
  const showItemAdd = hasRows(tableData.item?.add);
  const showItemUpdate = hasRows(tableData.item?.update);
  const showSubItemAdd = hasRows(tableData.subItem?.add);
  const showSubItemUpdate = hasRows(tableData.subItem?.update);

  return (
    <>
      <ColumnWrapper gap={3}>
        <Title title="Summary" />

        <SectionTitle
          title={showGroupUpdate ? 'Update Group Item' : 'Item Group'}
          isOpen
          hideToggle={!(showGroupAdd || showGroupUpdate)}
        >
          <ColumnWrapper gap={theme.spacing(3)} mt={theme.spacing(3)}>
            {showGroupAdd && (
              <SectionTitle title="Add New Group Item" isOpen>
                <BaseContainer sx={{ boxShadow: 7, mt: theme.spacing(3) }}>
                  <Table
                    tableHeader={tableHeaders.group.add}
                    tableData={tableData.group?.add}
                    isLoading={isLoading}
                  />
                </BaseContainer>
              </SectionTitle>
            )}

            {showGroupUpdate && (
              <>
                <BaseContainer sx={{ boxShadow: 7 }}>
                  <Table
                    tableHeader={tableHeaders.group.update}
                    tableData={tableData.group?.update}
                    isLoading={isLoading}
                    isMaintenanceParameterBar={true}
                  />
                </BaseContainer>
              </>
            )}
          </ColumnWrapper>
        </SectionTitle>

        <SectionTitle
          title={showItemUpdate ? 'Update Item' : 'Item'}
          isOpen
          hideToggle={!(showItemAdd || showItemUpdate)}
        >
          <ColumnWrapper gap={theme.spacing(3)} mt={theme.spacing(3)}>
            {showItemAdd && (
              <SectionTitle title="Add New Item" isOpen>
                <BaseContainer sx={{ boxShadow: 7, mt: theme.spacing(3) }}>
                  <Table
                    tableHeader={tableHeaders.item.add}
                    tableData={tableData.item?.add}
                    isLoading={isLoading}
                  />
                </BaseContainer>
              </SectionTitle>
            )}

            {showItemUpdate && (
              <>
                <BaseContainer sx={{ boxShadow: 7 }}>
                  <Table
                    tableHeader={tableHeaders.item.update}
                    tableData={tableData.item?.update}
                    isLoading={isLoading}
                    isMaintenanceParameterBar={true}
                  />
                </BaseContainer>
              </>
            )}
          </ColumnWrapper>
        </SectionTitle>

        <SectionTitle
          title={showSubItemUpdate ? 'Update Sub Item' : 'Sub Item'}
          isOpen
          hideToggle={!(showSubItemAdd || showSubItemUpdate)}
        >
          <ColumnWrapper gap={theme.spacing(3)} mt={theme.spacing(3)}>
            {showSubItemAdd && (
              <SectionTitle title="Add New Sub Item" isOpen>
                <BaseContainer sx={{ boxShadow: 7, mt: theme.spacing(3) }}>
                  <Table
                    tableHeader={tableHeaders.subItem.add}
                    tableData={tableData.subItem?.add}
                    isLoading={isLoading}
                  />
                </BaseContainer>
              </SectionTitle>
            )}

            {showSubItemUpdate && (
              <>
                <BaseContainer sx={{ boxShadow: 7 }}>
                  <Table
                    tableHeader={tableHeaders.subItem.update}
                    tableData={tableData.subItem?.update}
                    isLoading={isLoading}
                    isMaintenanceParameterBar={true}
                  />
                </BaseContainer>
              </>
            )}
          </ColumnWrapper>
        </SectionTitle>

        <RowWrapper mt={5} gap={2} alignItems="center" justifyContent="end">
          {renderButtons()}
        </RowWrapper>
      </ColumnWrapper>

      <ModalDef
        id={SUMMARY_MODAL_IDS.SUMMARY_DETAIL_MODAL}
        component={SummaryDetailModal}
      />
    </>
  );
};

export default TabSummary;
