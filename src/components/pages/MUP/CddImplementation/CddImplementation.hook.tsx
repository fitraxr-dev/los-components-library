import TextStyle from '@/components/shared/TextStyle';


const useCddImplementation = () => {

  const checkboxList = [
    {
      additionalCheckboxSx: {
        margin: 0,
      },
      label: (
        <TextStyle>
          <span
            style={{
              fontStyle: 'italic',
            }}
          >
            Enhanced Due Diligence
          </span>{' '}
          (EDD)
        </TextStyle>
      ),
      value: 'EnhancedDueDiligence',
    },
    {
      additionalCheckboxSx: {
        margin: 0,
      },
      label: (
        <TextStyle>
          <span
            style={{
              fontStyle: 'italic',
            }}
          >Customer Due Diligence {' '}
          </span> (CDD)
        </TextStyle>
      ),
      value: 'CustomerDueDiligence',
    },
    {
      additionalCheckboxSx: {
        margin: 0,
      },
      label: (
        <TextStyle>
          CDD Sederhana
        </TextStyle>
      ),
      value: 'CDDSederhana',
    },
  ];


  return {
    checkboxList,

  };
};

export default useCddImplementation;
