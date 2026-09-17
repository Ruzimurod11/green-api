import placeHolderImg from "@/assets/images/placeholder.jpg"
import { cn } from "@/lib/utils/shadcn"
import { useState } from "react"

type Props = React.ImgHTMLAttributes<HTMLImageElement>
export default function Img({ className, src, ...props }: Props) {
    const [isLoading, setIsLoading] = useState(true)

    // crossOrigin="anonymous" faqat canvas/pixel o'qish kerak bo'lganda muhim.
    // Telegram userpic (t.me → telesco.pe redirect) zanjirida CORS header
    // bermaydi, shuning uchun bu hostlarga crossOrigin qo'ymaymiz — aks holda
    // rasm bloklanib, placeholder chiqib qoladi.
    const skipCors =
        !src ||
        src.includes("://cdn") ||
        src.includes("t.me/") ||
        src.includes("telesco.pe")

    return (
        <img
            onError={({ currentTarget }) => {
                currentTarget.onerror = null // prevents looping
                currentTarget.src = placeHolderImg
            }}
            onLoad={() => {
                setIsLoading(false)
            }}
            loading="lazy"
            className={cn(
                "duration-300 delay-75 ease-in-out rounded-md object-cover",
                isLoading ?
                    "scale-105 blur-sm grayscale"
                :   "scale-100 blur-0 grayscale-0",
                className,
            )}
            src={src || placeHolderImg}
            crossOrigin={skipCors ? undefined : "anonymous"}
            {...props}
        />
    )
}
