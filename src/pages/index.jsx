import { formatDateTimeShort } from "@/utils/formatters"
import Loader from "@/web/components/ui/Loader"
import Pagination from "@/web/components/ui/Pagination"
import apiClient from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import withAuth from "@/web/components/hoc/withAuth"
import Link from "next/link"
export const getServerSideProps = async ({ query: { page } }) => {
  const data = await apiClient("/posts", { params: { page } })

  return {
    props: { initialData: data },
  }
}
const TableHeader = () => (
  <thead>
    <tr>
      {["#", "Title", "Author", "Created At", ""].map((label) => (
        <td key={label} className="p-4 bg-slate-300 text-center font-semibold">
          {label}
        </td>
      ))}
    </tr>
  </thead>
)
const TableRow = ({ post }) => (
  <tr className="even:bg-slate-100">
    <td className="p-4">
      <Link href={`/posts/${post.id}`}>{post.id}</Link>
    </td>
    <td className="p-4">
      <Link href={`/posts/${post.id}`}>{post.title}</Link>
    </td>
    <td className="p-4">
      <Link href={`/posts/${post.id}`}>
        {post.author ? post.author.username : "Unknown Author"}
      </Link>
    </td>
    <td className="p-4">
      <Link href={`/posts/${post.id}`}>
        {formatDateTimeShort(new Date(post.created_at))}
      </Link>
    </td>
  </tr>
)
const IndexPage = ({ initialData }) => {
  const { query } = useRouter()
  const page = Number.parseInt(query.page || 1, 10)
  const { isFetching, data } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => apiClient("/posts", { params: { page } }),
    initialData,
  })
  const posts = data?.result || []
  const count = data?.meta?.count || 0

  return (
    <div className="relative">
      {isFetching && <Loader />}
      <table className="w-full">
        <TableHeader />
        <tbody>
          {posts.map((post) => (
            <TableRow key={post.id} post={post} />
          ))}
        </tbody>
      </table>
      <Pagination count={count} page={page} className="mt-8" />
    </div>
  )
}

export default withAuth(IndexPage)
