/**
 * Segment-boundary prefix match for query-key invalidation.
 *
 * Query keys are built by `makeQueryKey` as `[url, ...deps, ...params]`, so
 * `key[0]` is always the request URL (e.g. "operations/accounts/" or
 * "directions/5/statistics/"). Endpoints passed to `invalidateByPatternMatch`
 * are path prefixes ("operations/accounts", "directions").
 *
 * A plain substring `.includes()` over-matches: "team/members" would also
 * invalidate "team/members-pending". This matcher only matches on path-segment
 * boundaries, so a prefix invalidates that URL and its sub-resources but not
 * sibling URLs that merely share a string prefix.
 */
const stripTrailingSlash = (s: string) => s.replace(/\/+$/, "")

export const queryKeyMatchesEndpoint = (
    key0: unknown,
    endpoint: string,
): boolean => {
    if (typeof key0 !== "string") return false
    const key = stripTrailingSlash(key0)
    const prefix = stripTrailingSlash(endpoint)
    return key === prefix || key.startsWith(prefix + "/")
}
