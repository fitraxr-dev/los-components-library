import { ModalDef } from '@ebay/nice-modal-react';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';

import ModalAddAgent from '../ModalAddAgent';
import { modal } from '../ModalAddAgent/ModalAddAgent.constant';

import useAgentTable from './AgentTable.hook';

import type { AgentTableProps } from './AgentTable.type';


const AgentTable = ({
  agentType,
  isReadOnly,
  data,
  fields,
  handleAddAgent,
  handleEditAgent,
  handleDeleteAgent,
  watchFields,
}: AgentTableProps) => {
  const {
    handleOpenModalUploadDocument,
    tableHeaderUploadDocument,
    theme,
  } = useAgentTable({
    agentType: agentType,
    data: data,
    handleAddAgent,
    handleDeleteAgent,
    handleEditAgent,
    isReadOnly,
    watchFields,
  });

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <BaseContainer
          sx={{
            gap: 2,
            padding: 3,
          }}
        >
          <Table
            isLoading={false} //ganti jadi loading agent list/load detail
            tableData={fields} //Nanti ambil dari Informasi Sindikasi sebagai props
            tableHeader={tableHeaderUploadDocument}
            footer={(
              isReadOnly ?
                null :
                <RowWrapper
                  sx={{ justifyContent: 'end', mb: 2 }}
                >
                  <Button
                    variant="outlined"
                    startIcon="add-2"
                    startIconSx={{ fontSize: theme.spacing(3) }}
                    sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                    onClick={() => handleOpenModalUploadDocument()}
                  >
                    Add New
                  </Button>
                </RowWrapper>
            )}
          />
        </BaseContainer>
      </ColumnWrapper>

      <ModalDef
        id={modal.MODAL_ADD_AGENT}
        component={ModalAddAgent}
      />
    </>
  );
};
export default AgentTable;
