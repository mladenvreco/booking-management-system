import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";
import { HiPencil } from "react-icons/hi2";

import Spinner from "../../ui/Spinner";
import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import Empty from "../../ui/Empty";

import { useBooking } from "./useBooking";
import Modal from "../../ui/Modal";
import CreateBookingForm from "./CreateBookingForm";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking, isLoading } = useBooking();
  const navigate = useNavigate();
  const [isLoadingBungalows, setIsLoadingBungalows] = useState(false);

  const handleEditClick = async () => {
    setIsLoadingBungalows(true);
    // Any preparation needed before opening the edit modal
    setIsLoadingBungalows(false);
  };

  if (isLoading) return <Spinner />;
  if (!booking) return <Empty resourceName="rezervacije" />;

  const { id: bookingId } = booking;

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading type="h1">Detalji rezervacije</Heading>
        </HeadingGroup>
      </Row>

      <BookingDataBox booking={booking} bookingId={bookingId}>
        <ButtonGroup>
          <Button
            variation="secondary"
            onClick={() => navigate("/rezervacije")}
          >
            Nazad
          </Button>

          <Modal>
            <Modal.Open opens="edit">
              <Button
                variation="primary"
                onClick={handleEditClick}
                icon={<HiPencil />}
              >
                Uredi
              </Button>
            </Modal.Open>

            <Modal.Window name="edit">
              {isLoadingBungalows ? (
                <Spinner />
              ) : (
                <CreateBookingForm
                  bookingToEdit={booking}
                  onCloseModal={() => {}}
                />
              )}
            </Modal.Window>
          </Modal>
        </ButtonGroup>
      </BookingDataBox>
    </>
  );
}

export default BookingDetail;
