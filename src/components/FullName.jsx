import React, { useState, useEffect } from 'react'
import supabase from '../config/supabaseClient'

const FullName = () => {
    const [fullName, setFullName] = useState(null)

    useEffect(() => {
        const getUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            const metadata_userID = user.id;

            const { data } = await supabase
                .from("users")
                .select("*")
                .eq("id", metadata_userID);

            setFullName(data[0].full_name)

        }

        getUserData()
    }, [])

    return <h1 className='font-medium font-inter'>Selamat Datang, {fullName}</h1>
}

export default FullName