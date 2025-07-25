import Heading from "../ui/Heading";
import Row from "../ui/Row";
import CabinTable from "../features/cabins/CabinTable";
import AddCabin from "../features/cabins/AddCabin";
import Button from "../ui/Button";
import { useState } from "react";
import DatePicker from "react-datepicker";
import Date from "../ui/Date";

function Cabins() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <>
      <Heading as="h1">Bungalovi</Heading>
      {/* <BookingTableOperations /> */}

      <Row type="horizontal" style={{ alignItems: "flex-end" }}>
        <AddCabin />

        <Date
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        >
          Provjeri sve slobodne bungalove
        </Date>

        {/* <BookingTableOperations /> */}
      </Row>

      <Row>
        <CabinTable startDate={startDate} endDate={endDate} />
      </Row>
    </>
  );
}

export default Cabins;
