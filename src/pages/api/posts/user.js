import auth from "@/api/middlewares/auth"
import mw from "@/api/mw"

const handle = mw({
  GET: [
    auth,
    async ({ models: { PostModel, CommentModel }, session, res }) => {
      const userId = session.id

      try {
        const posts = await PostModel.query().where("authorId", userId)
        const totalComments = await CommentModel.query()
          .count()
          .where("userId", userId)
          .first()
        const totalVisits = await PostModel.query()
          .sum("visitCount as total")
          .where("authorId", userId)
          .first()

        res.send({
          posts,
          totalComments: totalComments.count,
          totalVisits: totalVisits.total,
        })
      } catch (error) {
        res.status(500).send({ error: "Internal Server Error" })
      }
    },
  ],
})

export default handle
