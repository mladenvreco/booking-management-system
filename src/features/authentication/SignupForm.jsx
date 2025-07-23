import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSignup } from "./useSignup";

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  const { signup, isLoading } = useSignup();
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;

  function onSubmit({ ime, email, password }) {
    signup(
      { ime, email, password },
      {
        onSettled: (data, error) => {
          console.error("Signup error:", error);
          reset();
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Ime" error={errors?.ime?.message}>
        <Input
          type="text"
          id="ime"
          disabled={isLoading}
          {...register("ime", { required: "Obavezno polje" })}
        />
      </FormRow>

      <FormRow label="Email adresa" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isLoading}
          {...register("email", {
            required: "Obavezno polje",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Unesite ispravnu email adresu",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Lozinka (8 karaktera najmanje)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isLoading}
          {...register("password", {
            required: "Obavezno polje",
            minLength: {
              value: 8,
              message: "Lozinka mora da sadrži minimalno 8 karaktera",
            },
          })}
        />
      </FormRow>

      <FormRow label="Ponovi lozinku" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isLoading}
          {...register("passwordConfirm", {
            required: "Obavezno polje",
            validate: (value) =>
              value === getValues().password || "Lozinke se ne podudaraju",
          })}
        />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset" disabled={isLoading}>
          Otkaži
        </Button>
        <Button disabled={isLoading}>Kreiraj korisnika</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
