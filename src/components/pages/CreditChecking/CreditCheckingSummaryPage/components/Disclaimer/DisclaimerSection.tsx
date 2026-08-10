import React, { useState } from 'react';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import WordEditor from '@/components/shared/WordEditor';


const DisclaimerSection = () => {
  const [container, setContainer] = useState(null);

  return (
    <ColumnWrapper sx={{ gap: 1 }}>
      <SectionTitle title="Disclaimer" />
      <WordEditor
        container={container}
        setContainer={setContainer}
      />
    </ColumnWrapper>
  );
};

export default DisclaimerSection;
