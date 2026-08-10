export interface UseModalRecommendedGroupProps {
  groupName?: string;
  onSelectGroup?: (selectedGroup: any) => void;
  onCreateNew?: () => void;
  hasDuplicate?: boolean;
  payload?: any;
  similarGroupList?: any[];
}

export interface ModalRecommendedGroupProps {
  groupName?: string;
  onSelectGroup?: (group: any) => void;
  onCreateNew?: () => void;
  hasDuplicate?: boolean;
  payload?: any;
  similarGroupList?: any[];
}
