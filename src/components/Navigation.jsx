import React from 'react'
import { Button } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

const Navigation = ({ currentPage, isUpdate, isConfirm }) => {
    const navigate = useNavigate()

    return (
        <div className='w-full flex justify-between p-6 font-semibold font-inter text-[#8692A6]'>
            {
                isUpdate || isConfirm ? (
                    null
                ) : (
                    <Button
                        color='light'
                        onClick={() => navigate(-1)}
                        className='font-inter text-[#8692A6]'>
                        Kembali
                    </Button>

                )
            }
            <p className='mt-2'>{currentPage}</p>
        </div >
    )
}

export default Navigation