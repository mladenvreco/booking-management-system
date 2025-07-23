import styled from "styled-components";

export const Textarea = styled.textarea`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  width: 100%; /* Default to full width of container */

  /* Media query for smaller screens */
  @media (max-width: 768px) {
    max-width: 20rem; /* Limit width on smaller screens */
    width: 100%; /* Ensure it doesn't exceed the container width */
  }
`;
