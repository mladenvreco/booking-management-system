import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import supabase from "../../services/supabase";
import { useUser } from "../../features/authentication/useUser";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { user } = useUser(); // Get current user information

  const { mutate: createBooking, isLoading: isCreating } = useMutation(
    async ({ bookingData, additionalBookingInfo }) => {
      // Always have a valid array of bungalows
      const validBungalows = Array.isArray(bookingData.bungalows)
        ? bookingData.bungalows.filter((id) => id !== null)
        : [];

      const { data: rezervacija, error: rezervacijaError } = await supabase
        .from("rezervacije")
        .insert({
          imeRezervacije: bookingData.imeRezervacije,
          brojGostiju: bookingData.brojGostiju,
          djeca: bookingData.djeca,
          brojNocenja: bookingData.brojNocenja,
          datumDolaska: bookingData.datumDolaska,
          datumOdlaska: bookingData.datumOdlaska,
          popust: bookingData.popust,
          ukupnoZaNaplatu: bookingData.ukupnoZaNaplatu,
          avans: bookingData.avans,
          aranzman: bookingData.aranzman,
          brojVegana: bookingData.brojVegana,
          napomena: bookingData.napomena,
          odakleRezervacija: bookingData.odakleRezervacija,
          kontakt: bookingData.kontakt,
          // Add user information
          created_by: user?.id || null,
          creator_name: user?.user_metadata?.ime || null,
        })
        .select()
        .single();

      if (rezervacijaError) {
        throw rezervacijaError;
      }

      // Step 2: Link bungalows to the reservation
      if (validBungalows.length > 0) {
        const { error: bungaloviError } = await supabase
          .from("rezervacija_bungalovi")
          .insert(
            validBungalows.map((bungalovi_id) => ({
              rezervacija_id: rezervacija.id,
              bungalovi_id,
            }))
          );

        if (bungaloviError) throw bungaloviError;
      }

      // Step 3: Insert additional booking info
      const { error: additionalInfoError } = await supabase
        .from("additional_booking_info")
        .upsert({
          booking_id: rezervacija.id, // Foreign key to rezervacije.id
          isVikend: additionalBookingInfo.isVikend,
          isApartman: additionalBookingInfo.isApartman,
          isDorucak: additionalBookingInfo.isDorucak,
          isRucak: additionalBookingInfo.isRucak,
          isVelenici: additionalBookingInfo.isVelenici,
          brojGostijuVelenici: additionalBookingInfo.brojGostijuVelenici,
          brojDjeceVelenici: additionalBookingInfo.brojDjeceVelenici,
          isJahanje: additionalBookingInfo.isJahanje,
          isFerataZipline: additionalBookingInfo.isFerataZipline,
          isSutjeska: additionalBookingInfo.isSutjeska,
          brojGostijuSutjeska: additionalBookingInfo.brojGostijuSutjeska,
          brojDjeceSutjeska: additionalBookingInfo.brojDjeceSutjeska,
          isTrnovacko: additionalBookingInfo.isTrnovacko,
          brojGostijuTrnovacko: additionalBookingInfo.brojGostijuTrnovacko,
          brojDjeceTrnovacko: additionalBookingInfo.brojDjeceTrnovacko,
          isKanjoning: additionalBookingInfo.isKanjoning,
          brojGostijuKanjoning: additionalBookingInfo.brojGostijuKanjoning,
          brojDjeceKanjoning: additionalBookingInfo.brojDjeceKanjoning,
        });

      if (additionalInfoError) throw additionalInfoError;

      // Step 4: Update occupied dates for each bungalow
      if (validBungalows.length > 0 && Array.isArray(bookingData.dates)) {
        await Promise.all(
          validBungalows.map(async (bungalowId) => {
            const { data: bungalow, error: bungalowError } = await supabase
              .from("bungalovi")
              .select("zauzetnadatume")
              .eq("id", bungalowId)
              .single();

            if (bungalowError) throw bungalowError;

            const updatedDates = Array.isArray(bungalow.zauzetnadatume)
              ? [...new Set([...bungalow.zauzetnadatume, ...bookingData.dates])]
              : bookingData.dates;

            const { error: updateError } = await supabase
              .from("bungalovi")
              .update({ zauzetnadatume: updatedDates })
              .eq("id", bungalowId);

            if (updateError) throw updateError;
          })
        );
      }
      return rezervacija;
    },
    {
      onSuccess: () => {
        toast.success("Rezervacija uspješno dodana!");
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
      },
      onError: (error) => {
        console.error(
          "Greška prilikom dodavanja rezervacije:",
          error?.message || error
        );
        toast.error("Greška prilikom dodavanja rezervacije.");
      },
    }
  );

  return { isCreating, createBooking };
}
