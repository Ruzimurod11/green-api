import { API } from "@/lib/constants/api-endpoints"
import { CookieService } from "@/lib/utils/cookie-service"
import type { IProfile } from "@/types/profile"
import { useGet } from "./use-get"
import { useRevalidate } from "./use-revalidate"

export const useProfileQuery = () => {
    const { queryClient } = useRevalidate()
    const accessToken = CookieService.getAccessToken()
    const res = useGet<IProfile>(API.USER.PROFILE.INDEX, {
        options: {
            enabled: !!accessToken,
        },
    })
    const isAuthenticated =
        !res.error && !!Object.entries(res.data || {}).length && res.isFetched
    const updateProfileQueryCache = (vals: Partial<IProfile>) => {
        queryClient.setQueryData([API.USER.PROFILE.INDEX], (prev) =>
            prev ? { ...prev, ...vals } : prev,
        )
    }

    return { ...res, isAuthenticated, updateProfileQueryCache }
}
