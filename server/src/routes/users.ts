import { Request, Response, Router } from "express";
import userMiddleware from '../middlewares/user'
import authMiddleware from '../middlewares/auth'

const getUserData = (req: Request, res: Response) => {
    try {
        //유저 정보 가져오기

    } catch (error) {

    }
}


const router = Router()
router.get('/:username', userMiddleware, getUserData)
export default router