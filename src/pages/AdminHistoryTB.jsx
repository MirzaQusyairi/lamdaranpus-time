import React, { useState, useEffect } from "react";
import DashboardHeading from "../components/DashboardHeading";
import CardStats from "../components/CardStats";
import supabase from "../config/supabaseClient";
import { useFormik } from "formik";
import { TextInput, Alert, Table, Button } from "flowbite-react";
import search from "../assets/search.svg";
import { useNavigate } from "react-router-dom";
import generatePDF from "../services/reportGenerator";

function AdminHistoryTB() {
  const [users, setUsers] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  const [showAlert, setShowAlert] = useState(false);

  const [errorAlert, setErrorAlert] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      searchValue: "",
      reportDate: "",
    },
    onSubmit: async (values) => {
      try {
        const { data, error } = await supabase
          .from("history")
          .select("*")
          .ilike("name", `%${values.searchValue}%`);

        if (data) {
          setSearchResults(data);
        }

        if (error) {
          throw error;
        }
      } catch (error) {
        alert(error.message);
      }
    },
  });

  async function getQueue() {
    try {
      const { data, error } = await supabase.from("history").select("*").order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    getQueue();
  }, []);

  useEffect(() => {
    const listener = supabase
      .channel("any")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "queues",
        },
        (payload) => {
          setUsers([payload.new, ...users]);
        }
      )
      .subscribe();

    // subscription cleanup
    return () => {
      supabase.removeChannel(listener);
    };
  }, [users]);

  async function handleDone(id) {
    try {
      const { error: selectError } = await supabase
        .from("history")
        .select("*")
        .eq("id", id)
        .single();

      if (selectError) throw selectError;

      const { error: deleteError } = await supabase
        .from("history")
        .delete()
        .eq("id", id);

      if (!deleteError) {
        setUsers(users.filter((user) => user.id !== id));
        setShowAlert(true);
        setErrorAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    } catch (error) {
      setShowAlert(true);
      setErrorAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } finally {
      setErrorAlert(false);
    }
  }

  const pasienTB =
    searchResults.length > 0
      ? searchResults.filter((user) => user.poli === "Poli TB")
      : users.filter((user) => user.poli === "Poli TB");

  const DataPasienTB =
    formik.values.reportDate !== ""
      ? users.filter((user) => user.poli === "Poli TB" && user.queue_date === formik.values.reportDate) : users.filter((user) => user.poli === "Poli TB");

  return (
    <div className="mb-[100px]">
      <DashboardHeading heading="Halaman Admin Layanan Mudah Pendaftaran & Antrian Puskesmas (LAMDARANPUS)" linkTo="/welcome" />
      {showAlert && (
        <Alert color={errorAlert ? "failure" : "success"}>
          <span>
            <span className="font-medium">
              {errorAlert ? "Gagal" : "Berhasil"}
            </span>{" "}
            {""}
            {errorAlert ? "menghapus antrian" : "menghapus antrian"}
          </span>
        </Alert>
      )}
      <div className="flex">
        <h1 className="font-inter font-bold text-[30px] mt-[61px] ml-[79px]">
          Histori Pasien
        </h1>
        <button
          className="w-[183px] h-[42px] mt-[70px] ml-[750px] rounded-[11px] bg-[#FE6D05]"
          type="button"
          onClick={() => navigate("/manage-queue-tb")}
        >
          <p className="font-inter font-bold text-white text-[13px]">
            LIHAT KELOLA ANTRIAN
          </p>
        </button>
        <form
          onSubmit={formik.handleSubmit}
          className="mt-[70px] flex ml-[10px]"
        >
          <TextInput
            id="searchValue"
            name="searchValue"
            value={formik.values.searchValue}
            onChange={formik.handleChange}
            placeholder="Cari Pasien"
          />
          <button
            type="submit"
            className="w-[41px] h-[42px] bg-[#08AD36] rounded-[11px] ml-[5px]"
          >
            <img src={search} alt="search" className="ml-[11px]" />
          </button>
        </form>
      </div>
      <div className="flex justify-center gap-[70px] mt-[46px]">
        <CardStats namaPoli="Poli TB" Link="/histori-tb" />
        <CardStats namaPoli="Poli Infeksius" Link="/histori-infeksius" />
        <CardStats namaPoli="Poli Umum" Link="/histori-umum" />
        <CardStats namaPoli="Poli KIA" Link="/histori-kia" />
        <CardStats namaPoli="Poli Gigi" Link="/histori-gigi" />
      </div>
      <div className="flex justify-end mx-20 mt-[40px]">
        <div className="mr-2">
          <TextInput
            id="reportDate"
            name="reportDate"
            type="date"
            onChange={formik.handleChange}
            shadow={true}
          />
        </div>
        <Button color={"success"} onClick={() => generatePDF(DataPasienTB, "Poli TB")}>
          Cetak Laporan
        </Button>
      </div>
      <div className="flex justify-center">
        <div className="w-[1370px] mt-[10px]">
          <Table>
            <Table.Head>
              <Table.HeadCell>Nama Pasien</Table.HeadCell>
              <Table.HeadCell>TANGGAL | WAKTU</Table.HeadCell>
              <Table.HeadCell>POLI/JENIS POLI</Table.HeadCell>
              <Table.HeadCell>KATEGORI PASIEN</Table.HeadCell>
              <Table.HeadCell>STATUS</Table.HeadCell>
              <Table.HeadCell>ACTION</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {pasienTB.length === 0 ? (
                <Table.Row>
                  <Table.Cell>
                    <p className="font-inter font-bold text-black">
                      Tidak ada Antrian pada Poli TB
                    </p>
                  </Table.Cell>
                </Table.Row>
              ) : (
                pasienTB.map((user) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={user.id}
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <p className="font-inter font-bold text-black">
                        {user.name}
                      </p>
                    </Table.Cell>

                    <Table.Cell>
                      <p className="font-inter font-bold text-black">
                        {new Date(user.queue_date).toLocaleDateString('es-CL',)} | {user.queue_time}
                      </p>
                    </Table.Cell>

                    <Table.Cell>
                      <p className="font-inter font-bold text-black">
                        {user.poli}
                      </p>
                    </Table.Cell>

                    <Table.Cell>
                      <p className="font-inter font-bold text-black">
                        {user.category}
                      </p>
                    </Table.Cell>
                    <Table.Cell>
                      <p className="font-inter font-bold text-black">
                        {user.status == "done" ? "SELESAI BEROBAT" : "BELUM SELESAI"}
                      </p>
                    </Table.Cell>
                    <Table.Cell>
                      {/* <button
                        className="w-[93px] h-[29px] mt-[10px] rounded-[11px] bg-[#FC0404]"
                        type="button"
                        onClick={() => handleDone(user.id)}
                      >
                        <p className="font-inter font-bold text-white text-[11px]">
                          SELESAIKAN
                        </p>
                      </button> */}

                      <button
                        className="w-[93px] h-[29px] mt-[10px] rounded-[11px] ml-[10px] bg-[#1565D8]"
                        type="button"
                        onClick={() => navigate(`/histori-detail/${user.id}`)}
                      >
                        <p className="font-inter font-bold text-white text-[11px]">
                          LIHAT DETAIL
                        </p>
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default AdminHistoryTB;
