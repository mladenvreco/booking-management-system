import Heading from "../ui/Heading";
import Row from "../ui/Row";
import CabinTable from "../features/cabins/CabinTable";
import AddCabin from "../features/cabins/AddCabin";
import Button from "../ui/Button";
import { useState } from "react";
import DatePicker from "react-datepicker";

function Cabins() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const resetDates = () => {
    setStartDate(null);
    setEndDate(null);
  };
  return (
    <>
      <Heading as="h1">Bungalovi</Heading>
      {/* <BookingTableOperations /> */}

      <Row type="horizontal" style={{ alignItems: "flex-end" }}>
        <AddCabin />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <p style={{ lineHeight: "1" }}>
              Provjeri dostupne bungalove za određen datum
            </p>

            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Od"
              dateFormat="dd.MM"
              popperContainer={({ children }) => <div>{children}</div>}
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Do"
              dateFormat="dd.MM"
              popperContainer={({ children }) => <div>{children}</div>}
            />

            <Button variation="secondary" size="small" onClick={resetDates}>
              Resetuj datume
            </Button>
          </div>
        </div>

        {/* <BookingTableOperations /> */}
      </Row>

      <Row>
        <CabinTable startDate={startDate} endDate={endDate} />
      </Row>
    </>
  );
}

export default Cabins;
