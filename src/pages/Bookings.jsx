import Heading from "../ui/Heading";
import Row from "../ui/Row";
import BookingTable from "../features/bookings/BookingTable";
import AddBooking from "../features/bookings/AddBooking";
import Input from "../ui/Input";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../ui/Button";

function Bookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Load saved dates from localStorage when component mounts
  useEffect(() => {
    const savedStartDate = localStorage.getItem("bookingsStartDate");
    const savedEndDate = localStorage.getItem("bookingsEndDate");

    if (savedStartDate) {
      setStartDate(new Date(savedStartDate));
    }

    if (savedEndDate) {
      setEndDate(new Date(savedEndDate));
    }

    // Load saved search term if you want to persist that too
    const savedSearchTerm = localStorage.getItem("bookingsSearchTerm");
    if (savedSearchTerm) {
      setSearchTerm(savedSearchTerm);
    }
  }, []);

  // Save dates to localStorage whenever they change
  useEffect(() => {
    if (startDate) {
      localStorage.setItem("bookingsStartDate", startDate.toISOString());
    } else {
      localStorage.removeItem("bookingsStartDate");
    }

    if (endDate) {
      localStorage.setItem("bookingsEndDate", endDate.toISOString());
    } else {
      localStorage.removeItem("bookingsEndDate");
    }
  }, [startDate, endDate]);

  // Save search term to localStorage when it changes
  useEffect(() => {
    if (searchTerm) {
      localStorage.setItem("bookingsSearchTerm", searchTerm);
    } else {
      localStorage.removeItem("bookingsSearchTerm");
    }
  }, [searchTerm]);

  const resetDates = () => {
    setStartDate(null);
    setEndDate(null);
    // Local storage values will be removed by the useEffect
  };

  return (
    <>
      <Heading as="h1">Sve rezervacije</Heading>
      {/* <BookingTableOperations /> */}

      <Row type="horizontal" style={{ alignItems: "flex-end" }}>
        <AddBooking />

        {/* <BookingTableOperations /> */}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{ lineHeight: "1" }}>Pretraga po datumu:</p>

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

          <Button variation="secondary" size="small" onClick={resetDates}>
            Resetuj datume
          </Button>
          <Input
            placeholder="Pretraga po imenu rezervacije"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Row>

      <BookingTable
        searchTerm={searchTerm}
        startDate={startDate}
        endDate={endDate}
      />
    </>
  );
}

export default Bookings;
