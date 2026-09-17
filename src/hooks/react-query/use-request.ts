/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/api/axios-instance"
import { onError } from "@/lib/utils/on-error"
import { QueryClient, useMutation } from "@tanstack/react-query"
import type { AxiosProgressEvent, AxiosRequestConfig } from "axios"
import { useState } from "react"
import type { CustomUseMutationOptions, MutateOpts } from "./types"

type Method = "get" | "post" | "put" | "delete" | "patch"
type MutationVariables<P> = {
    url: string
    method: Method
    payload?: P
    params?: any
}

export const useRequest = <P = any, D = any>({
    options,
    config,
    queryClient,
}: {
    options?: CustomUseMutationOptions<D, any, MutationVariables<P>>
    config?: AxiosRequestConfig
    queryClient?: QueryClient
} = {}) => {
    const [uploadProgress, setUploadProgress] = useState(0)
    const mutation = useMutation<D, any, MutationVariables<P>>(
        {
            onError,
            mutationFn: async ({ url, payload, method, params }) => {
                const res = await axiosInstance({
                    url: `${url}`,
                    method,
                    data: payload,
                    params,
                    onUploadProgress: (progressEvent_1: AxiosProgressEvent) => {
                        if (progressEvent_1.total) {
                            const percentCompleted = Math.round(
                                (progressEvent_1.loaded * 100) /
                                    progressEvent_1.total,
                            )
                            setUploadProgress(percentCompleted)
                        }
                    },
                    ...config,
                })
                return res.data
            },
            ...(options || {}),
        },
        queryClient,
    )

    const handleMutate = (
        variables: MutationVariables<P>,
        mutateOptions?: MutateOpts<D, P>,
    ) => {
        mutation.mutate(variables, mutateOptions)
    }
    const handleMutateAsync = (
        variables: MutationVariables<P>,
        mutateOptions?: MutateOpts<D, P>,
    ) => mutation.mutateAsync(variables, mutateOptions)

    const post = (url: string, payload?: P, mutateOptions?: MutateOpts<D, P>) =>
        handleMutate(
            {
                method: "post",
                url,
                payload,
            },
            mutateOptions,
        )

    const postAsync = (
        url: string,
        payload?: P,
        mutateOptions?: MutateOpts<D, P>,
    ) =>
        handleMutateAsync(
            {
                method: "post",
                url,
                payload,
            },
            mutateOptions,
        )

    const put = (url: string, payload?: P, mutateOptions?: MutateOpts<D, P>) =>
        handleMutate(
            {
                method: "put",
                url,
                payload,
            },
            mutateOptions,
        )

    const putAsync = (
        url: string,
        payload?: P,
        mutateOptions?: MutateOpts<D, P>,
    ) =>
        handleMutateAsync(
            {
                method: "put",
                url,
                payload,
            },
            mutateOptions,
        )

    const patch = (
        url: string,
        payload?: P,
        mutateOptions?: MutateOpts<D, P>,
    ) =>
        handleMutate(
            {
                method: "patch",
                url,
                payload,
            },
            mutateOptions,
        )

    const patchAsync = (
        url: string,
        payload?: P,
        mutateOptions?: MutateOpts<D, P>,
    ) =>
        handleMutateAsync(
            {
                method: "patch",
                url,
                payload,
            },
            mutateOptions,
        )

    const remove = (
        url: string,
        payload?: P,
        mutateOptions?: MutateOpts<D, P>,
    ) =>
        handleMutate(
            {
                method: "delete",
                url,
                payload,
            },
            mutateOptions,
        )

    const removeAsync = (
        url: string,
        payload?: P,
        mutateOptions?: MutateOpts<D, P>,
    ) =>
        handleMutateAsync(
            {
                method: "delete",
                url,
                payload,
            },
            mutateOptions,
        )

    const get = (
        url: string,
        paramsOrOptions?: any,
        mutateOptions?: MutateOpts<D, P>,
    ) => {
        // Agar 2-argumentda onSuccess/onError kabi mutate options kelib qolsa:
        const isOptions =
            paramsOrOptions &&
            ("onSuccess" in paramsOrOptions || "onError" in paramsOrOptions)

        return handleMutate(
            {
                method: "get",
                url,
                params: isOptions ? undefined : paramsOrOptions,
            },
            isOptions ? paramsOrOptions : mutateOptions,
        )
    }
    const getAsync = (
        url: string,
        params?: any,
        mutateOptions?: MutateOpts<D, P>,
    ) =>
        handleMutateAsync(
            {
                method: "get",
                url,
                params,
            },
            mutateOptions,
        )

    return {
        ...mutation,
        uploadProgress,
        get,
        getAsync,
        post,
        postAsync,
        put,
        putAsync,
        patch,
        patchAsync,
        remove,
        removeAsync,
    }
}
