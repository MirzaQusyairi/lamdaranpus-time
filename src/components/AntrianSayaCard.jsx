import React, { useEffect, useState } from "react";

function getStatus(Status) {
  if (Status === 'queued') {
    return 'DALAM ANTRIAN'
  } else if (Status === 'check') {
    return 'SEDANG DIPERIKSA'
  } else {
    return 'SELESAI BEROBAT'
  }
}

function AntrianSayaCard({ NomorAntrian, JenisPoli, NamaPasien, Status, Tanggal }) {
  const [jamPeriksa, setJamPeriksa] = useState();
  useEffect(() => {
    switch (NomorAntrian) {
      case 1:
        setJamPeriksa("08.00");
        break;
      case 2:
        setJamPeriksa("08.20");
        break;
      case 3:
        setJamPeriksa("08.40");
        break;
      case 4:
        setJamPeriksa("09.00");
        break;
      case 5:
        setJamPeriksa("09.20");
        break;
      case 6:
        setJamPeriksa("09.40");
        break;
      case 7:
        setJamPeriksa("10.00");
        break;
      case 8:
        setJamPeriksa("10.20");
        break;
      case 9:
        setJamPeriksa("10.40");
        break;
      case 10:
        setJamPeriksa("11.00");
        break;
      case 11:
        setJamPeriksa("11.20");
        break;

      default:
        break;
    }
  }, []);

  return (
    <div className="w-[700px] h-[434px] bg-white border border-gray-200 rounded-lg shadow-lg mt-[19px]">
      <h1 className="font-inter font-bold mt-[41px] ml-[39px]">
        Status Pendaftaran
      </h1>
      {NomorAntrian && JenisPoli ? (
        <h1 className="font-inter font-bold mt-[6px] ml-[39px] text-[#08AD36]">
          {getStatus(Status)}
        </h1>
      ) : (
        <h1 className="font-inter font-bold mt-[6px] ml-[39px] text-[#FF0000]">
          Belum terdaftar dalam antrian
        </h1>
      )}

      <div className="flex justify-center">
        <hr className="w-[620px] mt-[20px]" />
      </div>

      {NomorAntrian && JenisPoli ? (
        <div className="flex ml-[64px] mt-[35px] gap-9">
          <div className="mt-[12px]" style={{ maxWidth: '11rem' }}>
            <p className="font-inter font-bold text-[14px] text-center mt-[5px]">
              {JenisPoli}
            </p>
            <p className="font-inter text-[14px] text-center mt-[5px]">
              {new Date(Tanggal).toLocaleDateString('es-CL',)} | {jamPeriksa}
            </p>
            <p className="font-inter font-bold text-[14px] text-center mt-[5px]">

            </p>
            <h1 className="font-inter font-bold text-[20px] text-center">ANTRIAN NOMOR</h1>
            <h1 className="font-inter font-bold text-[32px] text-center">
              {NomorAntrian}
            </h1>
            <p className="font-inter text-[14px] text-center mt-[5px]">
              Nama Pasien :
              <br />{NamaPasien}
            </p>

          </div>
          <div className="w-[366px] h-[172px] bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <h1 className="font-inter font-bold text-[15px]">
              Informasi Nomor Antrian
            </h1>
            <ul className="mt-2 list-disc ml-[15px]">
              <li className="font-inter font-bold text-[14px]">
                INFORMASI 1: Pasien akan diperiksa pada jam {jamPeriksa} WIB.
              </li>
              <li className="font-inter font-bold text-[14px]">
                INFORMASI 2  : Pasien diharap sudah datang dan berada ditempat 15 menit sebelum jam periksa
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-center mt-[40px]">
            <img
              width="100"
              height="100"
              src="https://img.icons8.com/ios/100/sad.png"
              alt="sad"
            />
          </div>
          <h1 className="text-center font-normal font-inter text-[15px] text-black mt-[20px]">
            Anda belum terdaftar dalam antrian, silahkan daftar terlebih dahulu
          </h1>
        </div>
      )}

      <div className="flex justify-center">
        <hr className="w-[620px] mt-[50px]" />
      </div>
    </div>
  );
}

export default AntrianSayaCard;
