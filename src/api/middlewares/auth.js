import { ForbiddenError } from "@/api/errors"
import config from "@/config"
import jsonwebtoken from "jsonwebtoken"

const auth = async (ctx) => {
  try {
    const { payload } = jsonwebtoken.verify(
      ctx.req.cookies[config.security.jwt.cookieName],
      config.security.jwt.secret,
    )

    ctx.session = {
      id: payload.id,
      role: payload.role,
    }

    await ctx.next()
  } catch (err) {
    throw new ForbiddenError()
  }
}

export default auth
