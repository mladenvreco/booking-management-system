import styled from "styled-components";

const Input = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  /* width: 100%; Default to full width */

  /* Media query for smaller screens */
  @media (max-width: 768px) {
    max-width: 20rem; /* Set a maximum width for smaller screens */
    width: 100%; /* Ensure it doesn't exceed the container width */
  }
`;

export default Input;
