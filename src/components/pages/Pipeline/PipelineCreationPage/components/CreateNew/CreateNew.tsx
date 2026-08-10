'use client';
import { useContext, useEffect } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import WarningModal from '@/components/shared/SmiModal/WarningModal';

import ModalDataDk from '../../../ListPage/components/ModalDataDK';
import ModalExistingUser from '../../../ListPage/components/ModalExistingUser/ModalExistingUser';
import { modal } from '../../../ListPage/List.constants';
import FormDebtor from '../FormDebtor';
import PipelineTitle from '../PipelineTitle';

import ModalRecommendedGroup from './components/ModalRecommendedGroup/ModalRecommendedGroup';
import { useCreateNew } from './CreateNew.hooks';
import { modal as createNewModal } from './CreateNewPipelineCustom.constant';


const CreateNew = () => {

  const {
    isSaveLoading,
    disabledFields,
    mandatoryFields,
    handleSave,
    handleClose,
    control,
    resetField,
    watch,
    isValid,
    dirtyMsg,
    isExistingDebtor,
    isInstitutionTypeCentral,
    isValidationInvalid,
    handleSubmit,
    validateResult,
  } = useCreateNew();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <PipelineTitle
        debtorId={null}
        groupId={null}
        isExisting={isExistingDebtor}
        result={validateResult?.content?.result}
        isInvalid={validateResult?.content?.invalid}
        isNew
      />

      <FormDebtor
        bucketProcessId={undefined}
        listText={isValidationInvalid ? [
          'Form tidak dapat diedit'
        ] : undefined}
        control={control}
        resetField={resetField}
        disabledFields={isValidationInvalid ? {
          analyst: true,
          createdDate: true,
          dataSource: true,
          debtorName: true,
          debtorNameOther: true,
          debtorRating: true,
          debtorType: true,
          financingType: true,
          gam: true,
          group: true,
          insitutionTypeId: true,
          isGroup: true,
          isRelatedToSmi: true,
          npwp: true,
          remarks: true,
          typeProcess: true,
        } : {
          ...disabledFields,
        }}
        mandatoryFields={{ ...mandatoryFields, debtorNameOther: isInstitutionTypeCentral ? true : false }}
        watch={watch}
      />

      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        {isValidationInvalid ? (
          <Button
            variant="outlined"
            onClick={handleClose}
          >
            Close
          </Button>
        ) : (
          <Button
            id="button-save"
            data-testid="button-save"
            sx={{ mr: 1 }}
            onClick={handleSubmit(handleSave)}
            isLoading={isSaveLoading}
            disabled={!isValid || !dirtyMsg}
          >
            Save
          </Button>
        )}
      </RowWrapper>
      <ModalDef
        id={MODAL.EXISTING_USER}
        component={ModalExistingUser}
      />
      <ModalDef
        id={modal.CUSTOMER_DK_VALIDATION}
        component={ModalDataDk}
      />
      <ModalDef
        id={MODAL.GLOBAL.WARNING}
        component={WarningModal}
      />
      <ModalDef
        id={createNewModal.RECOMMENDED_GROUP}
        component={ModalRecommendedGroup}
      />
    </ColumnWrapper>
  );
};

export default CreateNew;
