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
const TableRow = ({ post }) => (
  <div className="border-b border-gray-200 hover:bg-gray-100">
    <div className="px-6 py-4 flex items-center">
      <div className="flex-shrink-0 h-10 w-10">
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
          {post.id}
        </div>
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">
          <Link href={`/posts/${post.id}`}>{post.title}</Link>
        </div>
        <div className="text-sm text-gray-500">
          {post.author ? post.author.username : "Unknown Author"} on{" "}
          {formatDateTimeShort(new Date(post.created_at))}
        </div>
      </div>
    </div>
  </div>
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
    <div className="container mx-auto p-4 bg-white shadow rounded-lg">
      {isFetching && <Loader />}
      <div className="divide-y divide-gray-200">
        {posts.map((post) => (
          <TableRow key={post.id} post={post} />
        ))}
      </div>
      <Pagination count={count} page={page} className="mt-8" />
    </div>
  )
}

export default withAuth(IndexPage)
