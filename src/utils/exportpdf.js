import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Export bookings to PDF.
 * @param {Object[]} bookings - Array of booking objects.
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 * @param {function} toast - Toast notification function.
 * @param {number|string} narednih - Optional, number of days if no date range.
 */
export function exportToPDF({ bookings, startDate, endDate, toast, narednih }) {
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
      const formattedDate = `${nextDate.getDate()}.${nextDate.getMonth() + 1}`;
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
    const headers = ["Ime", "Broj gostiju", "Vegani", "Bungalov"];

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
        (booking.imeRezervacije || "")
          .replace(/č/g, "c")
          .replace(/ć/g, "c")
          .replace(/đ/g, "dj")
          .replace(/Č/g, "C")
          .replace(/Ć/g, "C")
          .replace(/Đ/g, "Dj"),
        booking.brojGostiju + booking.djeca,
        booking.brojVegana || 0,
        booking.rezervacija_bungalovi
          ?.map((b) => b.bungalovi?.imeBungalova)
          .join(", ") || "/",
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
          Math.floor((currentDate - bookingStartDate) / (1000 * 60 * 60 * 24)) +
          1;

        const dayDetails =
          booking.tok_aranzmana?.find((d) => {
            const dayNumFromString = parseInt(d.day_number.split("-")[0]);
            return dayNumFromString === dayNumber;
          }) || {};

        const raftingDetails = booking.dodatna_aktivnost?.find((a) => {
          const dayNumFromString = parseInt(a.day_number.split("-")[0]);
          return (
            dayNumFromString === dayNumber &&
            (a.aktivnost?.aktivnost?.toLowerCase?.().includes("rafting") ||
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
    const totals = new Array(rows[0]?.length || 0).fill(0);
    rows.forEach((row) => {
      row.forEach((cell, index) => {
        // Skip name, bungalov, and date label columns
        if (
          index !== 0 && // not Ime
          index !== 3 && // not Bungalov
          !(index >= 4 && (index - 4) % 6 === 0) // not a date label column
        ) {
          totals[index] += Number(cell) || 0;
        }
      });
    });

    // Create totals row for this chunk
    const totalRow = totals.map((total, index) => {
      if (index === 0) return "UKUPNO";
      if (index === 3) return ""; // Skip bungalov column
      if (index >= 4 && (index - 4) % 6 === 0) return ""; // Skip date label columns
      return total;
    });

    // Add new page for each chunk except the first one
    if (chunkIndex > 0) {
      pdf.addPage();
    }

    // Add title
    pdf.setFontSize(16);
    pdf.text(`Rezervacije - ${chunk[0]} do ${chunk[chunk.length - 1]}`, 20, 15);

    // Add main table to the PDF with totals row included
    pdf.autoTable({
      head: [headers],
      body: [...rows, totalRow],
      startY: 30,
      margin: { left: 10, right: 10 },
      tableWidth: "auto",
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
        3: { cellWidth: "auto" }, // Bungalov
      },
      didParseCell: function (data) {
        // Apply styles to all date-related columns
        if (data.column.index >= 6) {
          data.cell.styles.cellWidth = "auto";
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
}
