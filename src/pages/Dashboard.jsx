import DashboardFilter from "../features/dashboard/DashboardFilter";
import { useState } from "react";
import DashboardLayout from "../features/dashboard/DashboardLayout";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import DatePicker from "react-datepicker";
import Button from "../ui/Button";

function Dashboard() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const resetDates = () => {
    setStartDate(null);
    setEndDate(null);
  };
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Rezervacije za preuzimanje/štampanje</Heading>
      </Row>

      <Row type="horizontal">
        <div>
          {/* <p style={{ fontSize: "1.5rem" }}>Prikaz rezervacija za</p> */}
          {/* <DashboardFilter /> */}
          <p style={{ fontSize: "1.5rem" }}>Pretraga rezervacija po datumu</p>

          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Početni datum"
            dateFormat="dd.MM"
            popperContainer={({ children }) => <div>{children}</div>}
          />
          <br />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="Krajnji datum"
            dateFormat="dd.MM"
            popperContainer={({ children }) => <div>{children}</div>}
          />
          <br />

          <Button variation="secondary" size="small" onClick={resetDates}>
            Resetuj datume
          </Button>
        </div>
      </Row>

      <DashboardLayout startDate={startDate} endDate={endDate} />
    </>
  );
}

export default Dashboard;
