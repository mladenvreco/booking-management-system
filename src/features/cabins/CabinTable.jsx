import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";

import Empty from "../../ui/Empty";
import Menus from "../../ui/Menus";
import Table from "../../ui/Table";
import { useCabins } from "./useCabins";

function CabinTable({ startDate, endDate }) {
  const { isLoading, cabins } = useCabins();
  // const [searchParams] = useSearchParams();
  if (isLoading) return <Spinner />;
  if (!cabins.length) return <Empty resourceName={"bungalova"} />;

  const filteredCabins = cabins.filter((cabin) => {
    // Ensure `zauzetnadatume` is an array or fallback to an empty array
    const unavailableDates = (cabin.zauzetnadatume || []).map(
      (date) => new Date(date)
    );
    const isAvailable =
      !startDate ||
      !endDate ||
      !unavailableDates.some((date) => date >= startDate && date <= endDate);

    return isAvailable;
  });

  if (!filteredCabins.length) return <Empty resourceName={"bungalova"} />;

  // const sortirajPrema =
  //   searchParams.get("sortirajPrema") || "imeBungalova-rastuce";
  // const [field, direction] = sortirajPrema.split("-");
  // const modifier = direction === "rastuce" ? 1 : -1;

  // const sortiraniBungalovi = cabins.sort((a, b) =>
  //   typeof a[field] === "string"
  //     ? a[field].localeCompare(b[field]) * modifier
  //     : (a[field] - b[field]) * modifier
  // );

  return (
    <Menus>
      <Table columns="1fr 1fr 1fr 0.2fr">
        <Table.Header>
          <div>Naziv bungalova</div>
          <div>Broj kreveta</div>
          <div>Vrsta bungalova</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={filteredCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
