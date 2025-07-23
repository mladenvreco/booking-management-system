import { useState, useEffect } from "react";
import supabase from "../services/supabase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../ui/Button";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Stat from "../features/dashboard/Stat";
import { HiOutlineBanknotes, HiOutlineCreditCard } from "react-icons/hi2";
import { HiOutlineNewspaper } from "react-icons/hi";
import { MdPeopleOutline } from "react-icons/md";
import styled from "styled-components";
import TodoList from "../features/dashboard/TodoList";

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TodoListContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 120px;
`;

function KontrolnaTabla() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [summary, setSummary] = useState({
    totalPeople: 0,
    totalRevenue: 0,
    totalAdvance: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let query = supabase.from("rezervacije").select("*");

        if (selectedPeriod === "week") {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);

          query = query
            .gte("datumDolaska", weekAgo.toISOString().split("T")[0])
            .lt("datumDolaska", new Date().toISOString().split("T")[0]);
        } else if (selectedPeriod === "month") {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          query = query
            .gte("datumDolaska", monthAgo.toISOString().split("T")[0])
            .lt("datumDolaska", new Date().toISOString().split("T")[0]);
        } else if (selectedPeriod === "custom") {
          query = query
            .gte("datumDolaska", startDate.toISOString().split("T")[0])
            .lte("datumDolaska", endDate.toISOString().split("T")[0]);
        }

        const { data, error } = await query;

        if (error) throw error;

        const processedData = processDataForCharts(data);
        setData(processedData);
        calculateSummary(data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod, startDate, endDate]);

  const processDataForCharts = (rawData) => {
    const groupedData = rawData.reduce((acc, booking) => {
      const date = new Date(booking.datumDolaska);
      const formattedDate = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;
      if (!acc[formattedDate]) {
        acc[formattedDate] = {
          date: formattedDate,
          totalPeople: 0,
          revenue: 0,
          advance: 0,
          bookings: 0,
        };
      }
      acc[formattedDate].totalPeople +=
        (booking.brojGostiju || 0) + (booking.djeca || 0);
      acc[formattedDate].revenue += parseFloat(booking.ukupnoZaNaplatu || 0);
      acc[formattedDate].advance += parseFloat(booking.avans || 0);
      acc[formattedDate].bookings += 1;
      return acc;
    }, {});

    return Object.values(groupedData);
  };

  const calculateSummary = (rawData) => {
    const currentSummary = {
      totalPeople: 0,
      totalRevenue: 0,
      totalAdvance: 0,
      totalBookings: 0,
    };

    rawData.forEach((booking) => {
      currentSummary.totalPeople +=
        (booking.brojGostiju || 0) + (booking.djeca || 0);
      currentSummary.totalRevenue += parseFloat(booking.ukupnoZaNaplatu || 0);
      currentSummary.totalAdvance += parseFloat(booking.avans || 0);
      currentSummary.totalBookings += 1;
    });

    setSummary(currentSummary);
  };

  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Izvještaj", 14, 15);

    doc.setFontSize(12);
    let periodText = "";
    if (selectedPeriod === "week") {
      periodText = "Prethodnih 7 dana";
    } else if (selectedPeriod === "month") {
      periodText = "Prethodnih 30 dana";
    } else {
      periodText = `Period: ${startDate.toLocaleDateString(
        "sr-RS"
      )} - ${endDate.toLocaleDateString(
        "sr-RS"
      )} (Zakljucno sa ${endDate.toLocaleDateString("sr-RS")})`;
    }
    doc.text(periodText, 14, 25);

    doc.autoTable({
      startY: 35,
      head: [["Kategorija", "Zbir"]],
      body: [
        [
          "Ukupan prihod (aranžmani + izleti)",
          `${summary.totalRevenue.toLocaleString()} €`,
        ],
        ["Ukupan avans", `${summary.totalAdvance.toLocaleString()} €`],
        ["Ukupno Gostiju", summary.totalPeople.toString()],
        ["Ukupno rezervacija", summary.totalBookings.toString()],
      ],
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    doc.save(
      `izvjestaj-${new Date().toLocaleDateString("sr-RS").split("T")[0]}.pdf`
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* TodoList Section */}
        <TodoListContainer>
          <TodoList />
        </TodoListContainer>

        {/* Statistika section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Statistika</h1>
        </div>

        {/* Period Selector */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedPeriod("week")}
              className={`font-medium border-2 rounded-md text-lg
              px-5 py-3
            sm:px-3 sm:py-2 sm:text-base
    ${
      selectedPeriod === "week"
        ? "bg-brand-600 text-white border-brand-600"
        : "bg-white text-grey-700 border-grey-300 hover:bg-emerald-50"
    }
  `}
              style={{
                padding: "0.75rem 1.25rem",
                borderRadius: "0.375rem",
                fontWeight: "500",
                fontSize: "1.125rem",
                border: "2px solid",
                ...(selectedPeriod === "week"
                  ? {
                      backgroundColor: "var(--color-brand-600)",
                      color: "white",
                      borderColor: "var(--color-brand-600)",
                    }
                  : {
                      backgroundColor: "white",
                      color: "var(--color-grey-700)",
                      borderColor: "var(--color-grey-300)",
                      ":hover": { backgroundColor: "#ecfdf5" },
                    }),
              }}
            >
              Prethodnih 7 dana
            </button>
            &nbsp;
            <button
              onClick={() => setSelectedPeriod("month")}
              style={{
                padding: "0.75rem 1.25rem",
                borderRadius: "0.375rem",
                fontWeight: "500",
                fontSize: "1.125rem",
                border: "2px solid",
                ...(selectedPeriod === "month"
                  ? {
                      backgroundColor: "var(--color-brand-600)",
                      color: "white",
                      borderColor: "var(--color-brand-600)",
                    }
                  : {
                      backgroundColor: "white",
                      color: "var(--color-grey-700)",
                      borderColor: "var(--color-grey-300)",
                      ":hover": { backgroundColor: "#ecfdf5" },
                    }),
              }}
            >
              Prethodnih 30 dana
            </button>
            &nbsp;
            <button
              onClick={() => setSelectedPeriod("custom")}
              style={{
                padding: "0.75rem 1.25rem",
                borderRadius: "0.375rem",
                fontWeight: "500",
                fontSize: "1.125rem",
                border: "2px solid",
                ...(selectedPeriod === "custom"
                  ? {
                      backgroundColor: "var(--color-brand-600)",
                      color: "white",
                      borderColor: "var(--color-brand-600)",
                    }
                  : {
                      backgroundColor: "white",
                      color: "var(--color-grey-700)",
                      borderColor: "var(--color-grey-300)",
                      ":hover": { backgroundColor: "#ecfdf5" },
                    }),
              }}
            >
              Odaberi period
            </button>
            {selectedPeriod === "custom" && (
              <div className="flex items-center space-x-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="border rounded px-2 py-1"
                  dateFormat="dd-MM-yyyy"
                />
                <span>-</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="border rounded px-2 py-1"
                  dateFormat="dd-MM-yyyy"
                />
              </div>
            )}
          </div>
        </div>
        <br />

        <StatsContainer>
          <Stat
            title="Ukupan prihod (aranžmani + izleti)"
            color="green"
            icon={<HiOutlineBanknotes />}
            value={summary.totalRevenue.toLocaleString() + "€"}
          />
          <Stat
            title="Ukupan avans"
            color="blue"
            icon={<HiOutlineCreditCard />}
            value={summary.totalAdvance.toLocaleString() + "€"}
          />
          <Stat
            title="Ukupno gostiju"
            color="yellow"
            icon={<MdPeopleOutline />}
            value={summary.totalPeople.toLocaleString()}
          />
          <Stat
            title="Ukupno rezervacija"
            color="indigo"
            icon={<HiOutlineNewspaper />}
            value={summary.totalBookings.toLocaleString()}
          />
        </StatsContainer>
      </div>
      <Button
        size="small"
        onClick={downloadReport}
        className="bg-green-500 hover:bg-green-600 text-white"
      >
        Preuzmi izvještaj
      </Button>
    </div>
  );
}

export default KontrolnaTabla;
