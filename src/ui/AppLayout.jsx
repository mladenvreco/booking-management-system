import { Outlet } from "react-router-dom";
import Header from "./Header";
import styled from "styled-components";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  overflow: scroll;

  @media (max-width: 768px) {
    padding: 1rem 1.2rem 2rem; //Ensure no padding on smaller screens
  }
`;

const Container = styled.div`
  max-width: 160rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;

  @media (max-width: 768px) {
    max-width: 60rem; /* Limit the width for tablets */
    margin: 0 1rem; /* Add horizontal margin for smaller screens */
    font-size: 1.2rem; /* Adjust font size for tablets */
  }

  @media (max-width: 480px) {
    max-width: 40rem; /* Further limit the width for mobile devices */
    margin: 0 0.5rem; /* Add smaller horizontal margin for mobile */
    font-size: 1rem; /* Adjust font size for mobile devices */
  }
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}

export default AppLayout;
