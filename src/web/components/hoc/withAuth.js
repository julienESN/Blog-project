import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "@/web/components/SessionContext"

const withAuth = (WrappedComponent, adminRequired = false) => {
  return (props) => {
    const router = useRouter()
    const { session } = useSession()
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
      if (!session) {
        router.push("/sign-in")
      } else if (adminRequired && session.role !== "admin") {
        router.push("/") // ou vers une page 'Non autorisé'
      } else {
        setLoading(false)
      }
    }, [session, router, adminRequired])

    if (isLoading) {
      return <p>Loading...</p>
    }

    return <WrappedComponent {...props} />
  }
}

export default withAuth
