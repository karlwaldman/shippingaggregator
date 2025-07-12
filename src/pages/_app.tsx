import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import '@/styles/globals.css'
import { initGA, logPageView } from '@/lib/analytics'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    // Initialize Google Analytics
    initGA()
    
    // Log initial page view
    logPageView(router.pathname)

    // Log page views on route change
    const handleRouteChange = (url: string) => {
      logPageView(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  return <Component {...pageProps} />
}