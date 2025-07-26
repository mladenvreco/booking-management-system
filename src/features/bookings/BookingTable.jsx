// import styled from 'styled-components';
import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import { useBookings } from "./useBookings";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";

function BookingTable({ searchTerm, startDate, endDate, showActions = true }) {
  const { bookings, isLoading, count } = useBookings(startDate, endDate);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearchTerm = booking.imeRezervacije
      .toLowerCase()
      .includes(searchTerm?.toLowerCase());

    return matchesSearchTerm;
  });

  if (isLoading) return <Spinner />;

  // if (!bookings.length) return <Empty resourceName={"rezervacija"} />;

  return (
    <Menus>
      <Table
        columns="0.2fr 1.5fr 1.5fr 2fr 1fr 1fr 0.5fr 0.5fr"
        columnsTablet="0.2fr 1.5fr 1.5fr 1.5fr 1fr 0.5fr" // 6 columns for tablets
        columnsMobile="0.2fr 1.2fr 1fr 1.2fr 0.7fr 0.5fr" // 6 columns for mobile, adjusted proportions
      >
        <Table.Header>
          <div></div>
          <div>Ime rezervacije</div>
          <div>Kontakt</div>
          <div>Datum</div>
          <div className="bungalovi-column">Bungalovi</div>
          <div>Broj gostiju</div>
          <div className="avans-column">Avans</div>
          <div></div>
        </Table.Header>

        {/* {bookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))} */}

        <Table.Body
          data={filteredBookings}
          render={(booking) => (
            <BookingRow
              key={booking.id}
              booking={booking}
              showActions={showActions}
            />
          )}
        />

        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;
