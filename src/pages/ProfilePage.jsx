import React, { useEffect, useState } from "react";
import DashboardHeading from "../components/DashboardHeading";
import BottomNav from "../components/BottomNav";
import supabase from "../config/supabaseClient";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label, TextInput, Button, Select, Alert } from "flowbite-react";

function ProfilePage() {
  const [isEdit, setIsEdit] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});

  async function getUserMetadata() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let metadata = user;
    return metadata;
  }


  const formik = useFormik({
    initialValues: {
      nama_lengkap: "",
      no_telp: "",
      no_ktp: "",
      alamat: "",
      jenis_kelamin: "",
      tanggal_lahir: "",
    },
    validationSchema: Yup.object({
      nama_lengkap: Yup.string()
        .min(2, "Mohon isi nama lengkap dengan benar")
        .required("Nama lengkap harus diisi"),
      no_telp: Yup.string()
        .transform((value) => (value ? value.replace(/\D/g, '') : ''))
        .matches(/^\d*$/, 'Mohon isi nomor telepon dengan benar')
        .min(2, "Mohon isi nomor telepon dengan benar")
        .max(13, "Mohon isi nomor telepon dengan benar")
        .required("Nomor telepon harus diisi"),
      no_ktp: Yup.string()
        .min(16, "Mohon isi NIK anda dengan benar")
        .max(16, "Mohon isi NIK anda dengan benar")
        .required("Nomor KTP harus diisi"),
      alamat: Yup.string()
        .min(2, "Mohon isi alamat dengan benar")
        .max(100, "Maks 100 karakter")
        .required("Alamat harus diisi"),
      jenis_kelamin: Yup.string().required("Jenis kelamin harus diisi"),
      tanggal_lahir: Yup.string().required("Tanggal lahir harus diisi"),
    }),

    onSubmit: async (values) => {
      const metadata = await getUserMetadata();

      const metadata_userID = metadata.id;

      const {
        nama_lengkap,
        no_telp,
        no_ktp,
        alamat,
        jenis_kelamin,
        tanggal_lahir,
      } = values;
      try {
        const { error } = await supabase
          .from("users")
          .update({
            full_name: nama_lengkap,
            phone: no_telp,
            address: alamat,
            nik: no_ktp,
            jenis_kelamin: jenis_kelamin,
            tgl_lahir: tanggal_lahir,
          })
          .eq("id", metadata_userID)
          .select();

        if (!error) {
          setShowAlert(true);
          setIsEdit(false);
        }
      } catch (error) {
        setErrorAlert(true);
        setShowAlert(true);
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    async function getUserData() {
      const metadata = await getUserMetadata();

      const metadata_userID = metadata.id;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", metadata_userID);

      if (data) {
        setUserData(data[0]);
      }

      if (error) {
        setErrorAlert(true);
        setShowAlert(true);
      }
    }

    getUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      formik.setValues({
        nama_lengkap: userData.full_name,
        email: userData.email,
        no_telp: userData.phone,
        no_ktp: userData.nik,
        alamat: userData.address,
        jenis_kelamin: userData.jenis_kelamin,
        tanggal_lahir: userData.tgl_lahir,
      });
    }
  }, [userData]);

  function handleEdit() {
    setIsEdit(true);
  }

  return (
    <div className="mb-[100px]">
      <DashboardHeading linkTo="/welcome" heading="Layanan Mudah Pendaftaran & Antrian Pasien Puskesmas (LAMDARANPUS)" />
      {showAlert && (
        <Alert color={errorAlert ? "failure" : "success"}>
          <span>
            <span className="font-inter font-medium">
              {errorAlert ? "Gagal" : "Berhasil"}
            </span>
            {""}{" "}
            {errorAlert
              ? "Gagal mendapatkan data dari server/terjadi kesalahan"
              : "Data berhasil diperbarui"}
          </span>
        </Alert>
      )}
      <div className="flex justify-center mt-[50px]">
        <div>
          <h1 className="font-inter font-bold text-[30px] text-black">
            Profil Saya
          </h1>
          <hr className="mt-2 w-[700px]" />

          <form
            className="flex flex-col gap-4 mt-3"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <Label
                htmlFor="nama_lengkap"
                value="Nama Lengkap"
                color={formik.errors.nama_lengkap && "failure"}
                className="font-inter font-bold text-black"
              />
              <TextInput
                id="nama_lengkap"
                name="nama_lengkap"
                value={formik.values.nama_lengkap}
                onChange={formik.handleChange}
                color={formik.errors.nama_lengkap && "failure"}
                placeholder="Masukkan nama"
                helperText={formik.errors.nama_lengkap}
                className="mt-2"
                disabled={isEdit ? false : true}
              />
            </div>
            <div>
              <Label
                htmlFor="email"
                value="Email"
                color={formik.errors.email && "failure"}
                className="font-inter font-bold text-black"
              />
              <TextInput
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="dadangsudrajat@mail.com"
                className="mt-2"
                disabled
              />
            </div>
            <div>
              <Label
                htmlFor="no_telp"
                value="Nomor Telepon"
                color={formik.errors.no_telp && "failure"}
                className="font-inter font-bold text-black"
              />
              <TextInput
                id="no_telp"
                name="no_telp"
                type="text"
                value={formik.values.no_telp}
                onChange={formik.handleChange}
                color={formik.errors.no_telp && "failure"}
                placeholder="08xxxxxxxxxxxx"
                helperText={formik.errors.no_telp}
                className="mt-2"
                disabled={isEdit ? false : true}
              />
            </div>
            <div>
              <Label
                htmlFor="no_ktp"
                value="No. KTP"
                color={formik.errors.no_ktp && "failure"}
                className="font-inter font-bold text-black"
              />
              <TextInput
                id="no_ktp"
                name="no_ktp"
                type="number"
                value={formik.values.no_ktp}
                onChange={formik.handleChange}
                color={formik.errors.no_ktp && "failure"}
                placeholder="Masukkan nama"
                helperText={formik.errors.no_ktp}
                className="mt-2"
                disabled={isEdit ? false : true}
              />
            </div>
            <div>
              <Label
                htmlFor="alamat"
                value="Alamat"
                color={formik.errors.alamat && "failure"}
                className="font-inter font-bold text-black"
              />
              <TextInput
                id="alamat"
                name="alamat"
                value={formik.values.alamat}
                onChange={formik.handleChange}
                color={formik.errors.alamat && "failure"}
                placeholder="Masukkan alamat"
                helperText={formik.errors.alamat}
                className="mt-2"
                disabled={isEdit ? false : true}
              />
            </div>
            <div>
              <Label
                htmlFor="jenis_kelamin"
                value="Jenis Kelamin"
                color={formik.errors.jenis_kelamin && "failure"}
                className="font-inter font-bold text-black"
              />
              <Select
                as="select"
                id="jenis_kelamin"
                name="jenis_kelamin"
                value={formik.values.jenis_kelamin}
                onChange={formik.handleChange}
                className="mt-2"
                color={formik.errors.jenis_kelamin && "failure"}
                helperText={formik.errors.jenis_kelamin}
                disabled={isEdit ? false : true}
              >
                <option key="0" value="" disabled>
                  Pilih jenis Kelamin
                </option>
                <option key="1" value="Laki-Laki">
                  Laki-Laki
                </option>
                <option key="2" value="Perempuan">
                  Perempuan
                </option>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="tanggal_lahir"
                value="Tanggal Lahir"
                color={formik.errors.tanggal_lahir && "failure"}
                className="font-inter font-bold text-black"
              />
              <TextInput
                id="tanggal_lahir"
                name="tanggal_lahir"
                type="date"
                value={formik.values.tanggal_lahir}
                onChange={formik.handleChange}
                color={formik.errors.tanggal_lahir && "failure"}
                placeholder="Masukkan nama"
                helperText={formik.errors.tanggal_lahir}
                className="mt-2"
                disabled={isEdit ? false : true}
              />
            </div>
            {isEdit ? (
              <button
                className="w-[265px] h-[37px] bg-[#1565D8] mt-[34px] rounded-md"
                type="submit"
                disabled={loading ? true : ""}
              >
                {loading ? (
                  <p className="font-inter text-white">Memuat...</p>
                ) : (
                  <p className="font-inter text-white">Simpan Perubahan</p>
                )}
              </button>
            ) : (
              <button
                className="w-[265px] h-[37px] bg-[#1565D8] mt-[34px] rounded-md"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleEdit();
                }}
              >
                <p className="font-inter text-white">Edit Profil</p>
              </button>
            )}
          </form>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default ProfilePage;
