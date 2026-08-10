import dayjs from 'dayjs';


type SortOrder = 'asc' | 'desc';

interface SortConfig {
  key: string;
  order: SortOrder;
}

interface SearchDetail {
  key?: string;
  value?: string;
}

interface SortListObject {
  columnName?: string;
  sortType?: string;
}

/**
 * Filter items by a date field within an optional start and end date range
 *
 * @example
 * filterByDateRange(items, 'createdAt', '2024-01-01', '2024-12-31')
 */
export const filterByDateRange = <T>(
  items: T[],
  field: keyof T,
  startDate?: string | Date,
  endDate?: string | Date
): T[] => {
  if (!startDate && !endDate) return items;

  return items.filter((item) => {
    const fieldValue = item[field];
    if (!fieldValue) return false;

    const itemDate = dayjs(fieldValue as string);
    if (!itemDate.isValid()) return false;

    if (startDate) {
      const start = dayjs(startDate);
      if (start.isValid() && itemDate.isBefore(start.startOf('day'))) return false;
    }

    if (endDate) {
      const end = dayjs(endDate);
      if (end.isValid() && itemDate.isAfter(end.endOf('day'))) return false;
    }

    return true;
  });
};

/**
 * Filter items by a numeric field within an optional min and max value range
 *
 * @example
 * filterByNumberRange(items, 'age', 18, 65)
 */
export const filterByNumberRange = <T>(
  items: T[],
  field: keyof T,
  minValue?: number,
  maxValue?: number
): T[] => {
  if (minValue === undefined && maxValue === undefined) return items;

  return items.filter((item) => {
    const itemValue = Number(item[field]) || 0;

    if (minValue !== undefined && maxValue !== undefined) {
      return itemValue >= minValue && itemValue <= maxValue;
    } else if (minValue !== undefined) {
      return itemValue >= minValue;
    } else if (maxValue !== undefined) {
      return itemValue <= maxValue;
    }
    return true;
  });
};

/**
 * Filter items where a field value matches one of the selected values
 * Useful for dropdown/multi-select filters
 *
 * @example
 * filterByFieldInList(items, 'status', ['active', 'pending'])
 * filterByFieldInList(items, 'categoryId', [1, 2, 3])
 */
export const filterByFieldInList = <T>(
  items: T[],
  field: keyof T,
  selectedValues: (string | number | boolean)[]
): T[] => {
  if (!Array.isArray(selectedValues) || selectedValues.length === 0) {
    return items;
  }

  return items.filter((item) => {
    const fieldValue = item[field];
    if (fieldValue === undefined || fieldValue === null) return false;

    return selectedValues.some((selectedValue) => {
      if (selectedValue === null || selectedValue === undefined) return false;
      return String(selectedValue) === String(fieldValue);
    });
  });
};

/**
 * Filter items by exact field value match
 *
 * @example
 * filterByFieldValue(items, 'isActive', true)
 * filterByFieldValue(items, 'type', 'premium')
 */
export const filterByFieldValue = <T>(
  items: T[],
  field: keyof T,
  value: unknown
): T[] => {
  if (value === undefined || value === null) return items;

  return items.filter((item) => item[field] === value);
};

/**
 * Case-insensitive substring search on a specific field
 *
 * @example
 * filterBySearch(items, 'name', 'john')
 */
export const filterBySearch = <T>(
  items: T[],
  searchKey?: string,
  searchValue?: string
): T[] => {
  if (!searchKey || !searchValue) return items;

  const searchLower = searchValue.toLowerCase();
  return items.filter((item) => {
    const fieldValue = item[searchKey as keyof T];
    return fieldValue && String(fieldValue).toLowerCase().includes(searchLower);
  });
};

/**
 * Case-insensitive substring search across multiple fields
 *
 * @example
 * filterBySearchMultipleFields(items, ['name', 'email', 'phone'], 'john')
 */
export const filterBySearchMultipleFields = <T>(
  items: T[],
  fields: (keyof T)[],
  searchValue?: string
): T[] => {
  if (!searchValue || fields.length === 0) return items;

  const searchLower = searchValue.toLowerCase();
  return items.filter((item) => {
    return fields.some((field) => {
      const fieldValue = item[field];
      return fieldValue && String(fieldValue).toLowerCase().includes(searchLower);
    });
  });
};

/**
 * Sort items by one or more fields with ascending or descending order
 *
 * @example
 * sortItems(items, { key: 'name', order: 'asc' })
 * sortItems(items, [{ key: 'status', order: 'desc' }, { key: 'name', order: 'asc' }])
 */
export const sortItems = <T>(items: T[], sortConfig: SortConfig | SortConfig[]): T[] => {
  const sortedItems = [...items];
  const sorts = Array.isArray(sortConfig) ? sortConfig : [sortConfig];

  if (sorts.length === 0) return sortedItems;

  sortedItems.sort((a, b) => {
    for (const sort of sorts) {
      const aValue = a[sort.key as keyof T];
      const bValue = b[sort.key as keyof T];

      if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return sortedItems;
};

/**
 * Normalize sort list from various formats to SortConfig array
 * Handles both array format and single object format
 */
export const normalizeSortList = (
  sortList: SortConfig[] | SortListObject | undefined
): SortConfig[] => {
  if (!sortList) return [];

  if (Array.isArray(sortList)) {
    return sortList.map((s) => ({ key: s.key, order: s.order }));
  }

  if (typeof sortList === 'object' && sortList.columnName) {
    const order: SortOrder =
      (sortList.sortType || 'ASC').toLowerCase() === 'asc' ? 'asc' : 'desc';
    return [{ key: sortList.columnName, order }];
  }

  return [];
};

/**
 * Paginate items array
 *
 * @example
 * paginateItems(items, 1, 10) // First page, 10 items per page
 */
export const paginateItems = <T>(
  items: T[],
  page: number,
  itemsPerPage: number
): { data: T[]; totalItems: number; totalPages: number; currentPage: number } => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    currentPage: page,
    data: items.slice(startIndex, endIndex),
    totalItems,
    totalPages,
  };
};

export type { SortConfig, SortOrder, SearchDetail, SortListObject };
