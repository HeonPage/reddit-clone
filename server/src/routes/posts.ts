import { Request, Response, Router } from "express";
import userMiddleware from '../middlewares/user'
import authMiddleware from '../middlewares/auth'
import Sub from "../entities/Sub";
import Post from "../entities/Post";
import Comment from "../entities/Comment";

const getSub = async (req: Request, res: Response) => {
    const name = req.params.name

    try {
        const sub = await Sub.findOneByOrFail({ name })

        //포스트를 생성한 후에 해당 sub에 속하는 포스트 정보들을 넣어주기
        const posts = await Post.find({
            where: { subName: sub.name },
            order: { createdAt: "DESC" },
            relations: ["comments", "votes"]
        })
        sub.posts = posts
        if (res.locals.user) {
            sub.posts.forEach((p) => p.setUserVote(res.locals.user))
        }
        console.log('sub', sub)
    } catch (error) {

    }

}

const getPost = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params;
    try {
        const post = await Post.findOneOrFail({
            where: { identifier, slug },
            relations: ["sub", "votes"],
        });

        if (res.locals.user) {
            post.setUserVote(res.locals.user);
        }

        return res.send(post);
    } catch (error) {
        console.log(error);
        return res.status(404).json({ error: "게시물을 찾을 수 없습니다.!" });
    }
};

const createPost = async (req: Request, res: Response) => {
    const { title, body, sub } = req.body
    if (title.trim() === "") {
        return res.status(400).json({ title: "제목은 비워둘 수 없습니다." })
    }

    const user = res.locals.user

    try {
        const subRecord = await Sub.findOneByOrFail({ name: sub })
        const post = new Post()

        post.title = title
        post.body = body
        post.user = user
        post.sub = subRecord

        await post.save()

        return res.json(post)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "문제가 발생했습니다." })
    }
}
const getPostComments = async (req: Request, res: Response) => {
    console.log('232323')
    const { identifier, slug } = req.params
    try {
        const post = await Post.findOneByOrFail({ identifier, slug })
        const comments = await Comment.find({
            where: { postId: post.id },
            order: { createdAt: "DESC" },
            relations: ["votes"]
        })

        if (res.locals.user) {
            comments.forEach((c) => c.setUserVote(res.locals.user))
        }
        return res.json(comments)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "문제가 발생했습니다." })
    }

}
const createPostComment = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params
    const body = req.body.body
    try {
        const post = await Post.findOneByOrFail({ identifier, slug })
        const comment = new Comment()
        comment.body = body
        comment.user = res.locals.user
        comment.post = post

        if (res.locals.user) {
            post.setUserVote(res.locals.user)
        }

        await comment.save()
        return res.json(comment)
    } catch (error) {
        console.log(error)
        return res.status(404).json({ error: "게시물을 찾을 수 없습니다." })
    }
}


const router = Router()
router.get("/:identifier/:slug", userMiddleware, getPost)
router.post("/", userMiddleware, authMiddleware, createPost)

router.get("/:identifier/:slug/comments", userMiddleware, getPostComments)
router.post("/:identifier/:slug/comments", userMiddleware, createPostComment)
export default router