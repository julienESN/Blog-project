import { formatDateTimeShort } from "@/utils/formatters"
import Loader from "@/web/components/ui/Loader"
import Pagination from "@/web/components/ui/Pagination"
import apiClient from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import withAuth from "@/web/components/hoc/withAuth"

export const getServerSideProps = async ({ query: { page } }) => {
  const data = await apiClient("/posts", { params: { page } })

  return {
    props: { initialData: data },
  }
}
const IndexPage = ({ initialData }) => {
  const { query } = useRouter()
  const page = Number.parseInt(query.page || 1, 10)
  const {
    isFetching,
    data: {
      result: posts,
      meta: { count },
    },
  } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => apiClient("/posts", { params: { page } }),
    initialData,
  })

  return (
    <div className="relative">
      {isFetching && <Loader />}
      <table className="w-full">
        <thead>
          <tr>
            {["#", "Title", "Author", "Created At", ""].map((label) => (
              <td
                key={label}
                className="p-4 bg-slate-300 text-center font-semibold"
              >
                {label}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {posts.map(({ id, title, author, created_at }) => (
            <tr key={id} className="even:bg-slate-100">
              <td className="p-4">{id}</td>
              <td className="p-4">{title}</td>
              <td className="p-4">
                {author ? author.username : "Auteur inconnu"}
              </td>
              <td className="p-4">
                {formatDateTimeShort(new Date(created_at))}
              </td>
              <td className="p-4"></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} page={page} className="mt-8" />
    </div>
  )
}

export default withAuth(IndexPage)
