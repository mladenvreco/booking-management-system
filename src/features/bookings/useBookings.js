import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchReservations,
  getReservationsAfterDate,
} from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";
import { startOfDay, endOfDay } from "date-fns";

export function useBookings(startDate, endDate) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const sortByRaw = searchParams.get("sortirajPrema") || "datumDolaska-rastuce";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = {
    field,
    direction,
  };

  const page = !searchParams.get("stranica")
    ? 1
    : Number(searchParams.get("stranica"));

  const queryDate = startDate
    ? startOfDay(new Date(startDate)).toISOString()
    : null;
  const queryEndDate = endDate
    ? endOfDay(new Date(endDate)).toISOString()
    : null;

  const {
    isLoading,
    data: result = {},
    error,
  } = useQuery({
    queryKey: ["bookings", sortBy, page, queryDate, queryEndDate],
    queryFn: async () => {
      if (queryDate && queryEndDate) {
        const data = await getReservationsAfterDate(queryDate, queryEndDate);
        return { data, count: data.length };
      }
      return await fetchReservations({ sortBy, page });
    },
  });

  const bookings = result?.data || [];
  const count = result?.count || 0;

  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["bookings", sortBy, page + 1, queryDate, queryEndDate],
      queryFn: () => fetchReservations({ sortBy, page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", sortBy, page - 1, queryDate, queryEndDate],
      queryFn: () => fetchReservations({ sortBy, page: page - 1 }),
    });

  return {
    isLoading,
    bookings,
    error,
    count,
  };
}
