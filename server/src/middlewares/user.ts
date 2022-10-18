import { NextFunction, Request, Response } from "express"
import { User } from "../entities/User"
import jwt from "jsonwebtoken"

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        //요청의 쿠키에 담겨있는 토큰을 가져오기
        const token = req.cookies.token
        if (!token) return next()
        // verify 메소드와 jwt secret을 이용해서 토큰 Decode
        const { username }: any = jwt.verify(token, process.env.JWT_SECRET)

        // 토큰에서 나온 유저 이름을 이용해서 유저 정보 데이터 베이스에서 가져오기
        const user = await User.findOneBy({ username })
        if (!User) throw new Error("Unauthenticated")
        // console.log(user)

        // 유저 정보를 res.local.user에 넣어주기
        res.locals.user = user
        return next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: "Something went wrong" })
    }
}