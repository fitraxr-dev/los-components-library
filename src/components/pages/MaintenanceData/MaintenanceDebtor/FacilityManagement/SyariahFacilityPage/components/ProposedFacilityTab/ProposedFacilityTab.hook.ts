const useProposedFacilityTab = () => {
  const clearSessionStorage = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('currentSyariahFacilityId');
      sessionStorage.removeItem('currentSyariahLimitId');
      sessionStorage.removeItem('currentIdDetailFacility');
      sessionStorage.removeItem('currentIdLimitInduk');
      sessionStorage.removeItem('currentModeFromLimitInduk');
    }
  };

  return {
    clearSessionStorage,
  };
};

export default useProposedFacilityTab;
