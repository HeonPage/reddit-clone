import axios from 'axios'
import Link from 'next/link'
import React from 'react'
import { useAuthDispatch, useAuthState } from '../context/auth'

const NavBar = () => {
    const { loading, authenticated } = useAuthState()
    const dispatch = useAuthDispatch()
    const handlerLogOut = () => {
        axios.post("/auth/logout")
            .then(() => {
                dispatch("LOGOUT")
                window.location.reload()
            })
            .catch((err) => {
                console.log(err)
            })
    }
    return (
        <div className='fixed inset-x-0 top-0 z-10 flex items-center justify-between h-16 px-5 bg-white'>
            <span className='text-2xl font-semibold text-gray-400'>
                <Link href="/">Community</Link>
            </span>
            <div className='max-w-full px-4'>
                <div className='relative flex items-center gb-gray-100 border rounded hover:border-gray-700 hover:bg-white'>
                    <input
                        type='text'
                        placeholder='Search..'
                        className='px-3 py-1 bg-transparent rounded focus:outline-none '
                    />

                </div>
            </div>
            <div className='flex'>
                {!loading && (
                    authenticated
                        ?
                        (<button onClick={handlerLogOut} className='w-20 p-2 mr-2 text-center text-white bg-gray-400 rounded'>
                            로그아웃
                        </button>)
                        : (<>
                            <Link href='/login'>
                                <a className='w-20 p-2 mr-2 text-center text-blue-500 border border-blue-500 rounded'>
                                    로그인
                                </a>
                            </Link>
                            <Link href='/register'>
                                <a className='w-20 p-2 text-center text-white bg-gray-400 rounded'>
                                    회원가입
                                </a>
                            </Link>
                        </>)
                )}
            </div>
        </div >
    )
}

export default NavBar
