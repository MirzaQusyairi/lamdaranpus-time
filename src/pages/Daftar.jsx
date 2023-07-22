import React from 'react'
import DashboardHeading from '../components/DashboardHeading'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

function Daftar() {
    const navigate = useNavigate()

    return (
        <div>
            <DashboardHeading heading="Layanan Mudah Pendaftaran & Antrian Pasien Puskesmas (LAMDARANPUS)" />
            <div className='flex justify-center mt-[100px]'>
                <h1 className='font-bold font-inter text-[24px]'>Mulai Mendaftar?</h1>
            </div>
            <div className='flex justify-center mt-[20px]'>
                <div className='w-[500px] text-center bg-white border px-[20px] py-[20px] rounded-[6px]'>
                    <h4 className='font-bold font-inter mb-[25px]'>Data akan disesuaikan dengan data akun yang terdaftar</h4>
                    <button type="button" className="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => navigate('/queue-register-user')}>
                        Daftar untuk sendiri
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

            <div className='flex justify-center mt-[20px]'>
                <div className='w-[500px] text-center bg-white border px-[20px] py-[20px] rounded-[6px]'>
                    <h4 className='font-bold font-inter mb-[25px]'>Mengisi data form sesuai pasien yang ingin didaftarkan</h4>
                    <button type="button" className="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => navigate('/queue-register-other')}>
                        Daftar untuk orang lain
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
            <BottomNav />
        </div>
    )
}

export default Daftar