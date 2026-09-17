/**
 * Page size used by selector/list queries that need the full set in one request
 * (dropdowns, pickers, aggregations) rather than paginating through the UI.
 * Centralized so the "fetch everything" page size can be tuned in one place.
 */
export const PAGE_SIZE_ALL = 100
