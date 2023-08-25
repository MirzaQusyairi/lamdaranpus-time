import React from 'react'

function getStatus(Status) {
    if (Status === 'queued') {
        return 'DALAM ANTRIAN'
    } else if (Status === 'check') {
        return 'SEDANG DIPERIKSA'
    } else {
        return 'SELESAI BEROBAT'
    }
}

function StatusPendaftaranCard({ NomorAntrian, JenisPoli, NamaPasien, Status, Tanggal, Waktu }) {
    return (
        <div className='flex justify-center mt-[40px]'>

            <div className="w-[400px] p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 h-[300px]">
                <h5 className="text-[14px] font-bold text-black font-inter">
                    Status Pendaftaran
                </h5>
                <div className='flex justify-center'>
                    <hr className='mt-2 w-[350px]' />
                </div>

                {
                    NomorAntrian && JenisPoli ? (
                        <h5 className="text-[14px] text-[#08AD36] font-bold font-inter text-center mt-2">
                            {getStatus(Status)}
                        </h5>
                    ) : (
                        <div>
                            <div className='flex justify-center mt-[40px]'>
                                <img width="50" height="50" src="https://img.icons8.com/ios/50/sad.png" alt="sad" />

                            </div>

                            <h5 className="text-[px] text-[#FF0000] font-bold font-inter text-center mt-[20px]">Belum terdaftar dalam antrian</h5>

                        </div>
                    )
                }

                {
                    NomorAntrian && JenisPoli &&
                    <div className='flex justify-center text-center mt-[7px]'>
                        <div>
                            <p className='font-inter font-bold text-[17px] text-center mt-[5px]'>
                                {JenisPoli}
                            </p>
                            <p className='font-inter text-[14px] text-center mt-[5px]'>
                                {new Date(Tanggal).toLocaleDateString('es-CL',)} | {Waktu}
                            </p>

                            <p className='font-inter font-bold text-[14px] text-center mt-[5px]'></p>
                            <h1 className='font-inter font-bold text-[14px]'>ANTRIAN NOMOR</h1>
                            <h1 className='font-inter font-bold text-[32px]'>{NomorAntrian}</h1>
                            <p className='font-inter text-[14px] text-center mt-[5px]'>Nama Pasien : <br /> {NamaPasien}</p>
                        </div>
                    </div>
                }

            </div>

        </div>

    )
}

export default StatusPendaftaranCard