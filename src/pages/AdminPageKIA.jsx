import React, { useState, useEffect } from "react";
import DashboardHeading from "../components/DashboardHeading";
import CardStats from "../components/CardStats";
import supabase from "../config/supabaseClient";
import { useFormik } from "formik";
import { TextInput, Alert, Table, Button, Select } from "flowbite-react";
import search from "../assets/search.svg";
import { useNavigate } from "react-router-dom";

function AdminPageKIA() {
  const [users, setUsers] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  const [showAlert, setShowAlert] = useState(false);

  const [errorAlert, setErrorAlert] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      searchValue: "",
    },
    onSubmit: async (values) => {
      try {
        const { data, error } = await supabase
          .from("queues")
          .select("*")
          .ilike("name", `%${values.searchValue}%`);

        if (data) {
          setSearchResults(data);
          console.log(searchResults);
        }

        if (error) {
          throw error;
        }
      } catch (error) {
        alert(error.message);
      }
    },
  });

  function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  async function getQueue() {
    try {
      const { data, error } = await supabase.from("queues").select("*").eq("queue_date", formatDateToYYYYMMDD(new Date()));
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
          setUsers([...users, payload.new]);
        }
      )
      .subscribe();

    // subscription cleanup
    return () => {
      supabase.removeChannel(listener);
    };
  }, [users]);

  const handleDropQueue = async (poli) => {
    try {
      // Get the row from the queues table with the given ID
      // const { data: queue, error: queueError } = await supabase
      //   .from("queues")
      //   .select("*")
      //   .eq("poli", poli);

      // Insert the row into the done table
      // const { error: insertError } = await supabase
      //   .from("history")
      //   .insert(queue);

      // Delete the row from the queues table
      const { error: deleteError } = await supabase
        .from("queues")
        .delete()
        .eq("poli", poli);

      if (deleteError) throw deleteError;
      getQueue();
    } catch (error) {
      setShowAlert(true);
      setErrorAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };

  async function updateStatus(id, status, queue_date, queue_time) {
    const { dataQueue, errorQueue } = await supabase
      .from("queues")
      .update({
        status: status,
      })
      .eq("id", id);

    const { data, error } = await supabase
      .from("history")
      .update({
        status: status,
      })
      .eq("queue_date", queue_date).eq("queue_time", queue_time);

    if (errorQueue) throw errorQueue;
  }

  const pasienKIA =
    searchResults.length > 0
      ? searchResults.filter(
        (user) => user.poli === "Poli Kesehatan Ibu dan Anak"
      )
      : users.filter((user) => user.poli === "Poli Kesehatan Ibu dan Anak");

  return (
    <div className="mb-[100px]">
      <DashboardHeading heading="Halaman Admin Layanan Mudah Pendaftaran & Antrian Puskesmas (LAMDARANPUS)" linkTo="/welcome" />
      {showAlert && (
        <Alert color={errorAlert ? "failure" : "success"}>
          <span>
            <span className="font-medium">
              {errorAlert ? "Gagal" : "Berhasil"}
            </span>{" "}
            {errorAlert
              ? "menyelesaikan antrian, silahkan coba lagi"
              : "menyelesaikan antrian"}
          </span>
        </Alert>
      )}
      <div className="flex">
        <h1 className="font-inter font-bold text-[30px] mt-[61px] ml-[79px]">
          Kelola Antrian
        </h1>
        <button
          className="w-[183px] h-[42px] mt-[70px] ml-[750px] rounded-[11px] bg-[#FE6D05]"
          type="button"
          onClick={() => navigate("/histori-kia")}
        >
          <p className="font-inter font-bold text-white text-[13px]">
            LIHAT HISTORI ANTRIAN
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
        <CardStats namaPoli="Poli TB" Link="/manage-queue-tb" />
        <CardStats namaPoli="Poli Infeksius" Link="/manage-queue-infeksius" />
        <CardStats namaPoli="Poli Umum" Link="/manage-queue-umum" />
        <CardStats namaPoli="Poli KIA" Link="/manage-queue-kia" />
        <CardStats namaPoli="Poli Gigi" Link="/manage-queue-gigi" />
      </div>

      <div className="flex justify-center">
        <div className="w-[1370px] mt-[61px]">
          <Table>
            <Table.Head>
              <Table.HeadCell>Nama Pasien</Table.HeadCell>
              <Table.HeadCell>Nomor Antrian</Table.HeadCell>
              <Table.HeadCell>TANGGAL | WAKTU</Table.HeadCell>
              <Table.HeadCell>POLI/JENIS POLI</Table.HeadCell>
              <Table.HeadCell>KATEGORI PASIEN</Table.HeadCell>
              <Table.HeadCell>STATUS</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {pasienKIA.length === 0 ? (
                <Table.Row>
                  <Table.Cell>
                    <p className="font-inter font-bold text-black">
                      Tidak ada Antrian pada Poli KIA
                    </p>
                  </Table.Cell>
                </Table.Row>
              ) : (
                pasienKIA.map((user) => (
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
                        {user.queue}
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
                      <Select
                        as="select"
                        id="poli"
                        name="poli"
                        // value={user.status}
                        onChange={(e) => updateStatus(user.id, e.target.value, user.queue_date, user.queue_time)}
                      >
                        <option value="queued" selected={user.status == "queued"}>DALAM ANTRIAN</option>
                        <option value="check" selected={user.status == "check"}>SEDANG DIPERIKSA</option>
                        <option value="done" selected={user.status == "done"}>SELESAI BEROBAT</option>
                      </Select>
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        className="w-[93px] h-[29px] mt-[10px] ml-[10px] rounded-[11px] bg-[#1565D8]"
                        type="button"
                        onClick={() => navigate(`/pasien-detail/${user.id}`)}
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

export default AdminPageKIA;
