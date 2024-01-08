import auth from "@/api/middlewares/auth"
import { validate } from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  postIdValidator,
  postTitleValidator,
  postContentValidator,
} from "@/utils/validators"

const handle = mw({
  GET: [
    validate({
      query: {
        postId: postIdValidator,
      },
    }),
    async ({
      models: { PostModel },
      input: {
        query: { postId },
      },
      res,
    }) => {
      const post = await PostModel.query().findById(postId).throwIfNotFound()
      res.send(post)
    },
  ],
  PATCH: [
    auth,
    validate({
      query: {
        postId: postIdValidator,
      },
      body: {
        title: postTitleValidator.optional(),
        content: postContentValidator.optional(),
      },
    }),
    async ({
      models: { PostModel },
      input: {
        body,
        query: { postId },
      },
      res,
    }) => {
      const updatedPost = await PostModel.query().patchAndFetchById(
        postId,
        body,
      )
      res.send(updatedPost)
    },
  ],
  DELETE: [
    auth,
    validate({
      query: {
        postId: postIdValidator,
      },
    }),
    async ({
      models: { PostModel },
      input: {
        query: { postId },
      },
      res,
    }) => {
      await PostModel.query().deleteById(postId)
      res.status(204).send({})
    },
  ],
})

export default handle
