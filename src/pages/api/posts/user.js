import auth from "@/api/middlewares/auth"
import mw from "@/api/mw"

const handle = mw({
  GET: [
    auth,
    async ({ models: { PostModel }, session, res }) => {
      const userId = session.id

      try {
        const posts = await PostModel.query().where("authorId", userId)
        res.send(posts)
      } catch (error) {
        res.status(500).send({ error: "Internal Server Error" })
      }
    },
  ],
})

export default handle
