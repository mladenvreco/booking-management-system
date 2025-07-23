import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import { useCabins } from "../cabins/useCabins";
import CreateBookingForm from "./CreateBookingForm";

function AddBooking() {
  const { isLoading } = useCabins();

  return (
    <div>
      {isLoading ? (
        ""
      ) : (
        <Modal>
          <Modal.Open opens="booking-form">
            <Button>Dodaj rezervaciju</Button>
          </Modal.Open>

          <Modal.Window name="booking-form">
            <CreateBookingForm />
          </Modal.Window>
        </Modal>
      )}
    </div>
  );
}

export default AddBooking;
