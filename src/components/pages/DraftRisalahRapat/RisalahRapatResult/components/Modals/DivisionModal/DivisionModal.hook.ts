import { useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';


import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useGetCollaborationDivisions from '../../../hooks/useGetCollaborationDivisions';
import useSaveAddDivision from '../../../hooks/useSaveAddDivision';
import { MODAL } from '../../../RisalahRapatResult.contants';
import useRisalahRapatResult from '../../../RisalahRapatResult.hooks';

import type { DivisionModalProps } from './DivisionModal.types';


const useDivisionModal = (props: DivisionModalProps) => {
  const { mode } = props;
  const { DIVISIONS } = useRisalahRapatResult();
  const modalId = MODAL.SET_DIVISION;
  const modal = useModal(modalId);
  const theme = useTheme();

  const { processId } = useIdentity();

  const [checkboxDivisi, setCheckboxDivisi] = useState([]);

  const { data: listDivision, isSuccess: getCollaborationDiviisonSuccess } = useGetCollaborationDivisions({
    bucketProcessId: processId,
    module: TypeModule.RISALAH_RAPAT,
    process: TypeProcess.RISALAH_RAPAT,
  });

  const checkedDivision = listDivision.listDivision;

  const { mutate } = useSaveAddDivision({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan di coba kembali pada beberapa saat',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(modalId);
      showNiceModalV2({
        title: 'Data berhasil di save',
        type: 'success',
      });
    },
  });

  useEffect(() => {
    setCheckboxDivisi(checkedDivision);
  }, [checkedDivision, getCollaborationDiviisonSuccess]);

  const handleSubmitDivision = () => {
    mutate({
      bucketProcessId: processId,
      listDivision: checkboxDivisi,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
    });
  };
  const divisions = DIVISIONS.map((division) => {
    if (division.value === listDivision.disabledDivision) {
      return { ...division, disabled: true };
    }
    return division;
  });

  return {
    checkboxDivisi,
    divisions,
    handleSubmitDivision,
    modal,
    modalId,
    mode,
    setCheckboxDivisi,
    theme,
  };
};

export default useDivisionModal;
