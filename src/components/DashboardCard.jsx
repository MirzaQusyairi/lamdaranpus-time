import React from 'react'
import hospital from '../assets/hospital.jpg'
import { useNavigate } from 'react-router-dom'
import FullName from './FullName'


function DashboardCard() {
    const navigate = useNavigate()
    return (
        <div className='mt-[25px]'>
            <div className='flex justify-center mb-[10px]'>
                <FullName />
            </div>
            <div className='flex justify-center'>
                <div className="w-[400px] bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <a href="#">
                        <img className="rounded-t-lg" src={hospital} alt="" />
                    </a>
                    <div className="p-5">
                        <a href="#">
                            <h5 className="mb-2 text-[23px] font-inter font-bold tracking-tight text-gray-900 dark:text-white">
                                Aplikasi E-Registrasi Puskesmas
                            </h5>
                        </a>
                        <p className="mb-3 font-normal font-inter text-black">
                            Memudahkan anda dalam melakukan pendaftaran tanpa harus repot datang dan menunggu ke Puskesmas.
                        </p>
                        <button
                            onClick={() => navigate('/queue-register-user')}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Mulai Daftar
                            <svg
                                aria-hidden="true"
                                className="w-4 h-4 ml-2 -mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default DashboardCard