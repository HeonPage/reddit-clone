import React, { FormEvent, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuthDispatch } from '../context/auth'
import InputGroup from '../components/inputGroup'

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState<any>({})

    const dispatch = useAuthDispatch()

    let router = useRouter()
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault() // 페이지 리프레시 방지
        try {
            //백엔드에 회원가입을 위한 요청 및 회원가입 후 로그인 페이지로 이동
            const res = await axios.post(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api/auth/login',
                {
                    password,
                    username
                },
                {
                    withCredentials: true
                }
            )
            dispatch("LOGIN", res.data?.user)
            router.push('/')
            console.log('res', res)
            // router.push("/login")
        } catch (error: any) {
            console.log('error', error)
            setErrors(error.response.data || {})
        }
    }

    return (
        <div className='bg-white'>
            <div className='flex flex-col items-center justify-center h-screen p-6'>
                <div className='w-10/12 mx-aut md:w-96'>
                    <h1 className='mb-2 text-lg font-medium'>로그인</h1>
                    <form onSubmit={handleSubmit}>
                        <InputGroup
                            placeholder='UserName'
                            value={username}
                            setValue={setUsername}
                            error={errors.username}
                        />
                        <InputGroup
                            placeholder='Password'
                            value={password}
                            setValue={setPassword}
                            error={errors.password}
                        />
                        <button className='w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded'>
                            로그인
                        </button>
                    </form>
                    <small>
                        아직 아이디가 없나요?
                        <Link href="/register">
                            <a className='ml-1 text-blue-500 uppercase'>
                                회원가입
                            </a>
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    )
}

export default Login
