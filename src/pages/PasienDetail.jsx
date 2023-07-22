import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import DashboardHeading from "../components/DashboardHeading";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert, Label, Select, TextInput } from "flowbite-react";

function PasienDetail() {
  const [pasien, setPasien] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const { pasienID } = useParams();

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      no_bpjs: "",
      tgl_lahir: "",
      jenis_kelamin: "",
      nik: "",
      phone: ""
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Nama harus diisi")
        .min(3, "Mohon isi nama dengan benar"),
      category: Yup.string().required("Kategori pasien harus diisi"),
      tgl_lahir: Yup.string().required("Tanggal lahir harus diisi"),
      jenis_kelamin: Yup.string().required("Jenis kelamin harus diisi"),
      no_bpjs: Yup.string()
        .test("conditional-required", "No BPJS harus diisi", function (value) {
          const { category } = this.parent;
          if (category === "BPJS") {
            return !!value;
          }
          return true;
        })
        .min(13, "Mohon isi nomor BPJS dengan benar")
        .max(13, "Mohon isi nomor BPJS dengan benar"),
      nik: Yup.string()
        .min(16, "Mohon isi nomor NIK dengan benar")
        .max(16, "Mohon isi nomor NIK dengan benar"),
      phone: Yup.string()
        .transform((value) => (value ? value.replace(/\D/g, '') : ''))
        .matches(/^\d*$/, 'Mohon isi nomor telepon dengan benar')
        .min(2, "Mohon isi nomor telepon dengan benar")
        .max(13, "Mohon isi nomor telepon dengan benar")
        .required("Nomor telepon harus diisi"),


    }),
    onSubmit: async (values) => {
      const {
        name,
        category,
        no_bpjs,
        tgl_lahir,
        jenis_kelamin,
        nik,
        phone
      } = values;

      try {
        setLoading(true);
        const { error } = await supabase
          .from("queues")
          .update({
            name: name,
            category: category,
            no_bpjs: no_bpjs,
            tgl_lahir: tgl_lahir,
            jenis_kelamin: jenis_kelamin,
            nik: nik,
            phone: phone
          })
          .eq("id", pasienID);

        if (!error) {
          setLoading(false);
          setShowAlert(true);
          setIsEdit(false);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
      } catch (error) {
        setLoading(false);
        setErrorAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    async function getPatientByID() {
      try {
        const { data, error } = await supabase
          .from("queues")
          .select("*")
          .eq("id", pasienID);

        if (data) {
          setPasien(data[0]);
        }

        if (error) {
          setErrorAlert(true);
          setShowAlert(true);
        }
      } catch (error) {
        alert(error.message);
      }
    }

    getPatientByID();
  }, []);

  useEffect(() => {
    if (pasien) {
      formik.setValues({
        name: pasien.name,
        category: pasien.category,
        no_bpjs: pasien.no_bpjs,
        tgl_lahir: pasien.tgl_lahir,
        jenis_kelamin: pasien.jenis_kelamin,
        nik: pasien.nik,
        phone: pasien.phone
      });
    }
  }, [pasien]);

  function handleEdit() {
    setIsEdit(true);
  }

  return (
    <div className="mb-[100px]">
      <DashboardHeading heading="Halaman Admin Layanan Mudah Pendaftaran & Antrian Puskesmas (LAMDARANPUS)" linkTo="/welcome" />
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
      <div className="flex gap-[50px]">
        <h1 className="font-inter font-bold text-[30px] mt-[61px] ml-[79px]">
          Pasien Detail
        </h1>
        <button
          className="w-[183px] h-[42px] mt-[70px] ml-[950px] rounded-[11px] bg-[#FE6D05]"
          type="button"
          onClick={() => navigate(-1)}
        >
          <p className="font-inter font-bold text-white text-[11px]">
            KEMBALI KE KELOLA ANTRIAN
          </p>
        </button>
      </div>

      <div className="flex justify-center mt-[10px]">
        <hr className="w-[1380px]" />
      </div>

      <div className="flex justify-center mt-3">
        <form
          className="flex flex-col gap-4 mt-3"
          onSubmit={formik.handleSubmit}
        >
          <div>
            <Label
              htmlFor="name"
              value="Nama Pasien"
              color={formik.errors.name && "failure"}
              className="font-inter font-bold text-black"
            />
            <TextInput
              id="name"
              name="name"
              type="text"
              value={formik.values.name}
              placeholder="Isi NIK pasien"
              onChange={formik.handleChange}
              helperText={formik.errors.name}
              className="mt-2 w-[780px]"
              disabled={isEdit ? false : true}
              color={formik.errors.name && "failure"}
            />
          </div>
          <div>
            <Label
              htmlFor="nik"
              value="No. KTP"
              color={formik.errors.nik && "failure"}
              className="font-inter font-bold text-black"
            />
            <TextInput
              id="nik"
              name="nik"
              type="number"
              value={formik.values.nik}
              placeholder="Isi Nama Pasien"
              onChange={formik.handleChange}
              helperText={formik.errors.nik}
              className="mt-2 w-[780px]"
              disabled={isEdit ? false : true}
              color={formik.errors.nik && "failure"}
            />
          </div>
          <div>
            <Label
              htmlFor="phone"
              value="No. Telepon"
              color={formik.errors.phone && "failure"}
              className="font-inter font-bold text-black"
            />
            <TextInput
              id="nik"
              name="nik"
              type="text"
              value={formik.values.phone}
              placeholder="08xxxxxxxxxx"
              onChange={formik.handleChange}
              helperText={formik.errors.phone}
              className="mt-2 w-[780px]"
              disabled={isEdit ? false : true}
              color={formik.errors.phone && "failure"}
            />
          </div>
          <div>
            <Label
              htmlFor="category"
              value="Kategori Pasien"
              color={formik.errors.category && "failure"}
              className="font-inter font-bold text-black"
            />
            <Select
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              className="mt-2"
              color={formik.errors.category && "failure"}
              disabled={isEdit ? false : true}
              helperText={formik.errors.category}
            >
              <option key="0" value="" disabled>
                Pilih Kategori Pasien
              </option>
              <option key="1" value="Non BPJS">
                Non BPJS
              </option>
              <option key="2" value="BPJS">
                BPJS
              </option>
            </Select>
          </div>
          {formik.values.category === "BPJS" && (
            <div>
              <Label
                htmlFor="no_bpjs"
                value="No. BPJS"
                className="font-inter font-bold text-black"
                color={formik.errors.no_bpjs && "failure"}
              />
              <TextInput
                id="no_bpjs"
                name="no_bpjs"
                type="text"
                value={formik.values.no_bpjs}
                placeholder="Isi Nomor BPJS"
                onChange={formik.handleChange}
                helperText={formik.errors.no_bpjs}
                className="mt-2 w-[780px]"
                disabled={isEdit ? false : true}
                color={formik.errors.no_bpjs && "failure"}
              />
            </div>
          )}
          <div>
            <Label
              htmlFor="tgl_lahir"
              value="Tanggal Lahir"
              color={formik.errors.name && "failure"}
              className="font-inter font-bold text-black"
            />
            <TextInput
              id="tgl_lahir"
              name="tgl_lahir"
              type="date"
              value={formik.values.tgl_lahir}
              placeholder="Tanggal Lahir"
              onChange={formik.handleChange}
              helperText={formik.errors.tgl_lahir}
              className="mt-2 w-[780px]"
              disabled={isEdit ? false : true}
              color={formik.errors.tgl_lahir && "failure"}
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
              id="jenis_kelamin"
              name="jenis_kelamin"
              value={formik.values.jenis_kelamin}
              onChange={formik.handleChange}
              className="mt-2"
              color={formik.errors.jenis_kelamin && "failure"}
              disabled={isEdit ? false : true}
              helperText={formik.errors.jenis_kelamin}
            >
              <option key="0" value="" disabled>
                Pilih jenis kelamin
              </option>
              <option key="1" value="Laki-Laki">
                Laki-Laki
              </option>
              <option key="2" value="Perempuan">
                Perempuan
              </option>
            </Select>
          </div>
          <div className="text-center w-[300px] bg-[#FFFFFF] shadow-lg rounded-lg border border-gray-200 p-2 mt-2">
            <h1 className="font-inter font-bold text-black">
              PASIEN ADA DI ANTRIAN NOMOR
            </h1>
            <h1 className="text-[25px] font-inter font-bold">{pasien.queue}</h1>
          </div>
          {isEdit ? (
            <button
              className="w-[300px] h-[37px] bg-[#1565D8] mt-[20px] rounded-md"
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
              className="w-[300px] h-[37px] bg-[#1565D8] mt-[20px] rounded-md"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleEdit();
              }}
            >
              <p className="font-inter text-white">Edit Data Pasien</p>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default PasienDetail;
