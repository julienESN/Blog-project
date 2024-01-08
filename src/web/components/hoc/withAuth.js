import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "@/web/components/SessionContext"

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter()
    const { session } = useSession()
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
      if (!session && !isLoading) {
        router.push("/sign-in")
      } else {
        setLoading(false)
      }
    }, [session, isLoading, router])

    if (isLoading) {
      return <p>Loading...</p>
    }

    return <WrappedComponent {...props} />
  }
}

export default withAuth
