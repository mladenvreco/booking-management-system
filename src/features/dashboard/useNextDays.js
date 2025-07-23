import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getStaysAfterDate } from "../../services/apiBookings";

export function useNextDays() {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get("narednih")
    ? 3
    : Number(searchParams.get("narednih"));

  const queryDate = subDays(new Date(), numDays).toISOString();

  const { data: stays, isLoading } = useQuery({
    queryFn: () => getStaysAfterDate(queryDate),
    queryKey: ["stays", `narednih-${numDays}`],
  });

  return { stays, isLoading };
}
