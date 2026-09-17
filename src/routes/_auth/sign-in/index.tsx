import { createFileRoute } from "@tanstack/react-router"
import SignIn from "./-components"

export const Route = createFileRoute("/_auth/sign-in/")({
    component: SignIn,
})
