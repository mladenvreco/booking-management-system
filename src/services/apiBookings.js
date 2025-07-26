import supabase from "./supabase";
import { PAGE_SIZE } from "../utils/constants";

export const fetchReservations = async ({ sortBy, page = 1 }) => {
  const { field, direction } = sortBy;

  const isDescending = direction === "opadajuce";

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("rezervacije")
    .select(
      `
      *,
      rezervacija_bungalovi:rezervacija_bungalovi_rezervacija_id_fkey (
        bungalovi_id     
      )
    `,
      { count: "exact" }
    )
    .order(field, { ascending: !isDescending })
    .range(from, to);

  if (error) {
    return { data: [], count: 0 };
  }

  const transformedData = data.map((rezervacija) => ({
    ...rezervacija,
    bungalovi: rezervacija.rezervacija_bungalovi.map((rel) => ({
      id: rel.bungalovi_id,
      imeBungalova: rel.bungalovi?.imeBungalova || "",
    })),
  }));

  return { data: transformedData, count };
};

export async function createEditBooking(newBooking, additionalBookingInfo, id) {
  let query = supabase.from("rezervacije");

  if (!id) {
    throw new Error("ID rezervacije nije pronađen.");
  }

  try {
    // First get the original booking to preserve creator information
    const { data: existingBooking, error: existingBookingError } =
      await supabase
        .from("rezervacije")
        .select("created_by, creator_name")
        .eq("id", id)
        .single();

    if (existingBookingError) {
      throw new Error("Greška pri dohvaćanju postojeće rezervacije.");
    }

    // Update the main booking data in the 'rezervacije' table
    const { bungalows, dates, ...bookingData } = newBooking;

    // Update the booking while preserving creator info
    const { data, error } = await query
      .update({
        ...bookingData,
        // Keep the original creator info
        created_by: existingBooking?.created_by || null,
        creator_name: existingBooking?.creator_name || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error("Greška pri uređivanju rezervacije.");
    }

    // Update additional booking info with explicit boolean values
    const { error: additionalInfoError } = await supabase
      .from("additional_booking_info")
      .upsert({
        booking_id: id,
        isVikend: Boolean(additionalBookingInfo.isVikend),
        isApartman: Boolean(additionalBookingInfo.isApartman),
        isDorucak: Boolean(additionalBookingInfo.isDorucak),
        isRucak: Boolean(additionalBookingInfo.isRucak),
        isVelenici: Boolean(additionalBookingInfo.isVelenici),
        isJahanje: Boolean(additionalBookingInfo.isJahanje),
        isFerataZipline: Boolean(additionalBookingInfo.isFerataZipline),
        isSutjeska: Boolean(additionalBookingInfo.isSutjeska),
        isTrnovacko: Boolean(additionalBookingInfo.isTrnovacko),
        isKanjoning: Boolean(additionalBookingInfo.isKanjoning),
        isSator: Boolean(additionalBookingInfo.isSator),
        isKampKucica: Boolean(additionalBookingInfo.isKampKucica),
        brojGostijuVelenici: additionalBookingInfo.brojGostijuVelenici || 0,
        brojDjeceVelenici: additionalBookingInfo.brojDjeceVelenici || 0,
        brojGostijuSutjeska: additionalBookingInfo.brojGostijuSutjeska || 0,
        brojDjeceSutjeska: additionalBookingInfo.brojDjeceSutjeska || 0,
        brojGostijuTrnovacko: additionalBookingInfo.brojGostijuTrnovacko || 0,
        brojDjeceTrnovacko: additionalBookingInfo.brojDjeceTrnovacko || 0,
        brojGostijuKanjoning: additionalBookingInfo.brojGostijuKanjoning || 0,
        brojDjeceKanjoning: additionalBookingInfo.brojDjeceKanjoning || 0,
        brojGostijuSator: additionalBookingInfo.brojGostijuSator || 0,
        brojDjeceSator: additionalBookingInfo.brojDjeceSator || 0,
        brojGostijuKampKucica: additionalBookingInfo.brojGostijuKampKucica || 0,
        brojDjeceKampKucica: additionalBookingInfo.brojDjeceKampKucica || 0,
      });

    if (additionalInfoError) throw additionalInfoError;

    // Delete existing bungalows
    const { error: deleteError } = await supabase
      .from("rezervacija_bungalovi")
      .delete()
      .eq("rezervacija_id", id);

    if (deleteError) {
      throw new Error("Greška pri brisanju starih bungalova.");
    }

    // Handle bungalows if they exist
    if (bungalows && bungalows.length > 0) {
      const bungalowsData = bungalows
        .filter(
          (bungalovi_id) =>
            bungalovi_id !== null &&
            bungalovi_id !== "" &&
            bungalovi_id !== undefined
        )
        .map((bungalovi_id) => ({
          rezervacija_id: id,
          bungalovi_id,
        }));

      if (bungalowsData.length > 0) {
        const { error: insertError } = await supabase
          .from("rezervacija_bungalovi")
          .insert(bungalowsData);

        if (insertError) {
          throw new Error("Greška pri dodavanju novih bungalova.");
        }
      }

      // Update zauzetnadatume for each bungalow
      for (const bungalowId of bungalows.filter(
        (id) => id !== null && id !== "" && id !== undefined
      )) {
        const { data: bungalow, error: bungalowError } = await supabase
          .from("bungalovi")
          .select("zauzetnadatume")
          .eq("id", bungalowId)
          .single();

        if (bungalowError) {
          continue;
        }

        const updatedDates = Array.isArray(bungalow.zauzetnadatume)
          ? [...new Set([...bungalow.zauzetnadatume, ...dates])]
          : dates;

        const { error: updateError } = await supabase
          .from("bungalovi")
          .update({ zauzetnadatume: updatedDates })
          .eq("id", bungalowId);

        if (updateError) {
        }
      }
    }

    // Return an object with the id
    return { id };
  } catch (error) {
    throw error;
  }
}

export const getBooking = async (id) => {
  const { data, error } = await supabase
    .from("rezervacije")
    .select(
      `
      *,
      rezervacija_bungalovi:rezervacija_bungalovi_rezervacija_id_fkey (
        bungalovi_id,
        bungalovi:rezervacija_bungalovi_bungalovi_id_fkey (
          imeBungalova, brojKreveta
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Neuspjelo učitavanje rezervacije");
  }

  return {
    ...data,
    bungalovi: data.rezervacija_bungalovi.map((rel) => ({
      id: rel.bungalovi_id,
      imeBungalova: rel.bungalovi?.imeBungalova || "nepoznato",
    })),
  };
};

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("rezervacije")
    .select("created_at, ukupnoZaNaplatu, brojGostiju")
    .gte("created_at", date)
    .lte("datumDolaska", date);

  if (error) {
    throw new Error("Rezervacije nisu učitane");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getReservationsAfterDate(startDate, endDate) {
  let query = supabase.from("rezervacije").select(
    `
      id,
      imeRezervacije,
      kontakt,
      brojNocenja,
      datumDolaska,
      datumOdlaska,
      brojGostiju,
      djeca,
      brojVegana,
      ukupnoZaNaplatu,
      avans,
      odakleRezervacija,
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
  );

  // Apply date filters only if both startDate and endDate are provided
  if (startDate && endDate) {
    // Format dates to match the database format (YYYY-MM-DD 00:00:00)
    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")} 00:00:00`;
    };

    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);

    query = query
      .gte("datumDolaska", startDateFormatted)
      .lt("datumDolaska", endDateFormatted);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Rezervacije nisu učitane");
  }

  // Transform the data to include `imeBungalova` and `tok_aranzmana`
  const transformedData = data.map((rezervacija) => ({
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

  return transformedData;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("rezervacije")
    .select("*")
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    throw new Error("Rezervacije nisu učitane");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Rezervacija nije izmjenjena.");
  }
  return data;
}

export async function deleteBooking(id) {
  // Step 1: Fetch the booking to get associated bungalows and dates
  const { data: bookingData, error: fetchError } = await supabase
    .from("rezervacije")
    .select(
      `
      datumDolaska,
      datumOdlaska,
      rezervacija_bungalovi:rezervacija_bungalovi_rezervacija_id_fkey (
        bungalovi_id
      )
    `
    )
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error("Rezervacija nije pronađena.");
  }

  // Step 2: Calculate the dates to be removed
  const datesToRemove = generateDatesBetween(
    new Date(bookingData.datumDolaska),
    new Date(bookingData.datumOdlaska)
  );

  // Step 3: Update each associated bungalow to remove the dates
  for (const rel of bookingData.rezervacija_bungalovi) {
    const bungalowId = rel.bungalovi_id;

    const { data: bungalow, error: bungalowError } = await supabase
      .from("bungalovi")
      .select("zauzetnadatume")
      .eq("id", bungalowId)
      .single();

    if (bungalowError) {
      continue;
    }

    // Remove the dates associated with the booking
    const updatedDates = bungalow.zauzetnadatume.filter(
      (date) => !datesToRemove.includes(date)
    );

    const { error: updateError } = await supabase
      .from("bungalovi")
      .update({ zauzetnadatume: updatedDates })
      .eq("id", bungalowId);

    if (updateError) {
    }
  }

  // Step 4: Delete the booking
  const { data, error } = await supabase
    .from("rezervacije")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("Rezervacija nije izbrisana.");
  }
  return data;
}

// Helper function to generate dates between two dates
function generateDatesBetween(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
