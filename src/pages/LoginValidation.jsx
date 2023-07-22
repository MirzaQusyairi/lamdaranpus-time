import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import supabase from '../config/supabaseClient'
import Navigation from '../components/Navigation'
import FormHeading from '../components/FormHeading'
import { useNavigate, Link } from 'react-router-dom'
import { Label, TextInput, Button, Alert } from 'flowbite-react'
import WelcomeDashboardHeading from '../components/WelcomeDashboardHeading'

const LoginValidation = () => {
    const navigate = useNavigate()

    const [errorAlert, setErrorAlert] = useState(false)

    const [showAlert, setShowAlert] = useState(false)

    const [loading, setLoading] = useState(false)


    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Mohon isi email dengan benar')
                .required('Email harus diisi'),

            password: Yup.string()
                .min(8, 'Password harus lebih dari 8 karakter')
                .required('Password harus diisi'),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true)
                const { email, password } = values

                const { error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                })

                if (!error) {
                    navigate('/')
                }

                if (error) {
                    setErrorAlert(true)
                    setShowAlert(true)
                }
            }
            catch (error) {
                alert(error.message)
            } finally {
                setLoading(false)
            }
        }
    })


    return (
        <div>
            <WelcomeDashboardHeading heading="Layanan Mudah Pendaftaran & Antrian Pasien Puskesmas (LAMDARANPUS)" />
            <Navigation currentPage="Sign In" />
            {
                showAlert && (
                    <Alert
                        color={errorAlert && 'failure'}
                    >
                        <span>
                            <span className="font-medium">
                                {errorAlert && 'Password atau email salah!'}
                            </span>
                            {' '} {errorAlert && 'Silahkan cek kembali email dan password anda'}
                        </span>
                    </Alert>
                )
            }
            <div className='sm:flex justify-center pt-2'>
                <div className='w-[414px] sm:w-[700px] p-5'>
                    <FormHeading
                        heading={"Sign in"}
                        info={"Masukkan alamat email dan password yang telah terdaftar"}
                    />

                    <form className="flex flex-col gap-4 mt-6" onSubmit={formik.handleSubmit}>
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
                                    value="Masukkan password"
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
                        <Button type="submit"
                            disabled={loading ? true : ''}>
                            {loading ? 'Memuat...' : 'Masuk'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginValidation