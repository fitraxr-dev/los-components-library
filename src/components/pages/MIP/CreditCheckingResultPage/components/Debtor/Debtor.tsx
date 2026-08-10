import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ExternalRatingTable from '../ExternalRatingTable';

import TableDebtor from './components/TableDebtor';
import useDebtorHook from './Debtor.hook';


const Debtor = () => {
  const theme = useTheme();

  const {
    container,
    contents,
    control,
    externalRating,
    handleSave,
    isAutoSaveFetching,
    isFetching,
    isSaveLoading,
    setShouldGoNext,
    setContainer,
    tableHeaderDebtor,
    viewOnly,
    handleSubmitForm,
  } = useDebtorHook();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <TableDebtor />
      <SectionTitle title="Eksternal Rating / Issuer" isOpen sx={{ marginBottom: theme.spacing(3) }}>
        <ColumnWrapper gap={theme.spacing(3)}>
          <ExternalRatingTable />
          <Controller
            name="ratingLongDescription"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                onChange={(value) => field.onChange(value)}
                value={field.value}
                type="area"
                label="Keterangan Credit Rating Eksternal & Info Credit Checking"
                placeholder="Input keterangan"
                disabled={viewOnly}
                containerSx={{ flex: 1 }}
                rows={4}
              />
            }
          />
        </ColumnWrapper>
      </SectionTitle>

      <SectionTitle title="Credit & Market Checking" isOpen sx={{ marginBottom: theme.spacing(3) }}>
        <ColumnWrapper gap={theme.spacing(3)}>
          <Title title="Credit Checking" />
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              tableHeader={tableHeaderDebtor}
              tableData={contents}
            />
          </BaseContainer>
          <Controller
            name="creditMarketCheckingReference"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                onChange={(value) => field.onChange(value)}
                value={field.value}
                label="Sumber referensi"
                placeholder="Input referensi"
                containerSx={{ flex: 1 }}
                disabled={viewOnly}
                type="area"
                rows={4}
              />
            }
          />
        </ColumnWrapper>
      </SectionTitle>
      <ColumnWrapper gap={theme.spacing(3)}>
        <Title title="Market Checking" />
        <WordEditor
          isReadOnly={viewOnly}
          container={container}
          setContainer={setContainer}
          isLoading={isFetching || isSaveLoading}
          initialValue={externalRating?.marketChecking}
          enableTrackChanges={false}
        />
      </ColumnWrapper>
      <RowWrapper justifyContent="end" gap={theme.spacing(2)}>
        <Button
          isLoading={isSaveLoading}
          disabled={viewOnly || isAutoSaveFetching}
          onClick={() => {
            handleSubmitForm(handleSave)();
            setShouldGoNext(false);
          }}
        >
          {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
        </Button>
        <Button
          isLoading={isSaveLoading}
          disabled={viewOnly}
          onClick={() => {
            handleSubmitForm(handleSave)();
            setShouldGoNext(true);
          }}
        >
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default Debtor;
