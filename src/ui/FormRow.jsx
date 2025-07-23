import styled from "styled-components";

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    gap: 1.2rem;
  }

  /* Media query for smaller screens */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;

    label {
      margin-bottom: 0.5rem; /* Add spacing between label and input */
    }

    input,
    select,
    textarea {
      width: 100%; //Make input fields take full width
    }

    input[type="checkbox"] {
      width: auto; /* Ensure checkbox doesn't take full width */
      margin-right: 0.5rem; /* Add space between checkbox and label */
    }
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem; /* Add spacing between input and error message */
  @media (max-width: 768px) {
    flex-direction: column; /* Stack input and error vertically */
    align-items: flex-start; /* Align items to the left */
    gap: 0.5rem; /* Reduce gap for smaller screens */

    /* Ensure checkbox and label are side by side */
    input[type="checkbox"] + label {
      flex-direction: row;
      align-items: center;
    }
  }
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
  white-space: nowrap; /* Prevent the error message from wrapping */
  @media (max-width: 768px) {
    white-space: normal; /* Allow wrapping on smaller screens */
  }
`;

function FormRow({ label, error, children }) {
  return (
    <StyledFormRow>
      {label && <Label>{label}</Label>}
      <InputWrapper>
        {children}
        {error && <Error>{error}</Error>}
      </InputWrapper>
    </StyledFormRow>
  );
}

export default FormRow;
