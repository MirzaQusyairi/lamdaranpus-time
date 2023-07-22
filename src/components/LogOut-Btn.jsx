import React from 'react'
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';

export default function LogOutBtn({ linkTo }) {
  const navigate = useNavigate()
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
    else {
      navigate(linkTo)
      const session = supabase.auth.getSession();
      const isLoggedIn = session !== null;
    }
  };
  return (
    <button className='w-[150px] h-[37px] rounded-[11px] mt-[14px] ml-[100px] bg-[#FC0404]' onClick={handleLogout}>
      <div className='flex justify-center gap-3'>
        <p className='font-inter font-bold text-[20px] text-white'>Keluar</p>
      </div>
    </button>

  )

}
