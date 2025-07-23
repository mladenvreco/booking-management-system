import { useQuery } from "@tanstack/react-query";
import { startOfDay, endOfDay } from "date-fns";
import { getReservationsAfterDate } from "../../services/apiBookings";
import supabase from "../../services/supabase";

export function useNextBookings(startDate, endDate) {
  const queryDate = startDate
    ? startOfDay(new Date(startDate)).toISOString()
    : null;
  const queryEndDate = endDate
    ? endOfDay(new Date(endDate)).toISOString()
    : null;

  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryFn: async () => {
      if (queryDate && queryEndDate) {
        return await getReservationsAfterDate(queryDate, queryEndDate);
      }
      // When no dates are selected, fetch all bookings directly from supabase
      const { data, error } = await supabase
        .from("rezervacije")
        .select(
          `
          *,
          rezervacija_bungalovi:rezervacija_bungalovi_rezervacija_id_fkey (
            bungalovi_id,
            bungalovi:rezervacija_bungalovi_bungalovi_id_fkey (
              imeBungalova
            )
          ),
          tok_aranzmana:tok_aranzmana_rezervacije_id_fkey (
            day_number,
            broj_gostiju_dorucak,
            broj_gostiju_rucak,
            broj_gostiju_vecera,
            broj_gostiju_nocenje
          ),
          dodatna_aktivnost:dodatna_aktivnost_rezervacije_id_fkey (
            day_number,
            aktivnost        
          )
        `
        )
        .order("datumDolaska", { ascending: true });

      if (error) throw error;

      // Transform the data to match the format from getReservationsAfterDate
      return data.map((rezervacija) => ({
        ...rezervacija,
        bungalovi: rezervacija.rezervacija_bungalovi.map((rel) => ({
          id: rel.bungalovi_id,
          imeBungalova: rel.bungalovi?.imeBungalova || "Nepoznato",
        })),
        tokAranzmana: rezervacija.tok_aranzmana || [],
        dodatna_aktivnost:
          rezervacija.dodatna_aktivnost?.map((aktivnost) => ({
            day_number: aktivnost.day_number,
            aktivnost: aktivnost.aktivnost,
          })) || [],
      }));
    },
    queryKey: ["bookings", queryDate, queryEndDate],
  });

  if (error) {
    console.error("greska:", error);
  }

  return { bookings, isLoading };
}
