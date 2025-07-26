import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";

import Empty from "../../ui/Empty";
import Menus from "../../ui/Menus";
import Table from "../../ui/Table";
import { useCabins } from "./useCabins";

// function CabinTable({ startDate, endDate }) {
//   const { isLoading, cabins } = useCabins();
//   // const [searchParams] = useSearchParams();
//   if (isLoading) return <Spinner />;
//   if (!cabins.length) return <Empty resourceName={"bungalova"} />;

//   const filteredCabins = cabins.filter((cabin) => {
//     const unavailableDates = (cabin.zauzetnadatume || []).map(
//       (date) => new Date(date)
//     );
//     const isAvailable =
//       !startDate ||
//       !endDate ||
//       !unavailableDates.some((date) => date >= startDate && date <= endDate);

//     return isAvailable;
//   });
//   console.log(filteredCabins);

//   if (!filteredCabins.length) return <Empty resourceName={"bungalova"} />;

//   return (
//     <Menus>
//       <Table columns="1fr 1fr 1fr 0.2fr">
//         <Table.Header>
//           <div>Naziv bungalova</div>
//           <div>Broj kreveta</div>
//           <div>Vrsta bungalova</div>
//           <div></div>
//         </Table.Header>

//         <Table.Body
//           data={filteredCabins}
//           render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
//         />
//       </Table>
//     </Menus>
//   );
// }

function CabinTable({ startDate, endDate }) {
  const { isLoading, cabins } = useCabins();

  if (isLoading) return <Spinner />;
  if (!cabins.length) return <Empty resourceName={"bungalova"} />;

  // Generiši sve datume u rasponu
  const getAllDatesInRange = (start, end) => {
    const dates = [];
    const currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const filteredCabins = cabins
    .map((cabin) => {
      // Ako nisu uneseni datumi, prikaži sve bungalove bez filtriranja
      if (!startDate || !endDate) {
        return {
          ...cabin,
          availableDates: null,
          originalCabin: cabin,
        };
      }

      const unavailableDates = (cabin.zauzetnadatume || []).map(
        (date) => new Date(date)
      );

      const allDatesInRange = getAllDatesInRange(startDate, endDate);

      // Pronađi dostupne datume
      const availableDates = allDatesInRange.filter(
        (date) =>
          !unavailableDates.some(
            (unavailableDate) =>
              unavailableDate.toDateString() === date.toDateString()
          )
      );

      return {
        ...cabin,
        availableDates: availableDates,
        originalCabin: cabin,
      };
    })
    .filter((cabin) => {
      if (!startDate || !endDate) return true;

      return cabin.availableDates.length > 0;
    });

  console.log(filteredCabins);

  if (!filteredCabins.length) {
    const message =
      !startDate || !endDate
        ? "bungalova"
        : "slobodnih bungalova u zadatom periodu";
    return <Empty resourceName={message} />;
  }

  return (
    <Menus>
      <Table columns="1fr 1fr 1fr 1fr 0.2fr">
        <Table.Header>
          <div>Naziv bungalova</div>
          <div>Broj kreveta</div>
          <div>Vrsta bungalova</div>
          <div>Dostupni datumi</div>
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
