import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";

const StyledConfirmDelete = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
    width: 100%;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }

  @media (max-width: 768px) {
    .ResponsiveButtonWrapper {
      margin-right: 50%;
      margin-left: 50%;
    }
    p {
      width: 100%;
    }
  }
`;

function ConfirmDelete({ resource, handleConfirm, disabled, onCloseModal }) {
  return (
    <StyledConfirmDelete>
      <Heading type="h3">Izbrisati {resource}?</Heading>
      <p>
        Da li ste sigurni da želite trajno izbrisati {resource}? Brisanje se ne
        može poništiti.
      </p>

      <div className="ResponsiveButtonWrapper">
        <Button
          variation="secondary"
          onClick={onCloseModal}
          disabled={disabled}
        >
          Otkaži
        </Button>
        <Button variation="danger" onClick={handleConfirm} disabled={disabled}>
          Izbriši
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmDelete;
