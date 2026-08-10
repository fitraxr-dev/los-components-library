/**
 * Maps orderType values from API response to database values
 *
 * API Response values: NEW, NEW_FROM_EXISTING_FACILITY, EXISTING
 * Database values: NEW, New From Existing Facility
 */

/**
 * Maps an orderType value from API response to database value
 * @param orderType - The orderType value from API response
 * @returns The mapped orderType value for database
 */
export const mapOrderTypeToDatabase = (orderType: string): string => {
  if (orderType === 'NEW') {
    return 'NEW';
  }

  if (orderType === 'NEW_FROM_EXISTING_FACILITY' || orderType === 'EXISTING') {
    return 'New From Existing';
  }

  // Return original value if no mapping found
  return orderType;
};
