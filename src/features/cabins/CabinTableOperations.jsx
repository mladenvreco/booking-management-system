import SortBy from "../../ui/SortBy";
import TableOperations from "../../ui/TableOperations";

function CabinTableOperations() {
  return (
    <TableOperations>
      <SortBy
        options={[
          {
            value: "imeBungalova-rastuce",
            label: "Sortiraj prema nazivu (A-Z)",
          },
          {
            value: "imeBungalova-opadajuce",
            label: "Sortiraj prema nazivu (Z-A)",
          },
          {
            value: "brojKreveta-rastuce",
            label: "Sortiraj prema broju kreveta (najmanji prvo)",
          },
          {
            value: "brojKreveta-opadajuce",
            label: "Sortiraj prema broju kreveta (najveći prvo)",
          },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
