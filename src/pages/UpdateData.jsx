import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import supabase from '../config/supabaseClient'
import { Label, TextInput, Button } from 'flowbite-react'
import Navigation from '../components/Navigation'
import FormHeading from '../components/FormHeading'

const UpdateData = () => {
    const navigate = useNavigate()

    async function getUserMetadata() {
        const { data: { user } } = await supabase.auth.getUser()
        let metadata = user
        return metadata
    }

    const formik = useFormik({
        initialValues: {
            phone: '',
            nik: '',
            address: ''
        },
        validationSchema: Yup.object({
            phone: Yup.string()
                .min(2, 'Mohon isi nomor telepon dengan benar')
                .max(13, 'Mohon isi nomor telepon dengan benar')
                .required('Nomor telepon harus diisi'),

            nik: Yup.string()
                .min(16, 'Mohon isi NIK anda dengan benar')
                .max(16, 'Mohon isi NIK anda dengan benar')
                .required('Nomor KTP harus diisi'),

            address: Yup.string()
                .min(2, 'Mohon isi alamat dengan benar')
                .max(100, 'Maks 100 karakter')
                .required('Alamat harus diisi'),
        }),

        onSubmit: async (values) => {
            const metadata = await getUserMetadata()
            const fullName = metadata.user_metadata.full_name
            const metadata_email = metadata.email

            console.log(metadata_email)

            const { fullname, phone, nik, address } = values
            try {
                const { data, error } = await supabase
                    .from('users')
                    .update({
                        full_name: fullName,
                        phone: phone,
                        nik: nik,
                        address: address
                    })
                    .eq('email', metadata_email)

                if (error) throw error

                alert('Updated')
                // navigate('/data-tambahan')

            } catch (error) {
                alert(error.message)
            }
        }
    })

    return (
        <div>
            <Navigation currentPage={"Data Akun"} />

            <div className='flex justify-center pt-2'>
                <div className='w-[700px] sm:w-[500px] md:w-[600px] p-5'>
                    <FormHeading
                        heading={"Registrasi Akun"}
                        info={"Silahkan masukan data pribadi beserta alamat e-mail untuk memulai"}
                    />

                    <form className="flex flex-col gap-4 mt-6" onSubmit={formik.handleSubmit}>
                        <div>
                            <div className="block mb-2">
                                <Label
                                    htmlFor="phone"
                                    value="Nomor Telepon"
                                    color={formik.errors.phone ? 'failure' : ''}
                                />
                            </div>
                            <TextInput
                                id="phone"
                                name='phone'
                                type="number"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                placeholder="08xxxxxxxxxx"
                                color={formik.errors.phone ? 'failure' : ''}
                                helperText={formik.errors.phone}
                                shadow={true}
                            />
                        </div>

                        <div>
                            <div className="block mb-2">
                                <Label
                                    htmlFor="nik"
                                    value="Masukkan NIK KTP anda*"
                                    color={formik.errors.nik ? 'failure' : ''}
                                />
                            </div>
                            <TextInput
                                id="nik"
                                name='nik'
                                type="number"
                                placeholder='32xxxxxxxxxxxxxxx'
                                value={formik.values.nik}
                                onChange={formik.handleChange}
                                color={formik.errors.nik ? 'failure' : ''}
                                helperText={formik.errors.nik}
                                shadow={true}
                            />
                        </div>

                        <div>
                            <div className="block mb-2">
                                <Label
                                    htmlFor="address"
                                    value="Masukkan alamat sesuai KTP*"
                                    color={formik.errors.address ? 'failure' : ''}
                                />
                            </div>
                            <TextInput
                                id="address"
                                name='address'
                                type="text"
                                placeholder='Masukkan alamat'
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                color={formik.errors.address ? 'failure' : ''}
                                helperText={formik.errors.address}
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

export default UpdateData