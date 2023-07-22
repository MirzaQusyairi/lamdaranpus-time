import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import supabase from "../config/supabaseClient";
import Navigation from "../components/Navigation";
import FormHeading from "../components/FormHeading";
import { Link } from "react-router-dom";
import { Label, TextInput, Button, Alert } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import WelcomeDashboardHeading from "../components/WelcomeDashboardHeading";

const AdminLogin = () => {
  const [errorAlert, setErrorAlert] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const getUserMetaData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let metadata = user;
    return metadata;
  };

  async function getUserData() {
    const metadata = await getUserMetaData();
    const user_email = metadata.email;
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", user_email);
      if (error) throw error;

      if (data) {
        return data;
        // setUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Mohon isi email dengan benar")
        .required("Email harus diisi"),

      password: Yup.string()
        .min(8, "Password harus lebih dari 8 karakter")
        .required("Password harus diisi"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const { email, password } = values;

        const { error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        // if user is registered
        if (!error) {
          const userData = await getUserData();

          if (
            Array.isArray(userData) &&
            userData.some((user) => user.roles === "admin")
          ) {
            navigate("/manage-queue-tb");
          } else {
            setShowAlert(true);
            setErrorAlert(true);
          }
        } else {
          setErrorAlert(true);
          setShowAlert(true);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="mb-[100px]">
      <WelcomeDashboardHeading heading="Halaman Admin Layanan Mudah Pendaftaran & Antrian Puskesmas (LAMDARANPUS)" />
      <Navigation />

      {showAlert && (
        <Alert color={errorAlert && "failure"}>
          <span>
            <span className="font-medium">
              {errorAlert && "Password atau email salah!"}
            </span>{" "}
            {errorAlert && "Silahkan cek kembali email dan password anda"}
          </span>
        </Alert>
      )}

      <div className="sm:flex justify-center pt-2">
        <div className="w-[414px] sm:w-[700px] p-5">
          <FormHeading
            heading={"Admin Sign In"}
            info={"Masukkan alamat email dan password yang telah terdaftar"}
          />

          <form
            className="flex flex-col gap-4 mt-6"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="email"
                  value="Masukkan alamat email"
                  color={formik.errors.email ? "failure" : ""}
                />
              </div>
              <TextInput
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="emailanda@gmail.com"
                color={formik.errors.email ? "failure" : ""}
                helperText={formik.errors.email}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="password"
                  value="Masukkan password"
                  color={formik.errors.password ? "failure" : ""}
                />
              </div>
              <TextInput
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                color={formik.errors.password ? "failure" : ""}
                helperText={formik.errors.password}
                shadow={true}
              />
            </div>
            <Button type="submit" disabled={loading ? true : ""}>
              {loading ? "Memuat..." : "Masuk"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
