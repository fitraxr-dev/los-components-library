export const tab = {
  CHILD_LIMIT: 'child-limit',
  PARENT_LIMIT: 'parent-limit',
} as const;

export const tabItems = [
  {
    label: 'Child Limit',
    value: tab.CHILD_LIMIT,
  },
  {
    label: 'Parent Limit',
    value: tab.PARENT_LIMIT,
  },
];
