/** Configuration used for @see filterStrings. */
export interface FilterStringsConfig {
  /** Determines if search should care about casing. (default: false) */
  caseInsensitive: boolean;
  /** What way to try to find the filter string in the item. (default: 'equals') */
  mode: 'contains' | 'endsWith' | 'equals' | 'startsWith';
}

/** Default configuration used for @see filterStrings. */
export const defaultFilterStringsConfig: Required<FilterStringsConfig> = {
  caseInsensitive: false,
  mode: 'equals'
};

/**
 * Filters an array of strings.
 * @param Strings to filter down.
 * @param Value used to determine whether a string should be kept.
 * @param Config used to determine how to filter.
 * @returns Filtered strings.
 */
export function filterStrings<TConfKeys extends keyof(FilterStringsConfig)>(
  items: string[],
  filterValue: string,
  filterConfig?: Pick<FilterStringsConfig, TConfKeys> | null
): string[] {
  if (!(items instanceof Array)) { return []; }

  // assign the config values onto the defualt config
  const config = Object.assign({}, defaultFilterStringsConfig, filterConfig);

  // if mode is not equals or filter is case insensitive, then cast the filter value to a string
  filterValue = (config.caseInsensitive) ? filterValue.toLowerCase() : filterValue;

  const result = items.filter(item => {
    item = (config.caseInsensitive) ? item.toLowerCase() : item;
    if (config.mode === 'equals') {
      return item === filterValue;
    }

    const compareMethod = (config.mode === 'contains') ? 'includes' : config.mode;

    return item[compareMethod](filterValue);
  });

  return result;
}