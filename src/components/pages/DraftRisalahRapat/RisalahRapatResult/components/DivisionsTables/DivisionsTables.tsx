import Box from '@mui/material/Box';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import IconButton from '@/components/shared/IconButton';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useDivisionsTables from './DivisionsTables.hook';

import type { DivisionTablesProps } from './DivisionsTables.types';


const DivisionsTables = (props: DivisionTablesProps) => {

  const {
    theme,
    onProgress,
    tableHeader,
    userByDivisionData,
    handleAddDirector,
    getUserByDivisionData,
    viewOnly,
    title,
  } = useDivisionsTables(props);

  return (
    <SectionTitle title={`${title}${userByDivisionData?.userList.length > 0 ? onProgress ? ' | On Progress' : ' | Confirmed' : ''}`} isOpen sx={{ mb: 3 }} >
      <BaseContainer
        sx={{
          boxShadow: 2,
          maxWidth: '100%',
          mt: theme.spacing(3),
          padding: theme.spacing(2),
        }}
      >
        <Table
          tableHeader={tableHeader}
          tableData={userByDivisionData?.userList}
          isLoading={getUserByDivisionData}
          footer={!viewOnly ?
            <RowWrapper sx={{ justifyContent: 'end', mb: 3 }}>
              <Button
                variant="outlined"
                startIcon="add-2"
                startIconSx={{ fontSize: theme.spacing(3) }}
                sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                onClick={() => handleAddDirector(userByDivisionData?.divisionId)}
              >
                Add New
              </Button>
            </RowWrapper> : null
          }
        />
      </BaseContainer>
    </SectionTitle>
  );
};

export default DivisionsTables;
