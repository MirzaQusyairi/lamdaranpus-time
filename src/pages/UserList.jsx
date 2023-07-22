import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import { Table } from "flowbite-react";
import FormHeading from "../components/FormHeading";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      if (data != null) {
        setUsers(data); // [product1,product2,product3]
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="flex justify-center py-2">
      <div className="w-[1200px] sm:w-[800px] md:w-[1000px]">
        <FormHeading
          heading={"User List"}
          info="Daftar user yang terdaftar dalam sistem"
        />

        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Nama</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>NIK</Table.HeadCell>
            <Table.HeadCell>Alamat</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users.map((user) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={user.id}
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {user.full_name}
                </Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.nik}</Table.Cell>
                <Table.Cell>{user.address}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};
export default UserList;
