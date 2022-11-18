import '../styles/globals.css'
import '../styles/tailwind.css'
import type { AppProps } from 'next/app'
import Axios from 'axios'
import { AuthProvider } from '../context/auth'
import { useRouter } from 'next/router'
import NavBar from '../components/NavBar'
import { SWRConfig } from 'swr'
import axios from 'axios'
import Head from 'next/head'


function MyApp({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api"
  Axios.defaults.withCredentials = true

  const { pathname } = useRouter()
  const autheRoutes = ["/register", "/login"]
  const authRoute = autheRoutes.includes(pathname)

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url)
      return res.data
    } catch (error: any) {
      throw error.response.data
    }
  }
  return (
    <>
      <Head>
        <script defer src="https://use.fontawesome.com/releases/v6.1.1/js/all.js" integrity="sha384-xBXmu0dk1bEoiwd71wOonQLyH+VpgR1XcDH3rtxrLww5ajNTuMvBdL5SOiFZnNdp" crossOrigin="anonymous"></script>
      </Head>
      <SWRConfig value={{ fetcher }}>
        <AuthProvider>
          {!authRoute && <NavBar />}
          <div className={authRoute ? "" : "pt-12 bg-gray-200 min-h-screen"}>
            <Component {...pageProps} />

          </div>
        </AuthProvider >
      </SWRConfig>
    </>
  )
}

export default MyApp
