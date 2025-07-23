import styled from "styled-components";
import CreateCabinForm from "./CreateCabinForm";
import { useDeleteCabin } from "./useDeleteCabin";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateCabin } from "./useCreateCabin";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

const Bungalov = styled.div`
  font-family: "Sono";
  text-transform: uppercase;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const BrojKreveta = styled.div`
  font-family: "Sono";
  font-weight: 600;
  color: var(--color-grey-600);
`;

const VrstaBungalova = styled.div`
  font-family: "Sono";
  font-weight: 600;
  color: var(--color-grey-600);
`;

function CabinRow({ cabin }) {
  const { isDeleting, deleteCabin } = useDeleteCabin();
  const { isCreating, createCabin } = useCreateCabin();

  function handleKopiraj() {
    createCabin({
      imeBungalova: `${cabin.imeBungalova} - kopija`,
      brojKreveta: cabin.brojKreveta,
      vrstaBungalova: cabin.vrstaBungalova,
    });
  }

  return (
    <Table.Row>
      <Bungalov>{cabin.imeBungalova}</Bungalov>
      <BrojKreveta>{cabin.brojKreveta}</BrojKreveta>
      <VrstaBungalova>{cabin.vrstaBungalova}</VrstaBungalova>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={cabin.id} />
            <Menus.List id={cabin.id}>
              <Menus.Button onClick={handleKopiraj} icon={<HiSquare2Stack />}>
                Napravi&nbsp;duplikat
              </Menus.Button>

              <Modal.Open opens="uredi">
                <Menus.Button icon={<HiPencil />}>Uredi</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="izbrisi">
                <Menus.Button icon={<HiTrash />}>Izbriši</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="uredi">
              <CreateCabinForm cabinToEdit={cabin} />
            </Modal.Window>

            <Modal.Window name="izbrisi">
              <ConfirmDelete
                resource="bungalov"
                disabled={isDeleting}
                handleConfirm={() => deleteCabin(cabin.id)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default CabinRow;
