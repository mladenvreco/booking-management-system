import { format } from "date-fns";
import toast from "react-hot-toast";
import { HiBell } from "react-icons/hi2";
import styled from "styled-components";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import { useCabins } from "../cabins/useCabins";

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const TruncatedContact = styled.div`
  font-size: 1rem;

  @media (max-width: 768px) {
    &::after {
      content: "${(props) =>
        props.contact.length > 5
          ? props.contact.substring(0, 5) + "..."
          : props.contact}";
    }
  }

  @media (min-width: 769px) {
    content: "${(props) => props.contact}";
  }
`;

const FullContact = styled.span`
  font-size: 1rem;

  @media (max-width: 768px) {
    display: none;
  }

  @media (min-width: 769px) {
    display: inline;
  }
`;

const NoteCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;

  @media (max-width: 768px) {
    width: 3rem;
    padding: 0.5rem;
  }

  @media (max-width: 480px) {
    width: 2.5rem;
    padding: 0.3rem;
  }
`;

const BellIcon = styled(HiBell).withConfig({
  shouldForwardProp: (prop) => prop !== "hasNote",
})`
  color: ${(props) => (props.hasNote ? "#ed8936" : "var(--color-grey-400)")};
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.3s;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

function DashboardBookingRow({ booking }) {
  const datumDolaska = new Date(booking.datumDolaska);
  const datumOdlaska = new Date(booking.datumOdlaska);
  const { isLoading } = useCabins();

  // State for isVikend

  // Fetch isVikend from the database

  if (isLoading) return <Spinner />;

  // Calculate the number of nights
  const brojNocenja = (datumOdlaska - datumDolaska) / (1000 * 60 * 60 * 24); // Difference in days

  return (
    <Table.Row role="row">
      <NoteCell>
        {booking.napomena && (
          <Modal>
            <Modal.Open opens="note">
              <BellIcon hasNote={!!booking.napomena} />
            </Modal.Open>
            <Modal.Window name="note">
              <div style={{ padding: "2rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>Napomena</h3>
                <p style={{ fontSize: "1.4rem", lineHeight: "1.5" }}>
                  {booking.napomena}
                </p>
              </div>
            </Modal.Window>
          </Modal>
        )}
      </NoteCell>

      <div>{booking.imeRezervacije || "N/A"}</div>
      <div style={{ fontSize: "1.2rem" }}>
        <Button
          variation="secondary"
          size="small"
          style={{ color: "#4338ca" }}
          onMouseDown={() => {
            navigator.clipboard
              .writeText(booking.kontakt)
              .then(() => {
                toast.success("Kontakt kopiran!");
              })
              .catch((err) => {
                toast.error("Greška prilikom kopiranja kontakta.");
              });
          }}
        >
          <FullContact>{booking.kontakt}</FullContact>
          <TruncatedContact contact={booking.kontakt} />
        </Button>
        <br />
        {booking.odakleRezervacija}
      </div>
      <Stacked>
        <span>{`${brojNocenja} noćenja`}</span>
        <span>
          {`${format(datumDolaska, "dd MMM yyyy")} — ${format(
            datumOdlaska,
            "dd MMM yyyy"
          )}`}
        </span>
      </Stacked>
      <div>{booking.brojGostiju || "N/A"}</div>
    </Table.Row>
  );
}

export default DashboardBookingRow;
