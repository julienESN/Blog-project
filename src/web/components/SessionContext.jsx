import config from "@/web/config"
import apiClient from "@/web/services/apiClient"
import jsonwebtoken from "jsonwebtoken"
import { createContext, useContext, useEffect, useState } from "react"

const SessionContext = createContext()

export const useSession = () => {
  const session = useContext(SessionContext)

  return session
}

export const SessionProvider = (props) => {
  const [session, setSession] = useState(null)
  const saveSessionToken = (jwt) => {
    localStorage.setItem(config.security.session.storageKey, jwt)
    const { payload } = jsonwebtoken.decode(jwt)
    setSession(payload)
  }
  const signOut = () => {
    localStorage.removeItem(config.security.session.storageKey)

    apiClient.delete("/sessions")

    setSession(null)
  }

  useEffect(() => {
    const jwt = localStorage.getItem(config.security.session.storageKey)

    if (jwt) {
      const { payload } = jsonwebtoken.decode(jwt)
      setSession(payload)
    } else {
      // eslint-disable-next-line no-console
      console.log("No JWT found in localStorage")
    }
  }, [])

  return (
    <SessionContext.Provider
      {...props}
      value={{
        session,
        signOut,
        saveSessionToken,
      }}
    />
  )
}
