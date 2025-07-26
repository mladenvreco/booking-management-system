import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import DashboardLayout from "../features/dashboard/DashboardLayout";
import { useNextBookings } from "../features/dashboard/useNextBookings";
import Button from "../ui/Button";
import DateComponent from "../ui/Date";
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
    flex-direction: column;
    justify-content: flex-start;
  }
`;

function Dashboard() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { bookings, isLoading } = useNextBookings(startDate, endDate);

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
        <StyledExportButtons>
          <Button onClick={callExportCSV}>Preuzmi CSV</Button>
          <Button onClick={callExportPDF}>Preuzmi PDF</Button>
        </StyledExportButtons>
        <DateComponent
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        >
          Pretraži rezervacije po datumu
        </DateComponent>
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
