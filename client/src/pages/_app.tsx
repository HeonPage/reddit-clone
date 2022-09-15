import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Axios from 'axios'
import { AuthProvider } from '../context/auth'
import { useRouter } from 'next/router'
import NavBar from '../components/NavBar'

function MyApp({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api"
  Axios.defaults.withCredentials = true

  const { pathname } = useRouter();
  const autheRoutes = ["/register", "/login"]
  const authRoute = autheRoutes.includes(pathname)
  return (
    <AuthProvider>
      {!authRoute && <NavBar />}
      <div className={authRoute ? "" : "pt-12"}>
        <Component {...pageProps} />

      </div>
    </AuthProvider >
  )
}

export default MyApp
