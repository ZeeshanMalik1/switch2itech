import React from 'react'
import { Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/button'

const NotFound = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
            <div className="relative mb-8">
                <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full scale-150 animate-pulse"></div>
                <AlertCircle size={120} className="relative text-primary animate-bounce-slow" strokeWidth={1} />
            </div>

            <h1 className="text-8xl font-black text-foreground tracking-tighter mb-4">404</h1>

            <div className="max-w-md space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Lost in the Digital Void?</h2>
                <p className="text-muted-foreground">
                    The page you're searching for has either been moved, deleted, or never existed in this dimension.
                </p>
            </div>

            <div className="mt-10">
                <Button asChild size="lg" className="rounded-2xl px-8 py-7 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    <Link to="/" className="flex items-center gap-2">
                        <Home size={20} />
                        Return to Dashboard
                    </Link>
                </Button>
            </div>

            <div className="mt-20 flex gap-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-30">
                <span>Switch2itech</span>
                <span>•</span>
                <span>Secure Protocol</span>
                <span>•</span>
                <span>v2.0.4</span>
            </div>
        </div>
    )
}

export default NotFound
