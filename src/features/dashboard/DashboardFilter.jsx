import Filter from "../../ui/Filter";

function DashboardFilter() {
  return (
    <Filter
      filterField="narednih"
      options={[
        { value: "1", label: "Sutra" },
        { value: "3", label: "Naredna 3 dana" },
        { value: "7", label: "Narednih 7 dana" },
      ]}
    />
  );
}

export default DashboardFilter;
