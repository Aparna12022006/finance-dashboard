import { useState, useEffect, useRef } from 'react'

export const useAnimatedNumber = (target, duration = 800) => {
    const [value, setValue] = useState(0)
    const startRef = useRef(null)
    const rafRef = useRef(null)
    const prevTarget = useRef(0)

    useEffect(() => {
        const from = prevTarget.current
        prevTarget.current = target
        startRef.current = null

        const animate = (ts) => {
            if (!startRef.current) startRef.current = ts
            const elapsed = ts - startRef.current
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(from + (target - from) * eased))
            if (progress < 1) rafRef.current = requestAnimationFrame(animate)
        }

        rafRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(rafRef.current)
    }, [target, duration])

    return value
}