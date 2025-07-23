import styled from "styled-components";
import { addDays, format } from "date-fns";
import { enUS } from "date-fns/locale";

import { formatCurrency } from "../../utils/helpers";
import {
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCurrencyEuro,
  HiOutlineHomeModern,
  HiXMark,
} from "react-icons/hi2";
import { BsTelephoneForward } from "react-icons/bs";

import { MdOutlineContactMail } from "react-icons/md";
import { LuVegan } from "react-icons/lu";

import DataItem from "../../ui/DataItem";
import { useEffect, useMemo, useState } from "react";
import Button from "../../ui/Button";
import supabase from "../../services/supabase";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";

const StyledBookingDataBox = styled.section`
  padding: 3.2rem 4rem;
  overflow: hidden;

  @media (max-width: 768px) {
    margin-left: 0;
    padding-left: 0; /* Remove left padding */
    width: 90%;
  }
  @media (max-width: 480px) {
    padding: 1rem;
    width: 100%;
  }
`;

const TokAranzmana = styled.section`
  padding: 1rem;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  margin-top: 5rem;
  box-shadow: var(--shadow-md);
  border-radius: 7px;

  .data-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.6rem;
    padding: 1.2rem;
    border-bottom: 1px solid var(--color-grey-300); /* Add bottom line */
  }

  button {
    background: var(--color-red-300);
    color: white;
    border: none;
    font-size: 2.2rem;
  }

  label {
    flex: 1;
    font-weight: 500;
  }

  input {
    flex: 0 0 8rem;
    text-align: center;
  }
  .input-wrapper {
    display: flex; /* Align input and button horizontally */
    align-items: center; /* Align input and button vertically */
    gap: 0.8rem; /* Add spacing between input and button */
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    .data-item {
      flex-direction: column; /* Stack label and input/button vertically */
      align-items: flex-start; /* Align items to the left */
      gap: 0.8rem; /* Add spacing between label and input/button */
    }

    .input-wrapper {
      display: flex; /* Align input and button horizontally */
      align-items: center; /* Align input and button vertically */
      gap: 0.8rem; /* Add spacing between input and button */
      width: 70%; /* Ensure the wrapper takes full width */
    }

    input {
      flex: 1; /* Allow input to take up available space */
      width: 70%; /* Ensure input takes full width inside the wrapper */
    }

    select {
      width: 70%; /* Make select take full width */
    }
  }
`;

const Select = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  margin-top: 1.2rem;
`;

const Input = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  width: 8rem;
`;

const Header = styled.header`
  background-color: var(--color-brand-500);
  padding: 2.4rem 4rem;
  color: var(--color-grey-50);
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    height: 3.2rem;
    width: 3.2rem;
  }

  & div:first-child {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-weight: 600;
    font-size: 1.8rem;
  }

  & span {
    font-family: "Sono";
    font-size: 2rem;
    margin-left: 4px;
  }
  @media (max-width: 768px) {
    flex-direction: column; /* Stack items vertically */
    align-items: flex-start; /* Align items to the left */
    padding: 1.5rem; /* Reduce padding for smaller screens */
    font-size: 16px;
    svg {
      height: 3rem;
      width: 3rem;
    }

    & p {
      margin-top: 1rem; /* Add spacing between <div> and <p> */
      font-size: 16px;
    }
  }

  @media (max-width: 480px) {
    padding: 1rem; /* Further reduce padding for very small screens */
  }
`;

const DetaljiRezervacije = styled.section`
  padding: 3.2rem 4rem 1.2rem;
  max-width: 100%; /* Ensure it doesn't exceed the screen width */

  @media (max-width: 768px) {
    padding: 2rem; //Reduce padding for smaller screens
    margin: 0 auto; /* Center the section */
    font-size: 1.4rem; /* Adjust font size for smaller screens */
  }

  @media (max-width: 480px) {
    padding: 1.4rem; /* Further reduce padding for very small screens */
    font-size: 1.2rem; /* Adjust font size for very small screens */
  }
`;

const Gost = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  font-weight: 500;
  color: var(--color-grey-700);

  h4 {
    margin: 0;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    font-size: 1.4rem;
    gap: 0.8rem;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    gap: 0.4rem;
  }
`;

const GuestInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 0.4rem;
  }
`;

const AranzmanText = styled.span`
  text-transform: uppercase;

  @media (max-width: 768px) {
    & > span {
      font-size: 0.8em;
    }
  }
`;

const Cijena = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 3.2rem;
  border-radius: var(--border-radius-sm);
  margin-top: 2.4rem;

  background-color: ${(props) =>
    props.isPaid ? "var(--color-green-100)" : "var(--color-yellow-100)"};
  color: ${(props) =>
    props.isPaid ? "var(--color-green-700)" : "var(--color-yellow-700)"};

  & p:last-child {
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 600;
  }

  svg {
    height: 2.4rem;
    width: 2.4rem;
    color: currentColor !important;
  }

  @media (max-width: 768px) {
    flex-direction: column; /* Stack items vertically */
    align-items: flex-start; /* Align items to the left */
    svg {
      display: none;
    }
  }
`;

const Footer = styled.footer`
  padding: 1.6rem 4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;
  @media (max-width: 768px) {
    text-align: left;
  }
`;

const customLocale = {
  ...enUS,
  localize: {
    ...enUS.localize,
    day: (narrowDay) => {
      const days = ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"];
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

function BookingDataBox({ booking, bookingId, children }) {
  const [daysData, setDaysData] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const location = useLocation();
  const boxRef = useRef(null);
  const navigate = useNavigate();

  const {
    created_at,
    imeRezervacije,
    datumDolaska,
    datumOdlaska,
    brojNocenja,
    brojGostiju,
    djeca,
    aranzman,
    ukupnoZaNaplatu,
    odakleRezervacija,
    kontakt,
    napomena,
    avans,
    brojVegana,
    rezervacija_bungalovi,
  } = booking;

  const aranzmanMapping = {
    50: "Dnevni rafting",
    130: "Rafting 2 dana",
    110: "Rafting 2 dana",
    95: "Rafting 2 dana",
    175: "Rafting 3 dana",
    155: "Rafting 3 dana",
    145: "Rafting 3 dana",
    125: "Rafting 3 dana",
    180: "2 raftinga 3 dana",
    200: "2 raftinga 3 dana",
    210: "2 raftinga 3 dana",
    230: "2 raftinga 3 dana",
    0: "Rafting sa vrha tare 100km",
  };

  const aranzmanText = aranzmanMapping[aranzman] || aranzman;

  const validDatumDolaska = useMemo(() => {
    return datumDolaska && !isNaN(new Date(datumDolaska))
      ? datumDolaska
      : new Date();
  }, [datumDolaska]);

  const validDatumOdlaska = useMemo(() => {
    return datumOdlaska && !isNaN(new Date(datumOdlaska))
      ? datumOdlaska
      : new Date();
  }, [datumOdlaska]);

  const validCreatedAt = useMemo(() => {
    return created_at && !isNaN(new Date(created_at)) ? created_at : new Date();
  }, [created_at]);

  const imeBungalova =
    brojNocenja === 0
      ? ""
      : rezervacija_bungalovi && rezervacija_bungalovi.length > 0
      ? rezervacija_bungalovi
          .map((rel) => {
            const ime = rel.bungalovi?.imeBungalova || "";
            const kreveta = rel.bungalovi?.brojKreveta || "";
            return `${ime}${
              ime === "" || kreveta === "" ? "" : `(1/${kreveta})`
            }`;
          })
          .join(" ")
      : "";

  const gostijuGramatika =
    brojGostiju === 1
      ? "gost"
      : brojGostiju === 2 || brojGostiju === 3 || brojGostiju === 4
      ? "gosta"
      : "gostiju";

  function prvoSlovoVeliko(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const generateDays = (startDate, brojNocenja) => {
    if (!startDate || isNaN(new Date(startDate))) {
      console.error("neispravan datum", startDate);
      return [];
    }

    const days = [];
    for (let i = 0; i < brojNocenja; i++) {
      const day = addDays(new Date(startDate), i);
      days.push(day);
    }

    return days;
  };

  const days = useMemo(
    () => generateDays(validDatumDolaska, brojNocenja + 1),
    [validDatumDolaska, brojNocenja]
  );

  useEffect(() => {
    async function fetchSavedData() {
      try {
        // Fetch tok_aranzmana data
        const { data: tokAranzmanaData, error: tokAranzmanaError } =
          await supabase
            .from("tok_aranzmana")
            .select("*")
            .eq("rezervacije_id", bookingId);

        if (tokAranzmanaError) {
          console.error(
            "Error fetching tok_aranzmana data:",
            tokAranzmanaError
          );
          return;
        }

        // Fetch dodatna_aktivnost data
        const { data: dodatnaAktivnostData, error: dodatnaAktivnostError } =
          await supabase
            .from("dodatna_aktivnost")
            .select("*")
            .eq("rezervacije_id", bookingId);

        if (dodatnaAktivnostError) {
          console.error(
            "Error fetching dodatna_aktivnost data:",
            dodatnaAktivnostError
          );
          return;
        }

        // Map tok_aranzmana data and merge with dodatna_aktivnost
        if (tokAranzmanaData && tokAranzmanaData.length > 0) {
          const fetchedDaysData = tokAranzmanaData.map((day) => {
            const dodatnaAktivnost = dodatnaAktivnostData.find(
              (aktivnost) => aktivnost.day_number === day.day_number
            );

            return {
              dayNumber: parseInt(day.day_number, 10),
              dorucak: day.broj_gostiju_dorucak || 0,
              rucak: day.broj_gostiju_rucak || 0,
              vecera: day.broj_gostiju_vecera || 0,
              nocenje: day.broj_gostiju_nocenje || 0,
              aktivnosti: dodatnaAktivnost
                ? [dodatnaAktivnost.aktivnost]
                : [{ aktivnost: "Bez dodatne aktivnosti", brojGostiju: 0 }],
            };
          });

          setDaysData(fetchedDaysData);
        } else {
          // Initialize default daysData if no data exists
          const totalGuests = brojGostiju + djeca;
          setDaysData(
            days.map((day, index) => ({
              dayNumber: index + 1,
              dorucak: totalGuests,
              rucak: totalGuests,
              vecera: totalGuests,
              nocenje: totalGuests,
              aktivnosti: [
                { aktivnost: "Bez dodatne aktivnosti", brojGostiju: 0 },
              ],
            }))
          );
        }
      } catch (err) {
        console.error("Unexpected error fetching data:", err);
      }
    }

    fetchSavedData();
  }, [bookingId, days, brojGostiju, djeca]);

  useEffect(() => {
    // Check if the query parameter "new=true" exists
    const params = new URLSearchParams(location.search);
    if (params.get("novaRez") === "true") {
      setShowDetails(false); // Hide details initially
    } else {
      setShowDetails(true); // Show details by default
    }
  }, [location.search]);

  function handleChangeDayInput(dayIndex, field, value) {
    const updatedDays = [...daysData];

    updatedDays[dayIndex][field] = parseInt(value, 10) || 0;
    setDaysData(updatedDays);
  }

  function handleChangeAktivnost(dayIndex, value) {
    const updatedDays = [...daysData];

    // Ensure aktivnosti is always an array
    updatedDays[dayIndex].aktivnosti = [
      {
        aktivnost: value || "Bez dodatne aktivnosti", // Default to "Bez dodatne aktivnosti"
        brojGostiju:
          value === "Bez dodatne aktivnosti"
            ? 0
            : updatedDays[dayIndex].aktivnosti?.[0]?.brojGostiju || 0,
      },
    ];

    setDaysData(updatedDays);
  }

  function handleChangeBrojGostiju(dayIndex, value) {
    const updatedDays = [...daysData];

    // Update the brojGostiju for the single activity
    if (updatedDays[dayIndex].aktivnosti.length > 0) {
      updatedDays[dayIndex].aktivnosti[0].brojGostiju =
        parseInt(value, 10) || 0;
    }

    setDaysData(updatedDays);
  }

  async function saveTokAranzmana(rezervacijeId) {
    if (!daysData || daysData.length === 0) {
      console.error("daysData is empty or not initialized.");
      toast.error("Podaci nisu učitani. Pokušajte ponovo.");
      return;
    }

    if (!rezervacijeId) {
      console.error("rezervacijeId is invalid.");
      toast.error("Greška: ID rezervacije nije validan.");
      return;
    }

    if (!validDatumDolaska || isNaN(new Date(validDatumDolaska))) {
      console.error("validDatumDolaska is invalid:", validDatumDolaska);
      toast.error("Greška: Datum dolaska nije validan.");
      return;
    }

    try {
      for (const day of daysData) {
        if (!day.dayNumber || isNaN(day.dayNumber)) {
          console.error("day.dayNumber is invalid:", day.dayNumber);
          toast.error("Greška: Broj dana nije validan.");
          return;
        }

        let dayDate;
        try {
          dayDate = addDays(new Date(validDatumDolaska), day.dayNumber - 1);
        } catch (err) {
          console.error("Error calculating dayDate:", err);
          toast.error("Greška prilikom obrade datuma.");
          return;
        }

        let dayName;
        try {
          dayName = format(dayDate, "EEEE", { locale: customLocaleTA });
        } catch (err) {
          console.error("Error formatting dayName:", err);
          toast.error("Greška prilikom formatiranja datuma.");
          return;
        }

        const formattedDayNumber = `${day.dayNumber}-${dayName}`;

        const payload = {
          rezervacije_id: rezervacijeId,
          day_number: formattedDayNumber,
          broj_gostiju_dorucak: day.dorucak,
          broj_gostiju_rucak: day.rucak,
          broj_gostiju_vecera: day.vecera,
          broj_gostiju_nocenje: day.nocenje,
        };

        const { data: existingData, error: fetchError } = await supabase
          .from("tok_aranzmana")
          .select("id")
          .eq("rezervacije_id", rezervacijeId)
          .eq("day_number", formattedDayNumber)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error fetching tok_aranzmana:", fetchError);
          toast.error("Greška prilikom čuvanja podataka.");
          return;
        }

        if (existingData) {
          const { error: updateError } = await supabase
            .from("tok_aranzmana")
            .update(payload)
            .eq("id", existingData.id);

          if (updateError) {
            console.error("Error updating tok_aranzmana:", updateError);
            toast.error("Greška prilikom čuvanja podataka.");
            return;
          }
        } else {
          const { error: insertError } = await supabase
            .from("tok_aranzmana")
            .insert(payload);

          if (insertError) {
            console.error("Error inserting tok_aranzmana:", insertError);
            toast.error("Greška prilikom čuvanja podataka.");
            return;
          }
        }

        const dodatnaAktivnostPayload = {
          rezervacije_id: rezervacijeId,
          day_number: formattedDayNumber,
          aktivnost:
            day.aktivnosti.length > 0
              ? day.aktivnosti[0]
              : { aktivnost: "Bez aktivnosti", brojGostiju: 0 },
        };

        const { data: existingActivity, error: fetchActivityError } =
          await supabase
            .from("dodatna_aktivnost")
            .select("id")
            .eq("rezervacije_id", rezervacijeId)
            .eq("day_number", formattedDayNumber)
            .single();

        if (fetchActivityError && fetchActivityError.code !== "PGRST116") {
          console.error(
            "Error fetching dodatna_aktivnost:",
            fetchActivityError
          );
          toast.error("Greška prilikom čuvanja dodatnih aktivnosti.");
          return;
        }

        if (existingActivity) {
          const { error: updateActivityError } = await supabase
            .from("dodatna_aktivnost")
            .update(dodatnaAktivnostPayload)
            .eq("id", existingActivity.id);

          if (updateActivityError) {
            console.error(
              "Error updating dodatna_aktivnost:",
              updateActivityError
            );
            toast.error("Greška prilikom čuvanja dodatnih aktivnosti.");
            return;
          }
        } else {
          const { error: insertActivityError } = await supabase
            .from("dodatna_aktivnost")
            .insert(dodatnaAktivnostPayload);

          if (insertActivityError) {
            console.error(
              "Error inserting dodatna_aktivnost:",
              insertActivityError
            );
            toast.error("Greška prilikom čuvanja dodatnih aktivnosti.");
            return;
          }
        }
      }

      // Update the ukupnoZaNaplatu in the bookings table
      // const { data, error: updateBookingError } = await supabase
      //   .from("rezervacije")
      //   .update({ ukupnoZaNaplatu: adjustedUkupnoZaNaplatu })
      //   .eq("id", rezervacijeId);

      // if (updateBookingError) {
      //   console.error("Error updating ukupnoZaNaplatu:", updateBookingError);
      //   toast.error("Greška prilikom ažuriranja ukupne cijene.");
      //   return;
      // }

      // console.log("Update successful:", data);
      toast.success("Tok aranžmana sačuvan!");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Greška prilikom čuvanja podataka.");
    }
  }

  return (
    <StyledBookingDataBox ref={boxRef}>
      {showDetails && (
        <div id="rezervacija-detalji">
          <Header>
            <div>
              <HiOutlineHomeModern />
              <p>
                {brojNocenja === 1 ? "Jedno noćenje" : brojNocenja + " noćenja"}{" "}
                <span style={{ textTransform: "uppercase" }}>
                  {imeBungalova}
                </span>
              </p>
            </div>

            <p>
              {format(new Date(validDatumDolaska), "EEE, dd. MMM yyyy.", {
                locale: customLocale,
              })}
              &nbsp;&mdash;&nbsp;
              {format(new Date(validDatumOdlaska), "EEE, dd. MMM yyyy.", {
                locale: customLocale,
              })}
            </p>
          </Header>
          <DetaljiRezervacije>
            <Gost>
              <GuestInfo>
                {prvoSlovoVeliko(imeRezervacije)}
                <h4>
                  {brojGostiju + djeca} {gostijuGramatika}
                </h4>
              </GuestInfo>
              <h4>
                &bull;&nbsp;&nbsp;
                <AranzmanText>
                  {aranzmanText.includes("(") ? (
                    <>
                      {aranzmanText.split("(")[0]}
                      <span>({aranzmanText.split("(")[1]}</span>
                    </>
                  ) : (
                    aranzmanText
                  )}
                </AranzmanText>
              </h4>
            </Gost>

            <DataItem
              icon={<MdOutlineContactMail />}
              label="Gost kontaktirao putem"
            >
              {odakleRezervacija}
            </DataItem>

            <DataItem icon={<BsTelephoneForward />}>
              <Button
                variation="secondary"
                size="small"
                style={{
                  color: "#4338ca",
                  fontSize: "1.2rem",
                  padding: "0.2rem",
                }}
                onMouseDown={() => {
                  navigator.clipboard
                    .writeText(booking.kontakt)
                    .then(() => {
                      toast.success("Kontakt kopiran!");
                    })
                    .catch((err) => {
                      console.error("Greška prilikom kopiranja kontakta:", err);
                      toast.error("Greška prilikom kopiranja kontakta.");
                    });
                }}
              >
                {kontakt}
              </Button>
            </DataItem>

            <DataItem icon={<LuVegan />} label="Broj vegana">
              {brojVegana}
            </DataItem>

            {napomena && (
              <DataItem
                icon={<HiOutlineChatBubbleBottomCenterText />}
                label="Napomena"
              >
                {napomena}
              </DataItem>
            )}
            <Cijena>
              <DataItem
                icon={<HiOutlineCurrencyEuro />}
                label={`Ukupna cijena`}
              >
                <p>{formatCurrency(ukupnoZaNaplatu)}</p>
              </DataItem>
              Avans: {avans}€
            </Cijena>
          </DetaljiRezervacije>

          <Footer>
            <p>
              Rezervacija napravljena u{" "}
              {format(new Date(validCreatedAt), "EEE, dd. MMM", {
                locale: customLocale,
              })}
              {booking.creator_name && (
                <span>
                  <br />
                  Rezervaciju napravila/izmjenila {booking.creator_name}
                </span>
              )}
            </p>
          </Footer>
          {children}
        </div>
      )}

      <TokAranzmana id="tok-aranzmana">
        <h2 style={{ fontSize: "2.6rem" }}>Tok aranžmana</h2>
        <br />
        {daysData.map((day, dayIndex) => (
          <div key={dayIndex}>
            <p
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                padding: "1.2rem",
              }}
            >
              {days[dayIndex] && !isNaN(new Date(days[dayIndex]))
                ? format(new Date(days[dayIndex]), "EEEE, dd. MMM", {
                    locale: customLocaleTA,
                  }) + (dayIndex === 0 ? " (dan dolaska)" : "")
                : "Neispravan datum"}
            </p>

            {/* Broj gostiju za doručak */}
            <div className="data-item">
              <label>Broj gostiju za doručak</label>
              <div className="input-wrapper">
                <Input
                  type="number"
                  min="0"
                  value={day.dorucak}
                  onChange={(e) =>
                    handleChangeDayInput(dayIndex, "dorucak", e.target.value)
                  }
                />
                <button
                  onClick={() => handleChangeDayInput(dayIndex, "dorucak", 0)}
                >
                  <HiXMark />
                </button>
              </div>
            </div>

            {/* Dodatna aktivnost */}
            <div className="data-item">
              <label>Dodatna aktivnost</label>
              <Select
                value={
                  day.aktivnosti?.[0]?.aktivnost || "Bez dodatne aktivnosti"
                }
                onChange={(e) =>
                  handleChangeAktivnost(dayIndex, e.target.value)
                }
              >
                <option value="Bez dodatne aktivnosti">
                  Bez dodatne aktivnosti
                </option>
                <option value="rafting">Rafting</option>
                <option value="velenici...">Velenići...</option>
                <option value="sutjeska">NP Sutjeska</option>
                <option value="trnovacko jezero">Trnovačko jezero</option>
                <option value="kanjoning">Kanjoning</option>
              </Select>
            </div>

            {/* Conditionally display input field for broj gostiju */}
            {day.aktivnosti?.[0]?.aktivnost !== "Bez dodatne aktivnosti" && (
              <div className="data-item">
                <label>Broj gostiju za {day.aktivnosti?.[0]?.aktivnost}</label>
                <div className="input-wrapper">
                  <Input
                    type="number"
                    min="0"
                    value={day.aktivnosti?.[0]?.brojGostiju || 0}
                    onChange={(e) =>
                      handleChangeBrojGostiju(dayIndex, e.target.value)
                    }
                  />
                  <button onClick={() => handleChangeBrojGostiju(dayIndex, 0)}>
                    <HiXMark />
                  </button>
                </div>
              </div>
            )}
            {/* Broj gostiju za ručak */}
            <div className="data-item">
              <label>Broj gostiju za ručak</label>
              <div className="input-wrapper">
                <Input
                  type="number"
                  min="0"
                  value={day.rucak}
                  onChange={(e) =>
                    handleChangeDayInput(dayIndex, "rucak", e.target.value)
                  }
                />

                <button
                  onClick={() => handleChangeDayInput(dayIndex, "rucak", 0)}
                >
                  <HiXMark />
                </button>
              </div>
            </div>

            {/* Broj gostiju za večeru */}
            <div className="data-item">
              <label>Broj gostiju za večeru</label>
              <div className="input-wrapper">
                <Input
                  type="number"
                  min="0"
                  value={day.vecera}
                  onChange={(e) =>
                    handleChangeDayInput(dayIndex, "vecera", e.target.value)
                  }
                />

                <button
                  onClick={() => handleChangeDayInput(dayIndex, "vecera", 0)}
                >
                  <HiXMark />
                </button>
              </div>
            </div>

            {/* Broj gostiju za noćenje */}
            <div className="data-item">
              <label>Broj gostiju za noćenje</label>
              <div className="input-wrapper">
                <Input
                  type="number"
                  min="0"
                  value={day.nocenje}
                  onChange={(e) =>
                    handleChangeDayInput(dayIndex, "nocenje", e.target.value)
                  }
                />
                <button
                  onClick={() => handleChangeDayInput(dayIndex, "nocenje", 0)}
                >
                  <HiXMark />
                </button>
              </div>
            </div>
          </div>
        ))}

        <Button
          onClick={() => {
            saveTokAranzmana(bookingId);
            setShowDetails(true);
            boxRef.current.scrollIntoView({ behavior: "smooth" });

            const params = new URLSearchParams(window.location.search);
            params.delete("novaRez");
            navigate(`${window.location.pathname}?${params.toString()}`, {
              replace: true,
            });
          }}
          style={{
            marginTop: "1.2rem",
            borderRadius: "var(--border-radius-sm)",
            boxShadow: "var(--shadow-sm)",
            padding: "1.2rem 2.4rem",
            fontSize: "1.6rem",
            backgroundColor: "var(--color-brand-600)",
          }}
        >
          Sačuvaj
        </Button>
      </TokAranzmana>
    </StyledBookingDataBox>
  );
}

export default BookingDataBox;
