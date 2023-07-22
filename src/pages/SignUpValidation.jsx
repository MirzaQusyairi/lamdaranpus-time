import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import supabase from '../config/supabaseClient'
import { Label, TextInput, Button } from 'flowbite-react'
import Navigation from '../components/Navigation'
import FormHeading from '../components/FormHeading'
import WelcomeDashboardHeading from '../components/WelcomeDashboardHeading'

const SignUpValidation = () => {
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            fullname: '',
            email: '',
            password: '',
            confirm: '',
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
                .oneOf([Yup.ref('password'), null], 'Password tidak sama')
        }),

        onSubmit: async (values) => {
            const { fullname, email, password } = values
            try {
                const { error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: fullname
                        }
                    }
                })

                if (!error) {
                    navigate('/verifikasi-akun', {
                        state: { email: email }
                    })
                }
            }
            catch (error) {
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
                        <Button type="submit">
                            Selanjutnya
                        </Button>
                    </form>
                </div>
            </div>
        </div>


    )
}

export default SignUpValidation