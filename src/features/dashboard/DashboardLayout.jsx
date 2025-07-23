import jsPDF from "jspdf";
import "jspdf-autotable";
import "./NotoSans-Regular";
import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import { useNextBookings } from "./useNextBookings";
import Empty from "../../ui/Empty";
import Table from "../../ui/Table";
import DashboardBookingRow from "./DashboardBookingRow"; // Import the new component
import Button from "../../ui/Button";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import toast from "react-hot-toast";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  gap: 2.4rem;
`;

const StyledExportButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
  @media (max-width: 768px) {
    justify-content: left;
    button {
      padding: 0.3rem;
      font-size: 1.2rem;
    }
  }
`;

function DashboardLayout({ startDate, endDate }) {
  const { bookings, isLoading } = useNextBookings(startDate, endDate);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let narednih = searchParams.get("narednih");
  if (searchParams.size === 0) narednih = 1;

  const customLocaleTA = {
    ...enUS,
    localize: {
      ...enUS.localize,
      day: (narrowDay) => {
        const days = [
          "Nedjelja",
          "Ponedjeljak",
          "Utorak",
          "Srijeda",
          "Četvrtak",
          "Petak",
          "Subota",
        ];
        return days[narrowDay];
      },
      month: (narrowMonth) => {
        const months = [
          "Januar",
          "Februar",
          "Mart",
          "April",
          "Maj",
          "Jun",
          "Jul",
          "Avgust",
          "Septembar",
          "Oktobar",
          "Novembar",
          "Decembar",
        ];
        return months[narrowMonth];
      },
    },
  };

  if (isLoading) return <Spinner />;
  if (!bookings || bookings.length === 0)
    return <Empty resourceName="rezervacija" />;

  const exportToCSV = () => {
    if (!startDate || !endDate) {
      toast.error("Unesite oba datuma");
      return;
    }
    const headers = [
      "Ime",
      "Dolazak",
      "Avans",
      "Broj gostiju",
      "Vegani",
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
                const parsedAktivnost = JSON.parse(
                  aktivnost.aktivnost.aktivnost
                );
                return parsedAktivnost.name !== "Bez dodatne aktivnosti";
              } catch (error) {
                console.error(
                  "Error parsing aktivnost JSON:",
                  error,
                  aktivnost.aktivnost
                );
                return true; // Keep the entry if parsing fails
              }
            }
            return aktivnost.aktivnost.aktivnost !== "Bez dodatne aktivnosti";
          })
          .map((aktivnost) => {
            try {
              // Check if aktivnost.aktivnost is a JSON string and parse it, otherwise use it as-is
              const parsedAktivnost =
                typeof aktivnost.aktivnost.aktivnost === "string" &&
                aktivnost.aktivnost.aktivnost.trim().startsWith("{")
                  ? JSON.parse(aktivnost.aktivnost.aktivnost)
                  : aktivnost.aktivnost.aktivnost;

              // Extract the name from parsedAktivnost if it's an object
              const aktivnostName =
                typeof parsedAktivnost === "object" && parsedAktivnost !== null
                  ? parsedAktivnost.name
                  : parsedAktivnost;

              // Return the formatted string
              return `${aktivnost.day_number}: Aktivnost(${
                aktivnostName || "Nepoznato"
              }), Broj gostiju(${aktivnost.aktivnost.brojGostiju || "n/a"})`
                .replace(/č/g, "c")
                .replace(/ć/g, "c")
                .replace(/đ/g, "dj")
                .replace(/Č/g, "C")
                .replace(/Ć/g, "C")
                .replace(/Đ/g, "Dj");
            } catch (error) {
              console.error(
                "Error parsing aktivnost JSON:",
                error,
                aktivnost.aktivnost
              );
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
        locale: customLocaleTA,
      });

      return [
        booking.imeRezervacije
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
  };

  const exportToPDF = () => {
    if (!startDate || !endDate) {
      toast.error("Unesite oba datuma");
      return;
    }
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: "a4",
    });

    // Create array of dates between startDate and endDate
    const dates = [];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let currentDate = new Date(start);

      while (currentDate <= end) {
        const formattedDate = `${currentDate.getDate()}.${
          currentDate.getMonth() + 1
        }`;
        dates.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      // Fallback to narednih if no date range is selected
      const today = new Date();
      for (let i = 0; i < Number(narednih); i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        const formattedDate = `${nextDate.getDate()}.${
          nextDate.getMonth() + 1
        }`;
        dates.push(formattedDate);
      }
    }

    // Split dates into chunks of 5 days
    const dateChunks = [];
    for (let i = 0; i < dates.length; i += 5) {
      dateChunks.push(dates.slice(i, i + 5));
    }

    // Process each chunk
    dateChunks.forEach((chunk, chunkIndex) => {
      // Create headers array for this chunk
      const headers = [
        "Ime",
        "Broj gostiju",
        "Vegani",
        "Avans",
        "Ukupna cijena",
        "Bungalov",
      ];

      // Add date columns for each day in this chunk
      chunk.forEach((date) => {
        headers.push(
          date,
          "D", // Dorucak
          "R", // Rafting
          "R", // Rucak
          "V", // Vecera
          "N" // Nocenje
        );
      });

      // Map bookings data into rows for this chunk
      const rows = bookings.map((booking) => {
        const row = [
          booking.imeRezervacije
            .replace(/č/g, "c")
            .replace(/ć/g, "c")
            .replace(/đ/g, "dj")
            .replace(/Č/g, "C")
            .replace(/Ć/g, "C")
            .replace(/Đ/g, "Dj"),

          booking.brojGostiju + booking.djeca,
          booking.brojVegana || 0,
          booking.avans,
          booking.ukupnoZaNaplatu,
          booking.rezervacija_bungalovi
            ?.map((b) => b.bungalovi?.imeBungalova)
            .join(", ") || "N/A",
        ];

        // Add daily details for each date in this chunk
        chunk.forEach((date) => {
          // Convert the date string (e.g., "6.5") to a Date object
          const [day, month] = date.split(".");
          const currentDate = new Date();
          currentDate.setMonth(parseInt(month) - 1);
          currentDate.setDate(parseInt(day));

          // Calculate the day number relative to the booking's start date
          const bookingStartDate = new Date(booking.datumDolaska);
          const dayNumber =
            Math.floor(
              (currentDate - bookingStartDate) / (1000 * 60 * 60 * 24)
            ) + 1;

          const dayDetails =
            booking.tok_aranzmana?.find((d) => {
              const dayNumFromString = parseInt(d.day_number.split("-")[0]);

              return dayNumFromString === dayNumber;
            }) || {};

          const raftingDetails = booking.dodatna_aktivnost?.find((a) => {
            const dayNumFromString = parseInt(a.day_number.split("-")[0]);

            return (
              dayNumFromString === dayNumber &&
              (a.aktivnost?.aktivnost?.toLowerCase().includes("rafting") ||
                (typeof a.aktivnost?.aktivnost === "string" &&
                  a.aktivnost?.aktivnost.toLowerCase().includes("rafting")))
            );
          });

          row.push(
            "", // Empty cell for date
            dayDetails.broj_gostiju_dorucak || 0,
            raftingDetails?.aktivnost?.brojGostiju || 0,
            dayDetails.broj_gostiju_rucak || 0,
            dayDetails.broj_gostiju_vecera || 0,
            dayDetails.broj_gostiju_nocenje || 0
          );
        });

        return row;
      });

      // Calculate totals for this chunk
      const totals = new Array(rows[0].length).fill(0);
      let totalUkupnoZaNaplatu = 0;
      rows.forEach((row) => {
        row.forEach((cell, index) => {
          // Skip name, bungalov, and date columns
          if (index !== 0 && index !== 5 && !(index % 6 === 0)) {
            totals[index] += Number(cell) || 0;
          }
        });
        // Add to total ukupnoZaNaplatu
        totalUkupnoZaNaplatu += Number(row[4]) || 0;
      });

      // Create totals row for this chunk
      const totalRow = totals.map((total, index) => {
        if (index === 0) return "UKUPNO";
        if (index === 5) return ""; // Skip bungalov column
        if (index % 6 === 0) return ""; // Skip date columns
        if (index === 4) return totalUkupnoZaNaplatu; // Use the calculated total for ukupnoZaNaplatu
        return total;
      });

      // Add new page for each chunk except the first one
      if (chunkIndex > 0) {
        pdf.addPage();
      }

      // Add title
      pdf.setFontSize(16);
      pdf.text(
        `Rezervacije - ${chunk[0]} do ${chunk[chunk.length - 1]}`,
        20,
        15
      );

      // Add main table to the PDF with totals row included
      pdf.autoTable({
        head: [headers],
        body: [...rows, totalRow],
        startY: 30,
        margin: { left: 10, right: 10 }, // Reduced margins
        tableWidth: "auto", // Let the table use full available width
        styles: {
          fontSize: 8,
          cellPadding: 1,
        },
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: "auto" }, // Ime
          1: { cellWidth: "auto" }, // Broj gostiju
          2: { cellWidth: "auto" }, // Vegani
          3: { cellWidth: "auto" }, // Avans
          4: { cellWidth: "auto" }, // Ukupna cijena
          5: { cellWidth: "auto" }, // Bungalov
        },
        // Add dynamic column styles for all date columns
        didParseCell: function (data) {
          // Apply styles to all date-related columns
          if (data.column.index >= 6) {
            // For date columns (every 6th column starting from index 6)
            if ((data.column.index - 6) % 6 === 0) {
              data.cell.styles.cellWidth = "auto";
            } else {
              // For detail columns (Dorucak, Rafting, Rucak, Vecera, Nocenje)
              data.cell.styles.cellWidth = "auto";
            }
          }
          // Style the totals row
          if (data.row.index === rows.length) {
            data.cell.styles.fontStyle = "bold";
            if (data.column.index === 0) {
              data.cell.styles.halign = "left";
            }
          }
        },
      });
    });

    // Save the PDF
    pdf.save("rezervacije.pdf");
  };

  return (
    <div>
      <StyledDashboardLayout>
        <StyledExportButtons>
          <Button onClick={exportToCSV}>Preuzmi CSV</Button>
          <Button onClick={exportToPDF}>Preuzmi PDF</Button>
        </StyledExportButtons>
        <Table columns="0.2fr 1fr 1fr 1.2fr 0.2fr">
          <Table.Header>
            <div></div>
            <div>Ime rezervacije</div>
            <div>Kontakt</div>
            <div>Datum</div>
            <div>Broj gostiju</div>
          </Table.Header>

          <Table.Body
            data={bookings}
            render={(booking) => (
              <DashboardBookingRow key={booking.id} booking={booking} />
            )}
          />
        </Table>
      </StyledDashboardLayout>
    </div>
  );
}

export default DashboardLayout;
