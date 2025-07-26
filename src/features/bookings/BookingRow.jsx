import { HiBell, HiEye, HiPencil, HiTrash } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import ConfirmDelete from "../../ui/ConfirmDelete";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import Table from "../../ui/Table";

import { format } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";
import supabase from "../../services/supabase";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import { getCustomLocale } from "../../utils/customLocale";
import { formatCurrency } from "../../utils/helpers";
import { useCabins } from "../cabins/useCabins";
import CreateBookingForm from "./CreateBookingForm";
import { useDeleteBooking } from "./useDeleteBooking";

const Cabin = styled.div`
  text-transform: uppercase;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

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

  @media (max-width: 768px) {
    & span:last-child {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    & span:first-child {
      font-size: 1.1rem;
    }
    & span:last-child {
      font-size: 0.9rem;
    }
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);

  @media (max-width: 768px) {
    display: none; /* Hide the avans column on small screens */
  }
`;

const ActionsCell = styled.div`
  /* Keep this visible on all screens */
  display: flex;
  justify-content: flex-end;
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

const GuestsInfo = styled.span`
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const ContactWrapper = styled.div`
  font-size: 1.2rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

function prvoSlovoVeliko(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function BookingRow({ booking, showActions = true }) {
  const { deleteBooking, isDeleting } = useDeleteBooking();
  const navigate = useNavigate();
  const { cabins, isLoading } = useCabins();
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [isLoadingBungalows, setIsLoadingBungalows] = useState(false);

  // Fetch isVikend from the database

  const handleEditClick = async () => {
    setIsLoadingBungalows(true);
    setIsLoadingBungalows(false);
    setIsModalOpen(true);
  };

  if (isLoading) return <Spinner />;

  return (
    <>
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

        <Stacked>
          <span>{prvoSlovoVeliko(booking.imeRezervacije)}</span>
          <span>{}</span>
        </Stacked>

        <ContactWrapper>
          <Button
            variation="secondary"
            size="small"
            style={{ color: "#4338ca", fontSize: "1rem", padding: "0.2rem" }}
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
        </ContactWrapper>

        <Stacked>
          <span>
            {booking.brojNocenja}
            {booking.brojNocenja === 1 ? " noćenje" : " noćenja"}
          </span>
          <span>
            {format(new Date(booking.datumDolaska), "dd MMM yyyy", {
              locale: getCustomLocale(),
            })}{" "}
            &mdash;{" "}
            {format(new Date(booking.datumOdlaska), "dd MMM yyyy", {
              locale: getCustomLocale(),
            })}
          </span>
        </Stacked>

        <div className="bungalovi-column">
          <Cabin>
            {booking.bungalovi.map((bungalov) => {
              const cabin = cabins.find((cabin) => cabin.id === bungalov.id);
              const imeBungalova =
                booking.brojNocenja === 0 ? "" : cabin?.imeBungalova;
              return <span key={bungalov.id}>{imeBungalova} </span>;
            })}
          </Cabin>
        </div>

        <GuestsInfo>{booking.brojGostiju + booking.djeca}</GuestsInfo>

        {/* This will be hidden on smaller screens */}
        <Amount className="avans-column">
          {formatCurrency(booking.avans)}
        </Amount>

        {/* This will always be visible, even on smaller screens */}
        <ActionsCell>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={booking.id} />
              <Menus.List id={booking.id}>
                <Menus.Button
                  icon={<HiEye />}
                  onClick={() => navigate(`/rezervacije/${booking.id}`)}
                >
                  Vidi&nbsp;detalje
                </Menus.Button>
                {showActions && (
                  <>
                    <Modal.Open opens="edit">
                      <Menus.Button
                        icon={<HiPencil />}
                        onClick={async () => {
                          await handleEditClick(); // Fetch bungalows and set state
                        }}
                      >
                        Uredi
                      </Menus.Button>
                    </Modal.Open>

                    <Modal.Open opens="delete">
                      <Menus.Button icon={<HiTrash />}>Izbriši</Menus.Button>
                    </Modal.Open>
                  </>
                )}
              </Menus.List>
            </Menus.Menu>

            {/* Edit Modal */}
            <Modal.Window name="edit">
              {isLoadingBungalows ? (
                <Spinner />
              ) : (
                <CreateBookingForm
                  bookingToEdit={booking}
                  onCloseModal={() => setIsModalOpen(false)}
                />
              )}
            </Modal.Window>

            {/* Delete Modal */}
            <Modal.Window name="delete">
              <ConfirmDelete
                resource="rezervaciju"
                disabled={isDeleting}
                handleConfirm={async () => {
                  try {
                    // Step 1: Delete the reservation
                    await deleteBooking(booking.id);

                    // Step 2: Update the zauzetnadatume for each associated cabin
                    for (const bungalov of booking.bungalovi) {
                      if (!bungalov.id) {
                        continue; // Skip this iteration if bungalov.id is undefined
                      }

                      // Fetch the current zauzetnadatume for the cabin
                      const { data: cabin, error: fetchError } = await supabase
                        .from("bungalovi")
                        .select("zauzetnadatume")
                        .eq("id", bungalov.id)
                        .single();

                      if (fetchError) throw fetchError;

                      // Convert booking dates to a set for quick lookup
                      const bookingDatesSet = new Set();
                      let currentDate = new Date(
                        booking.datumDolaska.split("T")[0]
                      );
                      const endDate = new Date(
                        booking.datumOdlaska.split("T")[0]
                      );

                      while (currentDate <= endDate) {
                        bookingDatesSet.add(
                          currentDate.toISOString().split("T")[0]
                        );
                        currentDate.setDate(currentDate.getDate() + 1);
                      }

                      // Filter out the dates associated with this booking
                      const updatedDates = (cabin.zauzetnadatume || []).filter(
                        (date) => {
                          // Check if the date is not in the booking's date set
                          return !bookingDatesSet.has(date);
                        }
                      );

                      // Update the zauzetnadatume field in the database
                      const { error: updateError } = await supabase
                        .from("bungalovi")
                        .update({ zauzetnadatume: updatedDates })
                        .eq("id", bungalov.id);

                      if (updateError) throw updateError;
                    }
                  } catch (error) {}
                }}
              />
            </Modal.Window>
          </Modal>
        </ActionsCell>
      </Table.Row>
    </>
  );
}

export default BookingRow;
