import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

// `motion/react`ni mock qilamiz — framer'ning animatsiya ichki mexanizmi (rAF,
// style interpolatsiya) jsdom'da ishonchsiz. Buning o'rniga `motion.div`ga
// uzatilgan props'ni data-atributlarga yozib, FadeIn'ning O'Z logikasini
// (reduced-motion branch, delay, prop forwarding) tekshiramiz.
const reduceMotion = vi.fn(() => false)
vi.mock("motion/react", () => ({
    useReducedMotion: () => reduceMotion(),
    /* eslint-disable @typescript-eslint/no-explicit-any */
    motion: {
        div: ({ initial, animate, transition, children, ...rest }: any) => (
            <div
                data-initial={JSON.stringify(initial)}
                data-animate={JSON.stringify(animate)}
                data-transition={JSON.stringify(transition)}
                {...rest}
            >
                {children}
            </div>
        ),
    },
    /* eslint-enable @typescript-eslint/no-explicit-any */
}))

import { FadeIn } from "./reveal-motion"

describe("FadeIn", () => {
    beforeEach(() => {
        reduceMotion.mockReturnValue(false)
    })

    it("renders children and forwards arbitrary props to the element", () => {
        render(
            <FadeIn className="my-class" data-testid="wrap">
                <span>salom</span>
            </FadeIn>,
        )

        const el = screen.getByTestId("wrap")
        expect(el).toHaveClass("my-class")
        expect(screen.getByText("salom")).toBeInTheDocument()
    })

    it("slides up from 16px and fades in by default, ending visible", () => {
        render(<FadeIn data-testid="wrap">x</FadeIn>)
        const el = screen.getByTestId("wrap")

        expect(JSON.parse(el.dataset.initial!)).toEqual({ opacity: 0, y: 16 })
        expect(JSON.parse(el.dataset.animate!)).toEqual({ opacity: 1, y: 0 })

        const transition = JSON.parse(el.dataset.transition!)
        expect(transition.duration).toBe(0.5)
        expect(transition.delay).toBe(0)
    })

    it("passes the stagger delay into the transition without leaking it to the DOM", () => {
        render(
            <FadeIn delay={0.3} data-testid="wrap">
                x
            </FadeIn>,
        )
        const el = screen.getByTestId("wrap")

        expect(JSON.parse(el.dataset.transition!).delay).toBe(0.3)
        // `delay` FadeIn proplari ichida iste'mol qilinadi — DOM'ga sizib
        // chiqmasligi kerak.
        expect(el).not.toHaveAttribute("delay")
    })

    it("skips the initial offset when reduced motion is preferred", () => {
        reduceMotion.mockReturnValue(true)
        render(<FadeIn data-testid="wrap">x</FadeIn>)
        const el = screen.getByTestId("wrap")

        // initial === false → siljishsiz, lekin oxiri baribir ko'rinadigan holat.
        expect(JSON.parse(el.dataset.initial!)).toBe(false)
        expect(JSON.parse(el.dataset.animate!)).toEqual({ opacity: 1, y: 0 })
    })
})
