import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import supabase from "../config/supabaseClient";
import Navigation from "../components/Navigation";
import FormHeading from "../components/FormHeading";
import { useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Select, Radio, Alert } from "flowbite-react";
import DashboardHeading from "../components/DashboardHeading";
import BottomNav from "../components/BottomNav";

const QueueRegisterForOther = () => {
  const navigate = useNavigate();
  const [bpjs, setBpjs] = useState(false);
  const [selectedPoli, setSelectedPoli] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [isQueueExcedeed, setIsQueueExcedeed] = useState(false);
  const [timeSlot, setTimeSlot] = useState();
  const [queueNumber, setQueueNumber] = useState();
  const [queueData, setQueueData] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [availableQueueNumbers, setAvailableQueueNumbers] = useState([]);

  async function getUserMetadata() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let metadata = user;
    return metadata;
  }

  async function getUserQueueNumber(poli) {
    const { data, error } = await supabase
      .from("queues")
      .select("queue")
      .eq("poli", poli)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    let queueNumber = 1;
    if (data.length > 0 && data[0].queue) {
      queueNumber = parseInt(data[0].queue) + 1;
    }

    return queueNumber;
  }

  async function getTimeSlot(poli) {
    const { data, error } = await supabase
      .from("queues")
      .select("queue")
      .eq("poli", poli);

    if (error) throw error;

    setQueueData(data);
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      status: "",
      poli: "",
      jenis_kelamin: "",
      tgl_lahir: "",
      category: "",
      no_bpjs: "",
      jenis_poli_umum: "",
      nik: "",
      timeSlot: "",
      phone: "",
    },
    validationSchema: Yup.object({
      poli: Yup.string().required("Poli harus diisi"),
      category: Yup.string().required("Kategori pasien harus diisi"),
      name: Yup.string()
        .required("Nama harus diisi")
        .min(4, "Harap isi nama dengan benar"),
      jenis_kelamin: Yup.string().required("Jenis Kelamin harus diisi"),
      tgl_lahir: Yup.string().required("Tanggal Lahir harus diisi"),
      jenis_poli_umum: Yup.string().test(
        "conditional-required",
        "Jenis Poli Umum harus diisi",
        function (value) {
          const { poli } = this.parent;
          if (poli === "Poli Umum") {
            return !!value;
          }
          return true;
        }
      ),
      no_bpjs: Yup.string()
        .test(
          "conditional-required",
          "Nomor BPJS harus diisi",
          function (value) {
            const { category } = this.parent;
            if (category === "BPJS") {
              return !!value;
            }
            return true;
          }
        )
        .transform((value) => (value ? value.replace(/\D/g, "") : ""))
        .matches(/^\d*$/, "Mohon isi nomor BPJS dengan benar")
        .min(13, "Mohon isi nomor BPJS anda dengan benar")
        .max(13, "Mohon isi nomor BPJS anda dengan benar"),
      nik: Yup.string()
        .min(16, "Mohon isi NIK anda dengan benar")
        .max(16, "Mohon isi NIK anda dengan benar")
        .required("Nomor KTP harus diisi"),
      timeSlot: Yup.string().required("Waktu kunjungan harus diisi"),
      phone: Yup.string()
        .transform((value) => (value ? value.replace(/\D/g, "") : ""))
        .matches(/^\d*$/, "Mohon isi nomor telepon dengan benar")
        .min(2, "Mohon isi nomor telepon dengan benar")
        .max(13, "Mohon isi nomor telepon dengan benar")
        .required("Nomor telepon harus diisi"),
    }),

    onSubmit: async (values) => {
      const metadata = await getUserMetadata();
      const user_id = metadata.id;

      const { data: existingQueues, error: existingQueuesError } =
        await supabase.from("queues").select().eq("user_id", user_id);

      if (existingQueuesError) {
        setShowAlert(true);
        setErrorAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setErrorAlert(false);
        }, 3000);
        return;
      }

      if (existingQueues.length >= 2) {
        setShowAlert(true);
        setErrorAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setErrorAlert(false);
        }, 3000);
        return;
      }

      const { poli } = values;

      if (queueNumber > 11) {
        setIsQueueExcedeed(true);
        setTimeout(() => {
          setIsQueueExcedeed(false);
        }, 3000);
        return;
      }

      const {
        name,
        jenis_kelamin,
        tgl_lahir,
        category,
        no_bpjs,
        jenis_poli_umum,
        nik,
        phone,
      } = values;

      try {
        const { error } = await supabase.from("queues").insert([
          {
            user_id: user_id,
            name: name,
            poli: poli,
            status: "queued",
            jenis_kelamin: jenis_kelamin,
            queue: queueNumber,
            tgl_lahir: tgl_lahir,
            category: category,
            no_bpjs: no_bpjs,
            jenis_poli_umum: jenis_poli_umum,
            nik: nik,
            phone: phone,
          },
        ]);

        const { errorHistory } = await supabase.from("history").insert([
          {
            user_id: user_id,
            name: name,
            poli: poli,
            status: "queued",
            jenis_kelamin: jenis_kelamin,
            queue: queueNumber,
            tgl_lahir: tgl_lahir,
            category: category,
            no_bpjs: no_bpjs,
            jenis_poli_umum: jenis_poli_umum,
            nik: nik,
          },
        ]);

        if (error) throw error;

        if (errorHistory) throw error;

        navigate("/antrian-saya");
      } catch (error) {
        alert(error.message);
      }
    },
  });

  useEffect(() => {
    async function fetchData() {
      const poli = formik.values.poli;
      await getTimeSlot(poli);
    }

    fetchData();
  }, [formik.values.poli]);

  useEffect(() => {
    setTimeSlot(formik.values.timeSlot);
  }, [formik.values.timeSlot]);

  useEffect(() => {
    const occupiedQueueNumbers = queueData.map((queue) => queue.queue);

    const allQueueNumbers = Array.from({ length: 11 }, (_, index) => index + 1);

    const filteredQueueNumbers = allQueueNumbers.filter(
      (queueNumber) => !occupiedQueueNumbers.includes(queueNumber)
    );

    setAvailableQueueNumbers(filteredQueueNumbers);
  }, [queueData]);

  useEffect(() => {
    const timeSlots = {
      1: "08.00",
      2: "08.20",
      3: "08.40",
      4: "09.00",
      5: "09.20",
      6: "09.40",
      7: "10.00",
      8: "10.20",
      9: "10.40",
      10: "11.00",
      11: "11.20",
    };

    // with current time constraint
    //   const currentTime = new Date();
    //   const currentHour = currentTime.getHours();
    //   const currentMinute = currentTime.getMinutes();
    //   const currentFormattedTime = `${currentHour < 10 ? "0" + currentHour : currentHour
    //     }.${currentMinute < 10 ? "0" + currentMinute : currentMinute}`;

    //   let availableSlots;

    //   if (currentFormattedTime < "07.00") {
    //     availableSlots = availableQueueNumbers.map((queueNumber) => timeSlots[queueNumber]);
    //   } else {
    //     availableSlots = availableQueueNumbers
    //       .filter((queueNumber) => timeSlots[queueNumber] > currentFormattedTime)
    //       .map((queueNumber) => timeSlots[queueNumber]);
    //   }

    //   setAvailableTimeSlots(availableSlots);
    // }, [availableQueueNumbers]);

    // without current time constraint
    const availableSlots = availableQueueNumbers.map(
      (queueNumber) => timeSlots[queueNumber]
    );

    setAvailableTimeSlots(availableSlots);
  }, [availableQueueNumbers]);
  useEffect(() => {
    switch (timeSlot) {
      case "08.00":
        setQueueNumber(1);
        break;
      case "08.20":
        setQueueNumber(2);
        break;
      case "08.40":
        setQueueNumber(3);
        break;
      case "09.00":
        setQueueNumber(4);
        break;
      case "09.20":
        setQueueNumber(5);
        break;
      case "09.40":
        setQueueNumber(6);
        break;
      case "10.00":
        setQueueNumber(7);
        break;
      case "10.20":
        setQueueNumber(8);
        break;
      case "10.40":
        setQueueNumber(9);
        break;
      case "11.00":
        setQueueNumber(10);
        break;
      case "11.20":
        setQueueNumber(11);
        break;

      default:
        break;
    }
  }, [timeSlot]);

  const handlePoli = (e) => {
    e.persist();
    formik.handleChange(e);
    setSelectedPoli(e.target.value);
  };

  const handleBpjsStatus = (e) => {
    e.persist();
    formik.handleChange(e);
    setBpjs(true);
  };

  const handleNonBpjsStatus = (e) => {
    e.persist();
    formik.handleChange(e);
    setBpjs(false);
  };

  return (
    <div className="mb-[100px]">
      <DashboardHeading
        linkTo="/welcome"
        heading="Layanan Mudah Pendaftaran & Antrian Pasien Puskesmas (LAMDARANPUS)"
      />
      {showAlert && (
        <Alert color={errorAlert ? "failure" : "success"}>
          <span>
            <span className="font-medium">
              {errorAlert ? "Gagal" : "Berhasil"}
            </span>{" "}
            {""}
            {errorAlert
              ? "mendaftar lebih dari 2 antrian"
              : "mendaftar antrian"}
          </span>
        </Alert>
      )}
      {isQueueExcedeed && (
        <Alert color="failure">
          <span>
            <span className="font-medium">Gagal!</span> {""}
            Antrian sudah penuh
          </span>
        </Alert>
      )}
      <Navigation currentPage={"Daftar untuk orang lain"} />

      <div className="flex justify-center pt-2">
        <div className="w-[700px] sm:w-[500px] md:w-[600px] p-5">
          <FormHeading
            heading={"Pendaftaran Antrian"}
            info={"Silahkan isi data dibawah ini"}
          />

          <form
            className="flex flex-col gap-4 mt-6"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="poli"
                  value="Poli"
                  color={formik.errors.poli ? "failure" : ""}
                />
              </div>
              <Select
                as="select"
                id="poli"
                name="poli"
                value={formik.values.poli}
                onChange={handlePoli}
                helperText={formik.errors.poli}
                color={formik.errors.poli ? "failure" : ""}
              >
                <option value="" disabled>
                  Pilih Poli
                </option>
                <option value="Poli TB">Poli TB</option>
                <option value="Poli Infeksius">Poli Infeksius</option>
                <option value="Poli Umum">Poli Umum</option>
                <option value="Poli Kesehatan Ibu dan Anak">
                  Poli Kesehatan Ibu dan Anak
                </option>
                <option value="Poli Gigi">Poli Gigi</option>
              </Select>
              {selectedPoli === "Poli Umum" && (
                <div className="block mt-2">
                  <Label
                    value="Jenis Poli Umum"
                    color={formik.errors.jenis_poli_umum ? "failure" : ""}
                  />

                  <div className="flex items-center gap-2 mt-2">
                    <Radio
                      id="Balita"
                      name="jenis_poli_umum"
                      value="Balita"
                      onChange={formik.handleChange}
                    />
                    <Label
                      htmlFor="Balita"
                      value="Manajemen Terpadu Balita Sakit (0 s/d 5 tahun)"
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Radio
                      id="Umum"
                      name="jenis_poli_umum"
                      value="Umum"
                      onChange={formik.handleChange}
                    />
                    <Label htmlFor="Umum" value="Umum (6 s/d 45 tahun)" />
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Radio
                      id="Lansia"
                      name="jenis_poli_umum"
                      value="Lansia"
                      onChange={formik.handleChange}
                    />
                    <Label htmlFor="Lansia" value="Lansia (> 45 Tahun)" />
                  </div>
                  {formik.errors.jenis_poli_umum && (
                    <div className="mt-2">
                      <Label
                        value={formik.errors.jenis_poli_umum}
                        color="failure"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="nama"
                  value="Nama Lengkap"
                  color={formik.errors.name ? "failure" : ""}
                />
              </div>
              <TextInput
                id="name"
                name="name"
                type="text"
                placeholder="Dadang Sudrajat"
                value={formik.values.name}
                onChange={formik.handleChange}
                color={formik.errors.name ? "failure" : ""}
                helperText={formik.errors.name}
                shadow={true}
              />
            </div>
            {availableTimeSlots.length > 0 ? (
              <div>
                <div className="block mb-2">
                  <Label htmlFor="timeSlot" value="Pilih Waktu" />
                </div>
                <Select
                  as="select"
                  id="timeSlot"
                  name="timeSlot"
                  value={formik.values.timeSlot}
                  onChange={formik.handleChange}
                >
                  <option value="" disabled>
                    Pilih Waktu Pendaftaran
                  </option>
                  {availableTimeSlots.map((timeSlot) => (
                    <option key={timeSlot} value={timeSlot}>
                      {timeSlot}
                    </option>
                  ))}
                </Select>
                {formik.errors.timeSlot && (
                  <div className="mt-2">
                    <Label value={formik.errors.timeSlot} color="failure" />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="block mb-2">
                  <Label htmlFor="timeSlot" value="Pilih Waktu" />
                </div>
                <Select
                  as="select"
                  id="timeSlot"
                  name="timeSlot"
                  value={formik.values.timeSlot}
                  onChange={formik.handleChange}
                  disabled
                >
                  <option value="" disabled>
                    Waktu pendaftaran sudah habis
                  </option>
                </Select>
              </div>
            )}

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="nik"
                  value="No. KTP"
                  color={formik.errors.nik ? "failure" : ""}
                />
              </div>
              <TextInput
                id="nik"
                name="nik"
                type="number"
                placeholder="Masukkan nomor NIK anda"
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
                  htmlFor="phone"
                  value="Nomor Telepon*"
                  color={formik.errors.phone ? "failure" : ""}
                />
              </div>
              <TextInput
                id="phone"
                name="phone"
                type="text"
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
                  htmlFor="tgl_lahir"
                  value="Tanggal Lahir"
                  color={formik.errors.tgl_lahir ? "failure" : ""}
                />
              </div>
              <TextInput
                id="tgl_lahir"
                name="tgl_lahir"
                type="date"
                placeholder="DD-MM-YYYY"
                value={formik.values.tgl_lahir}
                onChange={formik.handleChange}
                color={formik.errors.tgl_lahir ? "failure" : ""}
                helperText={formik.errors.tgl_lahir}
                shadow={true}
              />
            </div>

            <div>
              <div className="block mb-2">
                <Label
                  htmlFor="jenis_kelamin"
                  value="Jenis Kelamin"
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
                helperText={formik.errors.jenis_kelamin}
              >
                <option key="0" value="" disabled>
                  Jenis Kelamin
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
                  htmlFor="category"
                  value="Kategori Pasien"
                  color={formik.errors.category ? "failure" : ""}
                />
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="BPJS"
                  name="category"
                  value="BPJS"
                  onChange={handleBpjsStatus}
                />
                <Label htmlFor="BPJS">BPJS</Label>
              </div>
              {bpjs && (
                <div className="block mt-2 mb-3">
                  <div className="block mb-2">
                    <Label
                      htmlFor="no_bpjs"
                      value="Harap isi nomor BPJS anda"
                      color={formik.errors.no_bpjs ? "failure" : ""}
                    />
                  </div>
                  <TextInput
                    id="no_bpjs"
                    name="no_bpjs"
                    type="text"
                    value={formik.values.no_bpjs}
                    onChange={formik.handleChange}
                    color={formik.errors.no_bpjs ? "failure" : ""}
                    shadow={true}
                    helperText={formik.errors.no_bpjs}
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <Radio
                  id="nonBPJS"
                  name="category"
                  value="Non BPJS"
                  onChange={handleNonBpjsStatus}
                />
                <Label htmlFor="nonBPJS">Non BPJS</Label>
              </div>
              {formik.errors.category && (
                <div className="mt-2">
                  <Label value={formik.errors.category} color="failure" />
                </div>
              )}
            </div>
            <Button type="submit">Selanjutnya</Button>
          </form>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default QueueRegisterForOther;
