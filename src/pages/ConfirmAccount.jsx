import React from 'react'
import WelcomeDashboardHeading from '../components/WelcomeDashboardHeading'
import FormHeading from '../components/FormHeading'
import { useNavigate } from 'react-router-dom'
import { Button } from 'flowbite-react'

function ConfirmAccount() {
    const navigate = useNavigate()

    return (
        <div>
            <WelcomeDashboardHeading />
            <div className='flex justify-center pt-2 mt-[30px]'>
                <div className='w-[700px] p-5'>
                    <FormHeading
                        heading="Konfirmasi Akun"
                        info="Silahkan cek email anda, untuk menyelesaikan proses registrasi" />
                    <Button type='submit' className='w-[700px] mt-[50px]'
                        onClick={() => navigate('/welcome')}>
                        Kembali ke Beranda
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmAccount