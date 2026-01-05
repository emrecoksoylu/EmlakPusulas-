
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function SplashIntro({ onComplete }: { onComplete: () => void }) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onComplete, 1000) // Match exit animation duration
        }, 3500)

        return () => clearTimeout(timer)
    }, [onComplete])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
                >
                    {/* Maritime Themed Gradient Background */}
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 5 }}
                        className="absolute inset-0 bg-gradient-to-br from-[#004e92] via-[#000428] to-[#004e92] bg-[length:200%_200%]"
                        style={{
                            backgroundSize: '200% 200%',
                            animation: 'wave 15s ease infinite'
                        }}
                    />

                    {/* Subtle Sea Waves Effect (CSS) */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
                    </div>

                    <div className="relative text-center z-10">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-widest mb-4">
                                Emlak<span className="text-blue-400">Pusulası</span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 1 }}
                        >
                            <p className="text-xl md:text-2xl text-blue-100 font-light italic tracking-wide">
                                Size dair her şey...
                            </p>
                        </motion.div>

                        {/* Animated Underline */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
                            className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mt-6 mx-auto"
                            style={{ maxWidth: '300px' }}
                        />
                    </div>

                    <style jsx>{`
                        @keyframes wave {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
