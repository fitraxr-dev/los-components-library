import useGetListFacilityRelated from '../../hooks/useGetListFacilityRelated';


const useListFacilityRelated = () => {
  const { data } = useGetListFacilityRelated({
    filter: {
      id: 1,
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
  });

  return {
    data,
  };


};

export default useListFacilityRelated;
