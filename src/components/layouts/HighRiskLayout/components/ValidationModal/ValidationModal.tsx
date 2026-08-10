import { useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import parse from 'html-react-parser';

import { MODAL } from '@/configs/constants/modalId';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';

import TextStyle from '@/components/shared/TextStyle';


interface ValidationModalProps {
  debtorId: string | undefined;
}

const ValidationModal = ({ debtorId }: ValidationModalProps) => {
  const { data: validationResult } = useGetValidateResult({ debtorId }, {
    enabled: debtorId !== null,
  });

  useEffect(() => {
    if (validationResult?.content.invalid) {
      NiceModal.show(MODAL.GLOBAL.WARNING, {
        closeText: 'Close',
        title: (
          <TextStyle
            weight={500}
            color="primary.main"
            sx={{ textAlign: 'left' }}
          >
            {parse(validationResult.content.result)}
          </TextStyle>
        ),
      });
    }
  }, [validationResult]);

  return null;
};

export default ValidationModal;
