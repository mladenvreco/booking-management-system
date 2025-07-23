import UpdateUserDataForm from "../features/authentication/UpdateUserDataForm";
import UpdatePasswordForm from "../features/authentication/UpdatePasswordForm";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Account() {
  return (
    <>
      <Heading as="h1">Ažuriranje naloga</Heading>

      <Row>
        <Heading as="h3"></Heading>
        <UpdateUserDataForm />
      </Row>

      <Row>
        <Heading as="h3"></Heading>
        <UpdatePasswordForm />
      </Row>
    </>
  );
}

export default Account;
