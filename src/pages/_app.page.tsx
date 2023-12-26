import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { globalStyles } from "@/styles/globals"
import { HelmetProvider, Helmet } from 'react-helmet-async'
globalStyles()


export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
