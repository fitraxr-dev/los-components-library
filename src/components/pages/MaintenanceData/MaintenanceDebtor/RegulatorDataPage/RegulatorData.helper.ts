export const overideDropdownList = (data: any[]) => {
  return data?.map((item) => ({
    label: item.value + ' | ' + item.label,
    value: item.value,
  }));
};
