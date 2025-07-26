import { useState } from "react";
import AddCabin from "../features/cabins/AddCabin";
import CabinTable from "../features/cabins/CabinTable";
import DateComponent from "../ui/Date";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Cabins() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <>
      <Heading as="h1">Bungalovi</Heading>
      {/* <BookingTableOperations /> */}

      <Row type="horizontal" style={{ alignItems: "flex-end" }}>
        <AddCabin />

        <DateComponent
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        >
          Provjeri sve slobodne bungalove
        </DateComponent>

        {/* <BookingTableOperations /> */}
      </Row>

      <Row>
        <CabinTable startDate={startDate} endDate={endDate} />
      </Row>
    </>
  );
}

export default Cabins;
