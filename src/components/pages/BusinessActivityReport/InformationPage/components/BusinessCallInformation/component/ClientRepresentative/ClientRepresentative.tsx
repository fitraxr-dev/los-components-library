import React from 'react';

import { Box } from '@mui/material';
import { FormProvider } from 'react-hook-form';

import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableFooter from '@/components/shared/TableFooter';

import useClientRepresentative from './ClientRepresentative.hook';
import ClientRepresentativeTable from './component/ClientRepresentativeTable/ClientRepresentativeTable';


const ClientRepresentative = ({ isOpen, isViewOnly }: { isOpen: boolean; isViewOnly?: boolean}) => {

  const {
    handleDeleteItem,
    handleAddItem,
    fields,
    isNew,
    canEditBAR,
    canCreateBAR,
    isBarCreation,
  } = useClientRepresentative();

  return (
    <ColumnWrapper sx={{ flex: 1, gap: 2 }}>
      <SectionTitle title="Perwakilan Client" isOpen = {isOpen}>
        <BaseContainer
          sx={{
            boxShadow: 2,
            gap: 2,
            px: 2,
            py: 1,
          }}
        >
          {fields.map((field, index) => (

            <ClientRepresentativeTable
              handleDeleteItem={handleDeleteItem}
              key={field.id}
              index={index}
              isDisabled={isNew || !isBarCreation || canCreateBAR === false || canEditBAR === false || isViewOnly}
            />

          ))}
          {!isNew && isBarCreation && canCreateBAR === true && canEditBAR === true && !isViewOnly ?
            <RowWrapper
              sx={{ justifyContent: 'end', mt: 1 }}
            >
              <TableFooter onClick={handleAddItem} />
            </RowWrapper> : null}
        </BaseContainer>
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default ClientRepresentative;
