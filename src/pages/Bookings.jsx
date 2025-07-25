import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import AddBooking from "../features/bookings/AddBooking";
import BookingTable from "../features/bookings/BookingTable";
import DateComponent from "../ui/Date";
import Heading from "../ui/Heading";
import Input from "../ui/Input";
import Row from "../ui/Row";
import { useIsMobile } from "../hooks/useIsMobile";

function parseValidDate(input) {
  if (!input) return null;
  const date = new Date(input);
  if (date.toString() === "Invalid Date") return null;
  return date;
}

function Bookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const savedStartDate = localStorage.getItem("bookingsStartDate");
    const savedEndDate = localStorage.getItem("bookingsEndDate");
    const savedSearchTerm = localStorage.getItem("bookingsSearchTerm");

    if (savedStartDate && savedEndDate) {
      const parsedStartDate = parseValidDate(savedStartDate);
      const parsedEndDate = parseValidDate(savedEndDate);
      if (parsedStartDate && parsedEndDate) {
        setStartDate(parsedStartDate);
        setEndDate(parsedEndDate);
      }
    }

    if (savedSearchTerm) setSearchTerm(savedSearchTerm);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      localStorage.setItem("bookingsStartDate", startDate.toISOString());
      localStorage.setItem("bookingsEndDate", endDate.toISOString());
    } else {
      localStorage.removeItem("bookingsStartDate");
      localStorage.removeItem("bookingsEndDate");
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (searchTerm) {
      localStorage.setItem("bookingsSearchTerm", searchTerm);
    } else {
      localStorage.removeItem("bookingsSearchTerm");
    }
  }, [searchTerm]);

  return (
    <>
      <Heading as="h1">Sve rezervacije</Heading>

      <Row
        type="horizontal"
        style={{
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.6rem",
        }}
      >
        {/* DateComponent - na malim ekranima red 1, puni red */}
        {/* DateComponent - centriran */}
        <div
          style={{
            order: isMobile ? 1 : 2,
            flexBasis: isMobile ? "100%" : "auto",
            flexShrink: 0,
            display: "flex",
            justifyContent: "center", // centriramo horizontalno
            alignItems: "center", // centriramo vertikalno ako treba
          }}
        >
          <DateComponent
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          >
            Pretraži rezervacije po datumu
          </DateComponent>
        </div>

        {/* Input - centriran */}
        <div
          style={{
            order: isMobile ? 2 : 1,
            flexBasis: isMobile ? "100%" : "auto",
            flexGrow: isMobile ? 0 : 1,
            minWidth: isMobile ? "auto" : "200px",
            display: "flex",
            justifyContent: "center", // centriramo horizontalno
            alignItems: "center", // vertikalno centriranje
          }}
        >
          <Input
            placeholder="Pretraga po imenu rezervacije"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: isMobile ? "100%" : "100%",
              maxWidth: isMobile ? "300px" : "100%",
            }}
          />
        </div>

        {/* AddBooking - na malim ekranima red 3, puni red, levo */}
        <div
          style={{
            order: isMobile ? 3 : 0,
            flexBasis: isMobile ? "100%" : "auto",
            flexShrink: 0,
            display: "flex",
            justifyContent: isMobile ? "flex-start" : "flex-start",
          }}
        >
          <AddBooking />
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
