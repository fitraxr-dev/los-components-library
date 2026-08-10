import { engagementSubmission } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useIdentity from '@/hooks/useIdentity';
import setPreviewPage from '@/hooks/useSetPreviewPage';


const useTitleDebtor = () => {
  const { parentId } = useIdentity();

  const handleRerouteViewPK = () => {
    const path = replacePath(
      engagementSubmission.DEBTOR_INFORMATION_PAGE,
      { processId: parentId });

    window.open(setPreviewPage(path), 'blank', 'noopener,noreferrer');
  };

  return {
    handleRerouteViewPK,
  };
};

export default useTitleDebtor;
