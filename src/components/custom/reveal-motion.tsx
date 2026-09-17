import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react"

// Tashqi "wow" hissini bermay, lekin sezilarli bo'lishi uchun — tez (0.5s)
// va yumshoq cubic-bezier (scroll'dagi `Reveal` bilan bir xil egri).
const EASE = [0.22, 1, 0.36, 1] as const

interface FadeInProps extends HTMLMotionProps<"div"> {
    /** Stagger uchun kechikish (soniyada). Ketma-ket bloklarda oshirib boring. */
    delay?: number
}

/**
 * Mount bo'lganda fade + 16px yuqoriga suzib chiqadi. O'zicha ishlaydi —
 * istalgan joyga o'rab qo'ysa bo'ladi va oxiri doimo ko'rinadigan holatda
 * tugaydi. `prefers-reduced-motion` yoqilgan bo'lsa siljishsiz ochiladi.
 */
export function FadeIn({ delay = 0, ...props }: FadeInProps) {
    const reduce = useReducedMotion()
    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay }}
            {...props}
        />
    )
}
