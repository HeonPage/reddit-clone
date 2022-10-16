import axios from 'axios'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import { Post } from '../../../types'

const PostCreate = () => {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")

    const router = useRouter()
    const { sub: subName } = router.query

    const submitPost = async (e: FormEvent) => {
        e.preventDefault()

        if (title.trim() === "" || !subName) return

        try {
            const { data: post } = await axios.post<Post>("/posts", {
                title: title.trim(),
                body, sub: subName
            })
            router.push(`/r/${subName}/${post.identifier}/${post.slug}`)
        } catch (error) {
            console.log(error)

        }
    }

    return (
        <div className='flex flex-col justify-center pt-16'>
            <div className='w-10/12 mx-auto md:w-96 '>
                <div className='p-4 bg-white rounded'>
                    <h1 className='mb-3 text-lg'>포스트 생성하기</h1>
                    <form onSubmit={submitPost}>
                        <div className='mb-3 relative'>
                            <input
                                type="text"
                                className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                                placeholder='제목'
                                maxLength={20}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <div
                                style={{ top: 10, right: 10 }}
                                className="absolute mb-2 text-sm text-gray-400 select-none"
                            >
                                /20
                            </div>
                        </div>
                        <textarea
                            rows={4}
                            placeholder='설명'
                            className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                        <div className='flex justify-end'>
                            <button className='px-4 py-2 text-sm font-semibold text-white bg-gray-400 border rounded'>
                                생성하기
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostCreate


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        const cookie = req.headers.cookie
        console.log('cookie', cookie)
        // 쿠키가 없다면 에러를 보내기
        if (!cookie) throw new Error("Missing auth token cookie")

        // 쿠키가 있다면 그 쿠키를 이용해서 백엔드에서 인증 처리하기 
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`,
            { headers: { cookie } })
        return { props: {} }

    } catch (error) {
        res.writeHead(307, { Location: "/login" }).end()
        return { props: {} }
    }

}
