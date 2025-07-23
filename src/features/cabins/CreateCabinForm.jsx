import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";

import { useForm } from "react-hook-form";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;
  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();

  const isWorking = isCreating || isEditing;

  const onSubmit = (data) => {
    if (isEditSession)
      editCabin(
        { newCabinData: data, id: editId },
        {
          onSuccess: (data) => {
            reset({
              imeBungalova: "",
              brojKreveta: "",
              vrstaBungalova: "Normal",
            });
            onCloseModal?.();
          },
        }
      );
    else
      createCabin(data, {
        onSuccess: (data) => {
          reset({
            imeBungalova: "",
            brojKreveta: "",
            vrstaBungalova: "Normal",
          });
          onCloseModal?.();
        },
      });
  };

  const onError = (errors) => {};

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Naziv bungalova" error={errors?.imeBungalova?.message}>
        <Input
          type="text"
          id="imeBungalova"
          disabled={isWorking}
          {...register("imeBungalova", {
            required: "Obavezno polje",
          })}
        />
      </FormRow>

      <FormRow label="Broj kreveta" error={errors?.brojKreveta?.message}>
        <Input
          type="number"
          id="brojKreveta"
          disabled={isWorking}
          {...register("brojKreveta", {
            required: "Obavezno polje",
            min: {
              value: 1,
              message: "Minimalan broj kreveta je 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Vrsta bungalova" error={errors?.vrstaBungalova?.message}>
        <select
          name="vrstaBungalova"
          id="vrstaBungalova"
          defaultValue={"Standard"}
          disabled={isWorking}
          {...register("vrstaBungalova")}
        >
          <option value={"Standard"}>Standard</option>
          <option value={"Lux"}>Lux</option>
          <option value={"Exclusive"}>Exclusive</option>
        </select>
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Otkaži
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Uredi bungalov" : "Dodaj novi bungalov"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
