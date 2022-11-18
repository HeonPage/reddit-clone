import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
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
    const [navbarOpen, setNavbarOpen] = useState(false)
    return (
        <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-0 navbar-expand-lg bg-white shadow">
            <div className="container flex flex-wrap items-center justify-between">
                <div className='w-full relative flex inset-x-0 top-0 z-10 items-center justify-between h-13 px-5 bg-white'>
                    <span className='pt-1 text-2xl font-semibold text-gray-400'>
                        <Link href="/">
                            <div className='flex flex-row align-bottom'>
                                <a className='hidden md:block'>
                                    <Image
                                        src="/logo.jpg"
                                        alt='logo'
                                        width={60}
                                        height={45}
                                    />
                                </a>
                                <a className='hover:'>
                                    Heonpage
                                </a>
                            </div>
                        </Link>

                    </span>
                    <div className='flex'>
                        {!loading && (
                            authenticated
                                ?
                                (
                                    <>
                                        <div className='w-full px-4 py-2 text-center md:hidden '>
                                            <Link href="/subs/create">
                                                <a className='w-full p-2 text-center text-sm text-white bg-gray-400 rounded'>
                                                    커뮤니티 만들기
                                                </a>
                                            </Link>
                                        </div>
                                        <button
                                            className="cursor-pointer text-xl leading-none px-2 py-1 border border-solid border-transparent rounded bg-transparent block md:hidden outline-none focus:outline-none"
                                            type="button"
                                            onClick={() => setNavbarOpen(!navbarOpen)}
                                        >
                                            <i className="fas fa-bars"></i>
                                        </button>
                                        <button onClick={handlerLogOut} className='hidden w-20 p-2 text-sm text-center text-white bg-gray-400 rounded md:block'>
                                            로그아웃
                                        </button>
                                    </>)
                                : (<>
                                    <Link href='/login'>
                                        <a className='w-20 px-2 pt-1 mr-2 text-sm text-center text-blue-500 border border-blue-500 rounded'>
                                            로그인
                                        </a>
                                    </Link>
                                    <Link href='/register'>
                                        <a className='w-20 px-2 pt-1 text-sm text-center text-white bg-gray-400 rounded'>
                                            회원가입
                                        </a>
                                    </Link>
                                </>)
                        )}
                    </div>
                </div >
                <div className={
                    "px-4 md:flex flex-grow items-center bg-white md:bg-opacity-0 md:shadow-none" +
                    (navbarOpen ? " block" : " hidden")
                }>
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                    <ul className="flex flex-col list-none mr-auto mb-2">
                        <li className="flex items-center py-2">
                            <Link
                                className="text-blueGray-700 px-3 py-4 md:py-2 flex items-center text-xs uppercase font-bold"
                                href="https://www.creative-tim.com/learning-lab/tailwind/react/overview/notus?ref=nr-index-navbar"
                            >
                                <a className='relative flex items-center hover:text-coolGray-500'>
                                    <FaSearch className='mr-2 text-gray-400' />
                                    준비중..
                                </a>
                            </Link>
                        </li>
                        <li className="flex py-2 justify-between">
                            <div>
                            </div>
                            <button onClick={handlerLogOut} className='w-20 p-2 text-sm text-center text-white bg-gray-400 rounded'>
                                로그아웃
                            </button>
                        </li>

                    </ul>
                </div>
            </div>
        </nav >
    )
}

export default NavBar
