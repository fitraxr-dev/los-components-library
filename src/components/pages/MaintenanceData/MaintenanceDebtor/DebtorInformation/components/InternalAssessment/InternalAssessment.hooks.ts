import useGetInternalAssessment from '../../../hooks/useGetInternalAssessment';


const useInternalAssessment = () => {

  const { data } = useGetInternalAssessment({
    page: {
      itemPerPage: 5,
      noPage: 1,
    },
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });

  return {
    data,
  };

};

export default useInternalAssessment;
