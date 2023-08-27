import jsPDF from "jspdf";
import "jspdf-autotable";
// Date Fns is used to format the dates we receive
// from our API call
import { format } from "date-fns";

// define a generatePDF function that accepts a patient argument
const generatePDF = (patients, poli) => {
  // initialize jsPDF
  const doc = new jsPDF();

  let number = 1;
  // define the columns we want and their titles
  const tableColumn = ["No", "Nama Pasien", "NIK", "Tanggal | Waktu", "Poli", "Status"];
  // define an empty array of rows
  const tableRows = [];

  // for each patient pass all its data into an array
  patients.forEach(patient => {
    const patientData = [
      number++,
      patient.name,
      patient.nik,
      format(new Date(patient.queue_date,), "dd-MM-yyyy") + " | " + patient.queue_time,
      patient.poli,
      patient.status == "done" ? "SELESAI BEROBAT" : "BELUM SELESAI"
    ];
    // push each patient's info into a row
    tableRows.push(patientData);
  });


  // startY is basically margin-top
  doc.autoTable(tableColumn, tableRows, { startY: 20 });
  var width = doc.internal.pageSize.getWidth()
  const date = Date().split(" ");
  // we use a date string to generate our filename.
  const dateStr = date[0] + date[2] + date[1] + date[3] + date[4];
  // patient title. and margin-top + margin-left
  doc.text("Data Pasien " + poli, width / 2, 15, { align: "center" });
  // we define the name of our PDF file.
  doc.save(`Laporan Data Pasien ${poli + ' ' + dateStr}.pdf`);
};

export default generatePDF;