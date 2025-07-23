import { useUser } from "./useUser";
import { useState } from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useUpdateUser } from "./useUpdateUser";

function UpdateUserDataForm() {
  // We don't need the loading state
  const {
    user: {
      email,
      user_metadata: { ime: trenutnoIme },
    },
  } = useUser();

  const [fullName, setFullName] = useState(trenutnoIme);

  const { updateUser, isUpdating } = useUpdateUser();

  function handleSubmit(e) {
    e.preventDefault();
    if (!fullName) return;

    updateUser(
      { ime: fullName },
      {
        onSuccess: () => {
          // Resetting form using .reset() that's available on all HTML form elements, otherwise the old filename will stay displayed in the UI
          e.target.reset();
        },
      }
    );
  }

  function handleCancel(e) {
    // We don't even need preventDefault because this button was designed to reset the form (remember, it has the HTML attribute 'reset')
    setFullName(trenutnoIme);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email adresa">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Ime">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isUpdating}
          id="fullName"
        />
      </FormRow>

      <FormRow>
        <Button onClick={handleCancel} type="reset" variation="secondary">
          Otkaži
        </Button>
        <Button disabled={isUpdating}>Ažuriraj ime</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
