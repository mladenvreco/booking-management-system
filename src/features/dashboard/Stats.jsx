import { formatCurrency } from "../../utils/helpers";
import Stat from "./Stat";
import { HiOutlineBanknotes, HiOutlineBriefcase } from "react-icons/hi2";
import { MdPeopleOutline } from "react-icons/md";

function Stats({ bookings }) {
  const ukupnoRezervacija = bookings.length;

  const ukupanPrihod = bookings.reduce(
    (acc, cur) => acc + cur.ukupnoZaNaplatu,
    0
  );

  const ukupanBrojGostiju = bookings.reduce(
    (acc, cur) => acc + cur.brojGostiju,
    0
  );

  return (
    <>
      <Stat
        title="Ukupno rezervacija"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={ukupnoRezervacija}
      />

      <Stat
        title="Ukupni prihodi od aranžmana"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(ukupanPrihod)}
      />

      <Stat
        title="Ukupno gostiju"
        color="indigo"
        icon={<MdPeopleOutline />}
        value={ukupanBrojGostiju}
      />
    </>
  );
}

export default Stats;
