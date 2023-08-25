import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import supabase from '../config/supabaseClient'
import { Label, TextInput, Button, Select, Alert } from 'flowbite-react'
import Navigation from '../components/Navigation'
import FormHeading from '../components/FormHeading'
import WelcomeDashboardHeading from '../components/WelcomeDashboardHeading'

const SignUpValidation = () => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            fullname: '',
            email: '',
            password: '',
            confirm: '',
            phone: "",
            nik: "",
            address: "",
            jenis_kelamin: "",
            tgl_lahir: "",
        },
        validationSchema: Yup.object({
            fullname: Yup.string()
                .min(3, 'Mohon isi nama lengkap dengan benar')
                .required('Nama lengkap harus diisi'),

            email: Yup.string()
                .email('Mohon isi email dengan benar')
                .required('Email harus diisi'),

            password: Yup.string()
                .min(8, 'Password minimal 8 karakter')
                .required('Password harus diisi'),

            confirm: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Password tidak sama'),

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
            const { fullname, email, password, phone, nik, address, jenis_kelamin, tgl_lahir } = values
            try {
                setLoading(true)
                const { error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: fullname
                        }
                    }
                })

                const { errorUser } = await supabase
                    .from("users")
                    .update({
                        full_name: fullname,
                        phone: phone,
                        nik: nik,
                        address: address,
                        jenis_kelamin: jenis_kelamin,
                        tgl_lahir: tgl_lahir,
                    })
                    .eq("email", email);

                if (!error && !errorUser) {
                    navigate('/verifikasi-akun', {
                        state: { email: email }
                    })
                }
            }
            catch (error) {
                setLoading(false)
                alert(error.message)
            }
        }
    })


    return (
        <div>
            <WelcomeDashboardHeading heading="Layanan Mudah Pendaftaran & Antrian Pasien Puskesmas (LAMDARANPUS)" />
            <Navigation currentPage={"Data Akun"} />

            <div className='sm:flex justify-center pt-2'>
                <div className='w-[414px] sm:w-[700px] p-5'>
                    <FormHeading
                        heading={"Registrasi Akun"}
                        info={"Silahkan masukan data pribadi beserta alamat e-mail untuk memulai"}
                    />

                    <form className="flex flex-col gap-4 mt-6" onSubmit={formik.handleSubmit}>
                        <div>
                            <div className="block mb-2">
                                <Label
                                    htmlFor="fullname"
                                    value='Nama lengkap*'
                                    color={formik.errors.fullname ? 'failure' : ''}
                                />
                            </div>
                            <TextInput
                                id="fullname"
                                name='fullname'
                                type="text"
                                value={formik.values.fullname}
                                onChange={formik.handleChange}
                                color={formik.errors.fullname ? 'failure' : ''}
                                placeholder="Masukkan nama"
                                helperText={formik.errors.fullname}
                            />
                        </div>

                        <div>
                            <div className="block mb-2">
                                <Label
                                    htmlFor="email"
                                    value="Masukkan alamat email"
                                    color={formik.errors.email ? 'failure' : ''}
                                />
                            </div>
                            <TextInput
                                id="email"
                                name='email'
                                type="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                placeholder="emailanda@gmail.com"
                                color={formik.errors.email ? 'failure' : ''}
                                helperText={formik.errors.email}
                                shadow={true}
                            />
                        </div>

                        <div>
                            <div className="block mb-2">
                                <Label
                                    htmlFor="password"
                                    value="Buat password"
                                    color={formik.errors.password ? 'failure' : ''}
                                />
                            </div>
                            <TextInput
                                id="password"
                                name='password'
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                color={formik.errors.password ? 'failure' : ''}
                                helperText={formik.errors.password}
                                shadow={true}
                            />
                        </div>
                        <div>
                            <div className="block mb-2">
                                <Label
                                    htmlFor="confirm"
                                    value="Konfirmasi password"
                                    color={formik.errors.confirm ? 'failure' : ''}
                                />
                            </div>
                            <TextInput
                                id="confirm"
                                name='confirm'
                                type="password"
                                value={formik.values.confirm}
                                onChange={formik.handleChange}
                                color={formik.errors.confirm ? 'failure' : ''}
                                helperText={formik.errors.confirm}
                                shadow={true}
                            />
                        </div>

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
                        > {loading ? 'Diproses...' : "Daftar"}</Button>
                    </form>
                </div>
            </div>
        </div>


    )
}

export default SignUpValidation