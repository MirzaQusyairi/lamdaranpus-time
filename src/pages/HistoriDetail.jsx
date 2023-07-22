import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import DashboardHeading from "../components/DashboardHeading";
import { useFormik } from "formik";
import { Label, Select, TextInput } from "flowbite-react";

function HistoriDetail() {
    const [pasien, setPasien] = useState({});

    const [showAlert, setShowAlert] = useState(false);

    const [errorAlert, setErrorAlert] = useState(false);

    const { historiID } = useParams();

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            category: "",
            no_bpjs: "",
            poli: "",
            tgl_lahir: "",
            jenis_kelamin: "",
            jenis_poli_umum: "",
            nik: "",
            phone: "",
        },
    });

    useEffect(() => {
        async function getHistory() {
            try {
                const { data, error } = await supabase
                    .from("history")
                    .select("*")
                    .eq("id", historiID);

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

        getHistory();
    }, []);

    useEffect(() => {
        if (pasien) {
            formik.setValues({
                name: pasien.name,
                category: pasien.category,
                no_bpjs: pasien.no_bpjs,
                poli: pasien.poli,
                tgl_lahir: pasien.tgl_lahir,
                jenis_kelamin: pasien.jenis_kelamin,
                nik: pasien.nik,
                phone: pasien.phone,
            });
        }
    }, [pasien]);

    return (
        <div className="mb-[100px]">
            <DashboardHeading heading="Halaman Admin Layanan Mudah Pendaftaran & Antrian Puskesmas (LAMDARANPUS)" linkTo="/welcome" />

            <div className="flex gap-[50px]">
                <h1 className="font-inter font-bold text-[25px] mt-[61px] ml-[50px]">
                    Histori Pasien Detail
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
                            disabled={true}
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
                            disabled={true}
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
                            disabled={true}
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
                            disabled={true}
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
                                disabled={true}
                                color={formik.errors.no_bpjs && "failure"}
                            />
                        </div>
                    )}

                    <div>
                        <Label
                            htmlFor="poli"
                            value="Poli yang terdaftar"
                            color={formik.errors.poli && "failure"}
                            className="font-inter font-bold text-black"
                        />
                        <TextInput
                            id="poli"
                            name="poli"
                            type="text"
                            value={formik.values.poli}
                            placeholder="Isi Poli Pasien"
                            onChange={formik.handleChange}
                            helperText={formik.errors.poli}
                            className="mt-2 w-[780px]"
                            disabled={true}
                            color={formik.errors.poli && "failure"}
                        />
                    </div>
                    {formik.values.poli === "Umum" && <div></div>}
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
                            disabled={true}
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
                            disabled={true}
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
                </form>
            </div>
        </div>
    );
}

export default HistoriDetail;
