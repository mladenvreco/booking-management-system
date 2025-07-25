import { addDays, format } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsTelephoneForward } from "react-icons/bs";
import {
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCurrencyEuro,
  HiOutlineHomeModern,
  HiXMark,
} from "react-icons/hi2";
import { LuVegan } from "react-icons/lu";
import { MdOutlineContactMail } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import supabase from "../../services/supabase";
import Button from "../../ui/Button";
import DataItem from "../../ui/DataItem";
import { getCustomLocale } from "../../utils/customLocale";
import { formatCurrency } from "../../utils/helpers";

// --- Styled Components ---
const StyledBookingDataBox = styled.section`
  padding: 3.2rem 4rem;
  overflow: hidden;
  @media (max-width: 768px) {
    margin-left: 0;
    padding-left: 0;
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
    border-bottom: 1px solid var(--color-grey-300);
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
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  @media (max-width: 768px) {
    width: 100%;
    .data-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.8rem;
    }
    .input-wrapper {
      width: 70%;
    }
    input,
    select {
      width: 70%;
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
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
    font-size: 16px;
    svg {
      height: 3rem;
      width: 3rem;
    }
    & p {
      margin-top: 1rem;
      font-size: 16px;
    }
  }
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const DetaljiRezervacije = styled.section`
  padding: 3.2rem 4rem 1.2rem;
  max-width: 100%;
  @media (max-width: 768px) {
    padding: 2rem;
    margin: 0 auto;
    font-size: 1.4rem;
  }
  @media (max-width: 480px) {
    padding: 1.4rem;
    font-size: 1.2rem;
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
    flex-direction: column;
    align-items: flex-start;
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

// --- Helper functions ---
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

function prvoSlovoVeliko(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function generateDays(startDate, brojNocenja) {
  if (!startDate || isNaN(new Date(startDate))) return [];
  return Array.from({ length: brojNocenja }, (_, i) =>
    addDays(new Date(startDate), i)
  );
}

// --- Main Component ---
function BookingDataBox({ booking, bookingId, children }) {
  const [daysData, setDaysData] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const location = useLocation();
  const boxRef = useRef(null);
  const navigate = useNavigate();

  // --- Destructure booking ---
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
    creator_name,
  } = booking;

  // --- Derived values ---
  const aranzmanText = aranzmanMapping[aranzman] || aranzman;
  const validDatumDolaska = useMemo(
    () =>
      datumDolaska && !isNaN(new Date(datumDolaska))
        ? datumDolaska
        : new Date(),
    [datumDolaska]
  );
  const validDatumOdlaska = useMemo(
    () =>
      datumOdlaska && !isNaN(new Date(datumOdlaska))
        ? datumOdlaska
        : new Date(),
    [datumOdlaska]
  );
  const validCreatedAt = useMemo(
    () =>
      created_at && !isNaN(new Date(created_at)) ? created_at : new Date(),
    [created_at]
  );
  const imeBungalova =
    brojNocenja === 0
      ? ""
      : rezervacija_bungalovi && rezervacija_bungalovi.length > 0
      ? rezervacija_bungalovi
          .map((rel) => {
            const ime = rel.bungalovi?.imeBungalova || "";
            const kreveta = rel.bungalovi?.brojKreveta || "";
            return `${ime}${ime && kreveta ? `(1/${kreveta})` : ""}`;
          })
          .join(" ")
      : "";
  const gostijuGramatika =
    brojGostiju === 1
      ? "gost"
      : [2, 3, 4].includes(brojGostiju)
      ? "gosta"
      : "gostiju";
  const days = useMemo(
    () => generateDays(validDatumDolaska, brojNocenja + 1),
    [validDatumDolaska, brojNocenja]
  );

  // --- Data fetching ---
  useEffect(() => {
    async function fetchSavedData() {
      try {
        const { data: tokAranzmanaData, error: tokAranzmanaError } =
          await supabase
            .from("tok_aranzmana")
            .select("*")
            .eq("rezervacije_id", bookingId);

        if (tokAranzmanaError) return;

        const { data: dodatnaAktivnostData, error: dodatnaAktivnostError } =
          await supabase
            .from("dodatna_aktivnost")
            .select("*")
            .eq("rezervacije_id", bookingId);

        if (dodatnaAktivnostError) return;

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
          const totalGuests = brojGostiju + djeca;
          setDaysData(
            days.map((_, index) => ({
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
        // silent fail
      }
    }
    fetchSavedData();
  }, [bookingId, days, brojGostiju, djeca]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setShowDetails(params.get("novaRez") !== "true");
  }, [location.search]);

  // --- Handlers ---
  const handleChangeDayInput = (dayIndex, field, value) => {
    setDaysData((prev) => {
      const updated = [...prev];
      updated[dayIndex][field] = parseInt(value, 10) || 0;
      return updated;
    });
  };

  const handleChangeAktivnost = (dayIndex, value) => {
    setDaysData((prev) => {
      const updated = [...prev];
      updated[dayIndex].aktivnosti = [
        {
          aktivnost: value || "Bez dodatne aktivnosti",
          brojGostiju:
            value === "Bez dodatne aktivnosti"
              ? 0
              : updated[dayIndex].aktivnosti?.[0]?.brojGostiju || 0,
        },
      ];
      return updated;
    });
  };

  const handleChangeBrojGostiju = (dayIndex, value) => {
    setDaysData((prev) => {
      const updated = [...prev];
      if (updated[dayIndex].aktivnosti.length > 0) {
        updated[dayIndex].aktivnosti[0].brojGostiju = parseInt(value, 10) || 0;
      }
      return updated;
    });
  };

  // --- Save logic ---
  async function saveTokAranzmana(rezervacijeId) {
    if (!daysData?.length || !rezervacijeId || !validDatumDolaska) {
      toast.error("Podaci nisu validni.");
      return;
    }
    try {
      for (const day of daysData) {
        if (!day.dayNumber) continue;
        const dayDate = addDays(new Date(validDatumDolaska), day.dayNumber - 1);
        const dayName = format(dayDate, "EEEE", {
          locale: getCustomLocale({ fullDayNames: true }),
        });
        const formattedDayNumber = `${day.dayNumber}-${dayName}`;
        const payload = {
          rezervacije_id: rezervacijeId,
          day_number: formattedDayNumber,
          broj_gostiju_dorucak: day.dorucak,
          broj_gostiju_rucak: day.rucak,
          broj_gostiju_vecera: day.vecera,
          broj_gostiju_nocenje: day.nocenje,
        };
        // Upsert tok_aranzmana
        const { data: existingData } = await supabase
          .from("tok_aranzmana")
          .select("id")
          .eq("rezervacije_id", rezervacijeId)
          .eq("day_number", formattedDayNumber)
          .single();
        if (existingData) {
          await supabase
            .from("tok_aranzmana")
            .update(payload)
            .eq("id", existingData.id);
        } else {
          await supabase.from("tok_aranzmana").insert(payload);
        }
        // Upsert dodatna_aktivnost
        const dodatnaAktivnostPayload = {
          rezervacije_id: rezervacijeId,
          day_number: formattedDayNumber,
          aktivnost:
            day.aktivnosti.length > 0
              ? day.aktivnosti[0]
              : { aktivnost: "Bez aktivnosti", brojGostiju: 0 },
        };
        const { data: existingActivity } = await supabase
          .from("dodatna_aktivnost")
          .select("id")
          .eq("rezervacije_id", rezervacijeId)
          .eq("day_number", formattedDayNumber)
          .single();
        if (existingActivity) {
          await supabase
            .from("dodatna_aktivnost")
            .update(dodatnaAktivnostPayload)
            .eq("id", existingActivity.id);
        } else {
          await supabase
            .from("dodatna_aktivnost")
            .insert(dodatnaAktivnostPayload);
        }
      }
      toast.success("Tok aranžmana sačuvan!");
    } catch (err) {
      toast.error("Greška prilikom čuvanja podataka.");
    }
  }

  // --- Render ---
  return (
    <StyledBookingDataBox ref={boxRef}>
      {showDetails && (
        <div id="rezervacija-detalji">
          <Header>
            <div>
              <HiOutlineHomeModern />
              <p>
                {brojNocenja === 1 ? "Jedno noćenje" : brojNocenja + " noćenja"}{" "}
                <span>{imeBungalova}</span>
              </p>
            </div>
            <p>
              {format(new Date(validDatumDolaska), "EEE, dd. MMM yyyy.", {
                locale: getCustomLocale(),
              })}
              &nbsp;&mdash;&nbsp;
              {format(new Date(validDatumOdlaska), "EEE, dd. MMM yyyy.", {
                locale: getCustomLocale(),
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
                    .then(() => toast.success("Kontakt kopiran!"))
                    .catch(() =>
                      toast.error("Greška prilikom kopiranja kontakta.")
                    );
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
              <DataItem icon={<HiOutlineCurrencyEuro />} label="Ukupna cijena">
                <p>{formatCurrency(ukupnoZaNaplatu)}</p>
              </DataItem>
              Avans: {avans}€
            </Cijena>
          </DetaljiRezervacije>
          <Footer>
            <p>
              Rezervacija napravljena u{" "}
              {format(new Date(validCreatedAt), "EEE, dd. MMM", {
                locale: getCustomLocale(),
              })}
              {creator_name && (
                <span>
                  <br />
                  Rezervaciju napravila/izmjenila {creator_name}
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
                    locale: getCustomLocale({ fullDayNames: true }),
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
