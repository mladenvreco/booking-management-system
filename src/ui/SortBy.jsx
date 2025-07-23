import Select from "./Select";
import { useSearchParams } from "react-router-dom";

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortirajPrema = searchParams.get("sortirajPrema") || "";
  function handleChange(e) {
    searchParams.set("sortirajPrema", e.target.value);
    setSearchParams(searchParams);
  }
  return (
    <Select
      options={options}
      type="white"
      value={sortirajPrema}
      onChange={handleChange}
    />
  );
}

export default SortBy;
