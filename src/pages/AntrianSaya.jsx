import React, { useState, useEffect } from 'react'
import AntrianSayaCard from '../components/AntrianSayaCard'
import DashboardHeading from '../components/DashboardHeading'
import BottomNav from '../components/BottomNav'
import supabase from '../config/supabaseClient'

function AntrianSaya() {
    const [antrianPasien, setAntrianPasien] = useState([])
    const [pasienID, setPasienID] = useState(null)

    async function getQueue() {
        try {
            const { data, error } = await supabase.from("queues").select("*").order("queue_date", { ascending: false });
            if (error) throw error;
            if (data) {
                setAntrianPasien(data);
            }
        } catch (error) {
            alert(error.message);
        }
    }

    useEffect(() => {
        getQueue()
    }, [])


    async function getUserMetadata() {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        const userID = user.id
        setPasienID(userID)
    }

    getUserMetadata()

    const pasien = antrianPasien.filter((user) => user.user_id === pasienID)

    return (
        <div className='mb-[100px]'>
            <DashboardHeading linkTo="/welcome" heading="Layanan Mudah Pendaftaran & Antrian Pasien Puskesmas (LAMDARANPUS)" />
            <div className='flex justify-center mt-[50px]'>
                <div>
                    <h1 className='font-inter font-bold text-[30px] text-black'>Riwayat Saya</h1>
                    <hr className='mt-2 w-[700px]' />
                    {
                        pasien.length === 0 ? <AntrianSayaCard /> : (
                            pasien.map(user => (
                                <AntrianSayaCard key={user.id} NomorAntrian={user.queue} JenisPoli={user.poli} NamaPasien={user.name} Status={user.status} Tanggal={user.queue_date} />
                            ))
                        )
                    }
                </div>
            </div>
            <BottomNav />
        </div>
    )
}

export default AntrianSaya