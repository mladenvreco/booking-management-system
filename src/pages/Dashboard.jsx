import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import DashboardLayout from "../features/dashboard/DashboardLayout";
import { useNextBookings } from "../features/dashboard/useNextBookings";
import Button from "../ui/Button";
import Date from "../ui/Date";
import Empty from "../ui/Empty";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Spinner from "../ui/Spinner";
import { exportToCSV } from "../utils/exportcsv";
import { exportToPDF } from "../utils/exportpdf";

const StyledExportButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;

  @media (max-width: 768px) {
    flex-direction: column; /* Ovdje prebacujemo na kolonu na malim ekranima */
    justify-content: flex-start; /* Ili left kako si imao */
    button {
      padding: 0.5rem;
      font-size: 1.4rem;
      width: 100%; /* Opcionalno, da dugmad budu pune širine */
    }
  }
`;

function Dashboard() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch bookings here
  const { bookings, isLoading } = useNextBookings(startDate, endDate);

  // Get narednih from URL if needed
  const searchParams = new URLSearchParams(window.location.search);
  let narednih = searchParams.get("narednih");
  if (searchParams.size === 0) narednih = 1;

  function callExportCSV() {
    exportToCSV({ bookings, startDate, endDate, toast });
  }

  function callExportPDF() {
    exportToPDF({ bookings, startDate, endDate, toast, narednih });
  }

  if (isLoading) return <Spinner />;
  if (!bookings || bookings.length === 0)
    return <Empty resourceName="rezervacija" />;

  return (
    <>
      <Heading as="h1">Rezervacije za preuzimanje/štampanje</Heading>

      <Row type="horizontal" style={{ alignItems: "flex-end" }}>
        {/* <DashboardFilter /> */}
        <StyledExportButtons>
          <Button onClick={callExportCSV}>Preuzmi CSV</Button>
          <Button onClick={callExportPDF}>Preuzmi PDF</Button>
        </StyledExportButtons>
        <Date
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        >
          Pretraži rezervacije po datumu
        </Date>
      </Row>

      <DashboardLayout
        bookings={bookings}
        startDate={startDate}
        endDate={endDate}
      />
    </>
  );
}

export default Dashboard;
