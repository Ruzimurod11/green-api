import ClientTranslate from "@/components/client-translate"
import UncontrolledInput from "@/components/form/uncontrolled-input"
import { Button } from "@/components/ui/button"
import { useRequest } from "@/hooks/react-query/use-request"
import { API } from "@/lib/constants/api-endpoints"
import { useNavigate, useRouter } from "@tanstack/react-router" // 1. useNavigate import qilamiz
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useAuthStore } from "../../-hooks/use-auth-persist"

type Form = {
    idInstance: string
    apiTokenInstance: string
}

interface StateInstanceResponse {
    stateInstance: "authorized" | "notAuthorized" | "blocked" | "starting"
}

export default function SignIn() {
    const { setCredentials } = useAuthStore()
    const { get, isPending } = useRequest()
    const navigate = useNavigate() // 2. Navigate hook'ini chaqiramiz
    const router = useRouter()

    const methods = useForm<Form>({
        disabled: isPending,
        defaultValues: {
            idInstance: "",
            apiTokenInstance: "",
        },
    })

    const onSubmit = methods.handleSubmit((vals) => {
        const id = vals.idInstance.trim()
        const token = vals.apiTokenInstance.trim()

        const endpoint = API.GREEN_API.GET_STATE(id, token)

        get(endpoint, undefined, {
            onSuccess: async (data: StateInstanceResponse) => {
                if (
                    data?.stateInstance === "authorized" ||
                    data?.stateInstance === "notAuthorized"
                ) {
                    // 1. Store'ga saqlaymiz (u avtomatik "green-api-auth" kalitiga yozadi)
                    setCredentials(id, token)
                    toast.success("Muvaffaqiyatli avtorizatsiyadan o'tildi")

                    // 2. Router keshini yangilaymiz va Home'ga o'tamiz
                    await router.invalidate()
                    navigate({ to: "/", replace: true })
                } else {
                    toast.error(
                        "Instansiya holati yaroqsiz: " + data?.stateInstance,
                    )
                }
            },
            onError: () => {
                toast.error("Tekshirishda xatolik yuz berdi")
            },
        })
    })

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#111923] p-4 text-white">
            <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#1a232e] p-8 shadow-2xl">
                <div className="mb-6 flex flex-col items-center gap-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4be06e]/10 border border-[#4be06e]/30">
                        <span className="text-2xl font-bold text-[#4be06e]">
                            G
                        </span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white">
                        GREEN-API
                    </h1>
                    <p className="text-xs text-gray-400">
                        Enter your instance credentials to access console
                    </p>
                </div>

                <form
                    className="flex flex-col gap-5"
                    autoComplete="on"
                    onSubmit={onSubmit}
                    noValidate
                >
                    <div className="space-y-4">
                        <UncontrolledInput
                            methods={methods}
                            name="idInstance"
                            type="text"
                            label="idInstance"
                            placeholder="410022739344"
                            autoComplete="off"
                            showError
                        />

                        <UncontrolledInput
                            methods={methods}
                            name="apiTokenInstance"
                            type="password"
                            label="apiTokenInstance"
                            placeholder="••••••••••••••••••••••••"
                            autoComplete="off"
                            showError
                        />
                    </div>

                    <Button
                        type="submit"
                        isLoading={isPending}
                        className="mt-2 w-full bg-[#4be06e] font-semibold text-[#111923] hover:bg-[#3cd05e] transition-colors"
                    >
                        <ClientTranslate translationKey="login" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
