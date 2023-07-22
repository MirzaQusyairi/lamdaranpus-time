import React from 'react'

const FormHeading = ({ heading, info }) => {
    return (
        <div>   
            <div className='w-full pt-2 pl-2 sm:w-[1000px] sm:pl-0'>
                <h1 className='font-bold font-inter text-[18px] sm:text-[30px]'>{heading}</h1>
            </div>
            <div className='w-full pt-2 pl-2 sm:w-[680px] sm:pl-0 sm:mt-[15px]'>
                <h1 className='font-normal font-inter text-[15px] sm:text-[15px] text-[#8692A6]'>{info}</h1>
            </div>
            <hr className='mt-5 w-full sm:w-[680px]' />
        </div>
    )
}

export default FormHeading
