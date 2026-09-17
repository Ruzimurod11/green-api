import { API } from "@/lib/constants/api-endpoints"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeyMatchesEndpoint } from "./query-key-match"

export const useRevalidate = () => {
    const queryClient = useQueryClient()

    const invalidateByPatternMatch = (endpoints: string[]) => {
        endpoints.forEach((endpoint) => {
            queryClient.invalidateQueries({
                predicate: (q) =>
                    queryKeyMatchesEndpoint(q.queryKey[0], endpoint),
                type: "all",
                refetchType: "all",
            })
        })
    }

    const invalidateByExactMatch = (endpoints: string[]) => {
        endpoints.forEach((endpoint) => {
            queryClient.invalidateQueries({
                queryKey: [endpoint],
                type: "all",
                refetchType: "all",
            })
        })
    }

    const invalidateProfile = () => {
        queryClient.invalidateQueries({
            queryKey: [API.USER.PROFILE.INDEX],
        })
    }

    return {
        invalidateByExactMatch,
        invalidateByPatternMatch,
        queryClient,
        invalidateProfile,
    }
}
