import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "@/web/components/SessionContext"

const withAuth = (WrappedComponent, adminRequired = false) => {
  const WithAuthComponent = (props) => {
    const router = useRouter()
    const { session } = useSession()
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
      if (!session) {
        router.push("/sign-in")
      } else if (adminRequired && session.role !== "admin") {
        router.push("/")
      } else {
        setLoading(false)
      }
    }, [session, router])

    if (isLoading) {
      return <p>Loading...</p>
    }

    return <WrappedComponent {...props} />
  }

  WithAuthComponent.displayName = `WithAuth(${getDisplayName(
    WrappedComponent,
  )})`

  return WithAuthComponent
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component"
}

export default withAuth
