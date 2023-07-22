import React, { Children, useState } from 'react'
import WelcomeDashboardHeading from '../components/WelcomeDashboardHeading'
import FormHeading from '../components/FormHeading'
import { Label, TextInput, Button, Alert } from 'flowbite-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useLocation, useNavigate } from 'react-router-dom'
import supabase from '../config/supabaseClient'
import Navigation from '../components/Navigation'

function OTPVerification() {
    const [showAlert, setShowAlert] = useState(false);

    const [errorAlert, setErrorAlert] = useState(false);

    const [loading, setLoading] = useState(false);

    const location = useLocation()
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            otp: ''
        },
        validationSchema: Yup.object({
            otp: Yup.string()
                .max(6, 'Kode OTP harus 6 karakter')
                .min(6, 'Kode OTP harus 6 karakter')
                .required('Kode OTP harus diisi')
        }),
        onSubmit: async (values) => {
            const email = location.state.email
            try {
                setLoading(true)
                const { error } = await supabase.auth.verifyOtp({
                    email: email,
                    token: values.otp,
                    type: 'email'
                })

                if (error) {
                    setErrorAlert(true)
                    setShowAlert(true)
                    setTimeout(() => {
                        setShowAlert(false)
                        setErrorAlert(false)
                    }, 3000)
                }

                if (!error) {
                    navigate('/additional-data')
                }
            } catch (error) {
                setErrorAlert(true)
                setShowAlert(true)
                setTimeout(() => {
                    setShowAlert(false)
                    setErrorAlert(false)
                }, 3000)
            } finally {
                setLoading(false)
            }
        }
    })




    return (
        <div>
            <WelcomeDashboardHeading />
            <Navigation currentPage={"Verifikasi Akun"} isConfirm />
            {
                showAlert && (
                    <Alert
                        color={errorAlert ? 'failure' : 'success'}
                    >
                        <span>
                            <span className="font-medium">
                                {errorAlert ? 'Gagal!' : 'Berhasil!'}
                            </span>
                            {' '} {errorAlert ? 'memverifikasi akun, silahkan isi kembali OTP' : 'mengkonfirmasi akun'}
                        </span>
                    </Alert>

                )
            }
            <div className='flex justify-center pt-2 mt-[30px]'>
                <div className='w-[700px] p-5'>
                    <FormHeading
                        heading="Verifikasi OTP"
                        info="Silahkan cek email anda untuk mendapatkan kode OTP" />
                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            <div className="block mt-[10px] mb-2">
                                <Label
                                    value='Kode OTP*'
                                    htmlFor="otp"
                                    color={formik.errors.otp ? 'failure' : ''}
                                />
                            </div>
                            <TextInput
                                id="otp"
                                name='otp'
                                type="text"
                                className='w-[700px]'
                                value={formik.values.otp}
                                onChange={formik.handleChange}
                                color={formik.errors.otp ? 'failure' : ''}
                                placeholder="Masukkan Kode OTP"
                                helperText={formik.errors.otp}
                            />
                        </div>
                        <Button
                            type='submit'
                            className='mt-[20px] w-[700px]'
                            disabled={loading ? true : ''}>
                            {loading ? 'Memuat...' : 'Selanjutnya'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default OTPVerification