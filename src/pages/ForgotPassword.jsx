import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import supabase from '../config/supabaseClient'
import Navigation from '../components/Navigation'
import FormHeading from '../components/FormHeading'
import { Label, TextInput, Button, Alert } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import WelcomeDashboardHeading from '../components/WelcomeDashboardHeading'

const ForgotPassword = () => {
  const [errorAlert, setErrorAlert] = useState(false)

  const [showAlert, setShowAlert] = useState(false)

  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Mohon isi email dengan benar')
        .required('Email harus diisi'),
    }),
    onSubmit: async (values) => {
      const { email } = values

      try {
        setLoading(true)
        const { error } = await supabase.auth.resetPasswordForEmail(email)

        if (!error) {
          setShowAlert(true)
          setTimeout(() => {
            setShowAlert(false)
          }, 3000)
        }
      } catch (error) {
        setErrorAlert(true)
        setShowAlert(true)
      } finally {
        setLoading(false)
      }
    }
  })


  return (
    <div>
      <WelcomeDashboardHeading />
      <Navigation currentPage="Lupa Password" />

      {showAlert &&
        (
          <Alert
            color={errorAlert ? 'failure' : 'success'}
          >
            <span>
              <span className="font-medium">
                {errorAlert ? 'Gagal!' : 'Berhasil!'}
              </span>
              {' '} {errorAlert ? 'Gagal mereset password, silahkan coba lagi beberapa saat' : 'Silahkan cek email atau spam anda untuk mereset password'}
            </span>
          </Alert>
        )
      }

      <div className='flex justify-center pt-2'>
        <div className='w-[700px] sm:w-[500px] md:w-[600px] p-5'>
          <FormHeading
            heading={"Lupa Password"}
            info={"Masukkan alamat email yang telah terdaftar pada aplikasi"}
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

            <Button
              type="submit"
              disabled={loading ? true : ''}>
              {loading ? 'Memuat...' : 'Kirim'}
            </Button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default ForgotPassword