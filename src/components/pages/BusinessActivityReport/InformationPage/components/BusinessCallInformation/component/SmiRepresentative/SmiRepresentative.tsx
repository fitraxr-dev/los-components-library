import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableFooter from '@/components/shared/TableFooter';

import SmiRepresentativeTable from './component/SmiRepresentativeTable/SmiRepresentativeTable';
import useSmiRepresentative from './SmiRepresentative.hook';


const SmiRepresentative = ({ isOpen, isViewOnly }: { isOpen: boolean; isViewOnly?: boolean}) => {
  const {
    handleAddItem,
    fields,
    handleDeleteItem,
    isNew,
    canCreateBAR,
    canEditBAR,
    isBarCreation,
  } = useSmiRepresentative();

  return (
    <ColumnWrapper sx={{ flex: 1, gap: 2 }}>
      <SectionTitle title="Perwakilan SMI" isOpen={isOpen}>
        <BaseContainer
          sx={{
            boxShadow: 2,
            gap: 2,
            px: 2,
            py: 1,
          }}
        >
          {fields.map((field, index) => (

            <SmiRepresentativeTable
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

export default SmiRepresentative;
