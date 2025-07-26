import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: start;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
  @media (max-width: 768px) {
    grid-template-columns: 100%;
    padding: 2rem;
  }
`;

function Login() {
  return (
    <LoginLayout>
      <br />
      <br />
      <Logo />
      <Heading as="h4">Uloguj se</Heading>
      <LoginForm />
    </LoginLayout>
  );
}

export default Login;
