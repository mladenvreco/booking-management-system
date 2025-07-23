import styled from "styled-components";

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  justify-content: flex-end;
  @media (max-width: 768px) {
    display: flex;
    gap: 1.2rem; /* Add spacing between buttons */
    justify-content: flex-start; /* Align buttons to the left */
    margin-top: 2rem;
  }
`;

export default ButtonGroup;
