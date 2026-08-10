import TextStyle from '@/components/shared/TextStyle';


const useCddImplementation = () => {

  const checkboxList = [
    {
      additionalCheckboxSx: { margin: 0 },
      label: (
        <TextStyle>
          <i>Enhanced Due Diligence</i> (EDD)
        </TextStyle>
      ),
      value: 'EnhancedDueDiligence',
    },
    {
      additionalCheckboxSx: { margin: 0 },
      label: (
        <TextStyle>
          <i>Customer Due Diligence</i> (CDD)
        </TextStyle>
      ),
      value: 'CustomerDueDiligence',
    },
    {
      additionalCheckboxSx: { margin: 0 },
      label: 'CDD Sederhana',
      value: 'CDDSederhana',
    },
  ];


  return {
    checkboxList,
  };
};

export default useCddImplementation;
