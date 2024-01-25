import auth from "@/api/middlewares/auth"
import { validate } from "@/api/middlewares/validate"
import mw from "@/api/mw"
import { postIdValidator, commentContentValidator } from "@/utils/validators"

const handle = mw({
  POST: [
    auth,
    validate({
      body: {
        content: commentContentValidator,
        postId: postIdValidator,
      },
    }),
    async ({ session, models: { CommentModel }, input: { body }, res }) => {
      const userId = session.id

      try {
        const newComment = await CommentModel.query()
          .insertAndFetch({
            userId,
            postId: body.postId,
            content: body.content,
          })
          .withGraphFetched("user")

        res.status(201).json(newComment)
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
      }
    },
  ],
})


export default handle
