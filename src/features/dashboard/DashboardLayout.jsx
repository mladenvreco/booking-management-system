import styled from "styled-components";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import DashboardBookingRow from "./DashboardBookingRow";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  gap: 2.4rem;
`;

function DashboardLayout({ bookings, startDate, endDate }) {
  // Optionally, you can show a spinner if bookings is undefined/null (loading state handled in parent)
  if (!bookings) return <Spinner />;
  // if (bookings.length === 0) return <Empty resourceName="rezervacija" />;

  return (
    <div>
      <StyledDashboardLayout>
        <Table columns="0.2fr 1fr 1fr 1.2fr 0.2fr">
          <Table.Header>
            <div></div>
            <div>Ime rezervacije</div>
            <div>Kontakt</div>
            <div>Datum</div>
            <div>Broj gostiju</div>
          </Table.Header>

          <Table.Body
            data={bookings}
            render={(booking) => (
              <DashboardBookingRow key={booking.id} booking={booking} />
            )}
          />
        </Table>
      </StyledDashboardLayout>
    </div>
  );
}

export default DashboardLayout;
