import React from 'react'
import FormHeading from '../components/FormHeading'
import { useNavigate } from 'react-router-dom'
import PuskesmasLogo from '../assets/logo-puskesmas.png'
import WelcomeDashboardHeading from '../components/WelcomeDashboardHeading'

const WelcomePage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <WelcomeDashboardHeading heading="Layanan Mudah Pendaftaran & Antrian Pasien Puskesmas (LAMDARANPUS)" />
      <div className='mt-[150px] sm:pt-2 sm:mt-0 sm:flex justify-center'>
        <div className='w-[414px] sm:w-[700px]'>

          <div className='flex'>
            <img src={PuskesmasLogo} className='w-[70px] h-[70px] mt-[25px] ml-[30px]' />

            <div className='mt-[18px] ml-[13px]'>
              <h1 className='font-inter font-bold text-[18px] sm:text-[30px]'>Layanan Mudah Pendaftaran & Antrian Pasien Puskesmas</h1>
              <p className='font-normal font-inter text-[15px] sm:text-[15px] text-[#8692A6]'>Sebelum memulai, pastikan anda sudah terdaftar dan memiliki akun.</p>
              <p className='font-normal font-inter text-[15px] sm:text-[15px] text-[#8692A6]'>
                Jika belum terdaftar, silahkan registrasi akun terlebih dahulu.</p>
            </div>
          </div>

          <div className='sm:flex justify-center mt-[20px]'>
            <div className='w-[370px] sm:w-[500px] ml-[20px] sm:ml-0 px-[5px] py-[5px] text-center bg-white border sm:px-[20px] sm:py-[20px] rounded-[6px]'>
              <p className='font-bold font-inter text-[13px] sm:text-[15px] mb-[5px]'>Registrasi</p>
              <h4 className='font-inter mb-[10px] sm:mb-[25px] text-[13px] sm:text-[15px]'>Untuk pengguna baru yang belum memiliki akun</h4>
              <button type="button" className="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-[7px] text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => navigate('/signup')}>
                <h1 className='text-[10px] sm:text-[15px]'>
                  Membuat akun baru
                </h1>
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

          <div className='sm:flex justify-center mt-[20px]'>
            <div className='w-[370px] sm:w-[500px] ml-[20px] sm:ml-0 px-[5px] py-[5px] text-center bg-white border sm:px-[20px] sm:py-[20px] rounded-[6px]'>
              <p className='font-bold font-inter text-[13px] sm:text-[15px] mb-[10px] sm:mb-[25px]'>Masuk ke Akun</p>

              <div className='flex justify-center gap-2 mb-[10px]'>
                <button type="button" className="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => navigate('/login')}>
                  <h1 className='text-[10px] sm:text-[15px]'>
                    Masuk untuk Pasien
                  </h1>
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

                <button type="button" className="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => navigate('/admin-login')}>
                  <h1 className='text-[10px] sm:text-[15px]'>
                    Masuk untuk Admin
                  </h1>
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
      </div>
    </div>

  )
}

export default WelcomePage