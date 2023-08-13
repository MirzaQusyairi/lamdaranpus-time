import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import supabase from "../config/supabaseClient";
import Navigation from "../components/Navigation";
import FormHeading from "../components/FormHeading";
import { useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Select, Alert } from "flowbite-react";
import WelcomeDashboardHeading from "../components/WelcomeDashboardHeading";

const AdditionalData = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);

  const [errorAlert, setErrorAlert] = useState(false);

  const [loading, setLoading] = useState(false);

  async function getUserMetadata() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let metadata = user;
    return metadata;
  }

  const formik = useFormik({
    initialValues: {
      phone: "",
      nik: "",
      address: "",
      jenis_kelamin: "",
      tgl_lahir: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .transform((value) => (value ? value.replace(/\D/g, '') : ''))
        .matches(/^\d*$/, 'Mohon isi nomor telepon dengan benar')
        .min(2, "Mohon isi nomor telepon dengan benar")
        .max(13, "Mohon isi nomor telepon dengan benar")
        .required("Nomor telepon harus diisi"),

      nik: Yup.string()
        .min(16, "Mohon isi NIK anda dengan benar")
        .max(16, "Mohon isi NIK anda dengan benar")
        .required("Nomor KTP harus diisi"),

      address: Yup.string()
        .min(2, "Mohon isi alamat dengan benar")
        .max(100, "Maks 100 karakter")
        .required("Alamat harus diisi"),

      jenis_kelamin: Yup.string().required("Jenis kelamin harus diisi"),

      tgl_lahir: Yup.string().required("Tanggal lahir harus diisi"),
    }),

    onSubmit: async (values) => {
      const metadata = await getUserMetadata();
      const fullName = metadata.user_metadata.full_name;
      const metadata_email = metadata.email;
      console.log(metadata);

      const { phone, nik, address, jenis_kelamin, tgl_lahir } = values;
      try {
        setLoading(true);
        const { error } = await supabase
          .from("users")
          .update({
            full_name: fullName,
            phone: phone,
            nik: nik,
            address: address,
            jenis_kelamin: jenis_kelamin,
            tgl_lahir: tgl_lahir,
          })
          .eq("email", metadata_email);

        if (!error) {
          setShowAlert(true);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
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

  return (
    <div>
      <WelcomeDashboardHeading heading={"Layanan Mudah Pendaftaran & Antrian Pasien Puskesmas (LAMDARANPUS)"}/>
      <Navigation currentPage={"Data Tambahan"} isConfirm />

      {
        showAlert && (
          <Alert
            color={errorAlert ? 'failure' : 'success'}
          >
            <span>
              <span className="font-medium">
                {errorAlert ? 'Gagal!' : 'Berhasil!'}
              </span>
              {' '} {errorAlert ? 'mengisi data tambahan, silahkan isi ulang data anda' : 'mengisi data tambahan, anda akan diarahkan ke halaman login'}
            </span>
          </Alert>

        )
      }

      <div className="flex justify-center pt-2">
        <div className="w-[700px] sm:w-[500px] md:w-[600px] p-5">
          <FormHeading
            heading="Isi Data Tambahan"
            info={
              "Selesaikan tahap pendaftaran akun dengan mengisi data tambahan berikut"
            }
          />

          <form
            className="flex flex-col gap-4 mt-6"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="phone"
                  value="Nomor Telepon*"
                  color={formik.errors.phone ? "failure" : ""}
                />
              </div>
              <TextInput
                id="phone"
                type="text"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                placeholder="08xxxxxxxxxx"
                color={formik.errors.phone ? "failure" : ""}
                helperText={formik.errors.phone}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="nik"
                  value="Masukkan NIK KTP anda*"
                  color={formik.errors.nik ? "failure" : ""}
                />
              </div>
              <TextInput
                id="nik"
                name="nik"
                type="number"
                placeholder="32xxxxxxxxxxxxxxx"
                value={formik.values.nik}
                onChange={formik.handleChange}
                color={formik.errors.nik ? "failure" : ""}
                helperText={formik.errors.nik}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="address"
                  value="Masukkan alamat sesuai KTP*"
                  color={formik.errors.address ? "failure" : ""}
                />
              </div>
              <TextInput
                id="address"
                name="address"
                type="text"
                placeholder="Masukkan alamat"
                value={formik.values.address}
                onChange={formik.handleChange}
                color={formik.errors.address ? "failure" : ""}
                helperText={formik.errors.address}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="jenis_kelamin"
                  value="Jenis Kelamin*"
                  color={formik.errors.jenis_kelamin ? "failure" : ""}
                />
              </div>
              <Select
                as="select"
                id="jenis_kelamin"
                name="jenis_kelamin"
                value={formik.values.jenis_kelamin}
                onChange={formik.handleChange}
                color={formik.errors.jenis_kelamin ? "failure" : ""}
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
              <div className="block mb-2">
                <Label
                  htmlFor="tgl_lahir"
                  value="Tanggal Lahir*"
                  color={formik.errors.tgl_lahir ? "failure" : ""}
                />
              </div>
              <TextInput
                id="tgl_lahir"
                name="tgl_lahir"
                type="date"
                value={formik.values.tgl_lahir}
                onChange={formik.handleChange}
                color={formik.errors.tgl_lahir ? "failure" : ""}
                helperText={formik.errors.tgl_lahir}
                shadow={true}
              />
            </div>

            <Button type="submit"
              disabled={loading ? true : ''}
            > {loading ? 'Memuat...' : "Konfirmasi Akun"}</Button>
          </form>
        </div>
      </div>
    </div >
  );
};

export default AdditionalData;
