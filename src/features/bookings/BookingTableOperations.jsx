import SortBy from "../../ui/SortBy";
import TableOperations from "../../ui/TableOperations";

function BookingTableOperations() {
  return (
    <TableOperations>
      <SortBy
        options={[
          {
            value: "datumDolaska-rastuce",
            label: "Sortiraj prema datumu rezervacije (najbliži prvo)",
          },
          {
            value: "datumDolaska-opadajuce",
            label: "Sortiraj prema datumu rezervacije (najdalji prvo)",
          },
          {
            value: "created_at-opadajuce",
            label: "Najnovije dodane rezervacije",
          },
        ]}
      />
    </TableOperations>
  );
}

export default BookingTableOperations;
