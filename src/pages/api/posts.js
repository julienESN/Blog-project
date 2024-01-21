import auth from "@/api/middlewares/auth"
import { validate } from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  postTitleValidator,
  postContentValidator,
  pageValidator,
} from "@/utils/validators"
import config from "@/web/config"

const handle = mw({
  POST: [
    auth,
    validate({
      body: {
        title: postTitleValidator,
        content: postContentValidator,
      },
    }),
    async ({ session, models: { PostModel }, input: { body }, res }) => {
      try {
        const newPost = await PostModel.query().insertAndFetch({
          ...body,
          authorId: session.id,
        })
        res.status(201).send(newPost)
      } catch (error) {
        res.status(500).send({ error: "Internal Server Error" })
      }
    },
  ],
  GET: [
    validate({
      query: {
        page: pageValidator.optional(),
      },
    }),
    async ({
      models: { PostModel },
      input: {
        query: { page },
      },
      res,
    }) => {
      const query = PostModel.query()
      const posts = await query
        .clone()
        .withGraphFetched("author")
        .orderBy("created_at", "DESC")
        .limit(config.ui.itemsPerPage)
        .offset((page - 1) * config.ui.itemsPerPage)
      const [{ count }] = await query.clone().count()

      res.send({
        result: posts,
        meta: {
          count,
        },
      })
    },
  ],
})

export default handle
