import { format } from "date-fns";
import { getCustomLocale } from "./customLocale";

export function exportToCSV({ bookings, startDate, endDate, toast }) {
  if (!startDate || !endDate) {
    toast.error("Unesite oba datuma");
    return;
  }

  const headers = [
    "Ime",
    "Dan dolaska",
    "Broj gostiju",
    "Vegani",
    "Avans",
    "Ukupno za naplatu",
    "Bungalov",
    "Tok aranzmana",
    "Aktivnosti",
  ];

  const rows = bookings.map((booking) => {
    const bungalovNames = booking.rezervacija_bungalovi
      ?.map((bungalov) => bungalov.bungalovi?.imeBungalova)
      .join(", ");

    const tokAranzmanaDetails = booking.tokAranzmana
      ?.map(
        (day) =>
          `Dan ${day.day_number}: Dorucak(${
            day.broj_gostiju_dorucak || 0
          }), Rucak(${day.broj_gostiju_rucak || 0}), Vecera(${
            day.broj_gostiju_vecera || 0
          }), Nocenje(${day.broj_gostiju_nocenje || 0})`
      )
      .join(" | ");

    const dodatneAktivnosti =
      booking.dodatna_aktivnost
        ?.filter((aktivnost) => {
          // Exclude entries where aktivnost.aktivnost.aktivnost is "Bez dodatne aktivnosti"
          if (
            typeof aktivnost.aktivnost.aktivnost === "string" &&
            aktivnost.aktivnost.aktivnost.trim().startsWith("{")
          ) {
            try {
              const parsedAktivnost = JSON.parse(aktivnost.aktivnost.aktivnost);
              return parsedAktivnost.name !== "Bez dodatne aktivnosti";
            } catch {
              return true;
            }
          }
          return aktivnost.aktivnost.aktivnost !== "Bez dodatne aktivnosti";
        })
        .map((aktivnost) => {
          try {
            const parsedAktivnost =
              typeof aktivnost.aktivnost.aktivnost === "string" &&
              aktivnost.aktivnost.aktivnost.trim().startsWith("{")
                ? JSON.parse(aktivnost.aktivnost.aktivnost)
                : aktivnost.aktivnost.aktivnost;

            const aktivnostName =
              typeof parsedAktivnost === "object" && parsedAktivnost !== null
                ? parsedAktivnost.name
                : parsedAktivnost;

            return `${aktivnost.day_number}: Aktivnost(${
              aktivnostName || "Nepoznato"
            }), Broj gostiju(${aktivnost.aktivnost.brojGostiju || "/"})`
              .replace(/č/g, "c")
              .replace(/ć/g, "c")
              .replace(/đ/g, "dj")
              .replace(/Č/g, "C")
              .replace(/Ć/g, "C")
              .replace(/Đ/g, "Dj");
          } catch {
            return `${
              aktivnost.day_number
            }: Aktivnost(Invalid data), Broj gostiju(${
              aktivnost.broj_gostiju || 0
            })`
              .replace(/č/g, "c")
              .replace(/ć/g, "c")
              .replace(/đ/g, "dj")
              .replace(/Č/g, "C")
              .replace(/Ć/g, "C")
              .replace(/Đ/g, "Dj");
          }
        })
        .join(" | ") || "bez dodatnih aktivnosti";

    const datumDolaska = booking.datumDolaska;
    const danDolaska = format(new Date(datumDolaska), "EEEE", {
      locale: getCustomLocale({ fullDayNames: true }),
    });

    return [
      (booking.imeRezervacije || "")
        .replace(/č/g, "c")
        .replace(/ć/g, "c")
        .replace(/đ/g, "dj")
        .replace(/Č/g, "C")
        .replace(/Ć/g, "C")
        .replace(/Đ/g, "Dj"),
      danDolaska,
      booking.brojGostiju + booking.djeca,
      booking.brojVegana || 0,
      booking.avans,
      booking.ukupnoZaNaplatu,
      bungalovNames || "/",
      tokAranzmanaDetails || "/",
      dodatneAktivnosti || "/",
    ];
  });

  const csvContent = [
    headers.join(","), // Add headers
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")), // Add rows
  ].join("\n");

  // Create a Blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "rezervacije.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
