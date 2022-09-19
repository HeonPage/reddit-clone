import { Request, Response, Router } from 'express'
import { User } from '../entities/User'
import userMiddleware from '../middlewares/user'
import authMiddleware from '../middlewares/auth'
import jwt from "jsonwebtoken"
import { isEmpty } from 'class-validator'
import { AppDataSource } from '../data-source'
import Sub from '../entities/Sub'
import Post from '../entities/Post'
const createSub = async (req: Request, res: Response, next) => {
  const { name, title, description } = req.body

  // 먼저 Sub을 생성할 수 있는 유저인지 체크를 위해 유저 정보 가져오기(요청에서 보내주는 토큰을 이용)
  const token = req.cookies.token
  if (!token) return next()
  const { username }: any = jwt.verify(token, process.env.JWT_SECRET)

  const user = await User.findOneBy({ username })
  // 유저 정보가 없다면 throw error 
  if (!user) throw new Error("Unauthenticated!")

  // 유저 정보가 있다면 sub 이름과 제목이 이미 있는 것인지 체크
  try {
    let errors: any = {}
    if (isEmpty(name)) errors.name = "이름을 비워둘 수 없습니다."
    if (isEmpty(title)) errors.title = "제목을 비워둘 수 없습니다."

    const sub = await AppDataSource
      .getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name)=:name", { name: name.toLowerCase() })
      .getOne()

    if (sub) errors.name = "서브가 이미 존재합니다."

    if (Object.keys(errors).length > 0) {
      throw errors
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "문제가 발생했습니다" })
  }
  // Sub Instance 생성 후 데이터베이스에 저장

  try {
    const user: User = res.locals.user
    const sub = new Sub()
    sub.name = name
    sub.description = description
    sub.title = title
    sub.user = user

    await sub.save()
    return res.json(sub)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "문제가 발생했습니다" })
  }
  // 저장한 정보 프론트엔드로 전달해주기
}

const topSubs = async (req: Request, res: Response) => {
  try {
    const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn", 'https://www.gravatar.com/avatar?d=mp&f=y')`
    const subs = await AppDataSource
      .createQueryBuilder()
      .select(`s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`)
      .from(Sub, "s")
      .leftJoin(Post, "p", `s.name = p."subName"`)
      .groupBy('s.title, s.name, "imageUrl"')
      .orderBy(`"postCount"`, "DESC")
      .limit(5)
      .execute()
    return res.json(subs)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Something went Wrong" })
  }
}

const router = Router()

router.post("/", userMiddleware, authMiddleware, createSub)
router.get("/sub/topSubs", topSubs)
export default router