import { useForm } from "react-hook-form";
import { format, addDays, eachDayOfInterval } from "date-fns";
import { toast } from "react-hot-toast";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { Textarea } from "../../ui/Textarea";
import Button from "../../ui/Button";
import { useCabins } from "../cabins/useCabins";
import { useMemo, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateBooking } from "./useCreateBooking";
import { useNavigate } from "react-router-dom";
import { createEditBooking } from "../../services/apiBookings";
import styled from "styled-components";
import supabase from "../../services/supabase";
import { StyledDatePickerInput } from "../../ui/Date";

const SelectWrapper = styled.div`
  width: 100%;

  @media (max-width: 768px) {
    max-width: 30rem;
  }
`;

function CreateBookingForm({ onCloseModal, bookingToEdit = {} }) {
  const { id: editId, ...editValues } = bookingToEdit;
  const isEditSession = Boolean(editId);

  const removeOldDatesFromCabins = async (bookingToEdit) => {
    if (!bookingToEdit.bungalovi || bookingToEdit.bungalovi.length === 0)
      return;

    // Generiši stare datume na osnovu originalnih podataka iz rezervacije
    const originalStartDate = new Date(bookingToEdit.datumDolaska);
    const originalEndDate = new Date(bookingToEdit.datumOdlaska);
    const originalDates = eachDayOfInterval({
      start: originalStartDate,
      end: addDays(originalEndDate, -1),
    }).map((date) => format(date, "yyyy-MM-dd"));

    // Ukloni stare datume iz svih bungalova koji su bili u rezervaciji
    for (const bungalov of bookingToEdit.bungalovi) {
      try {
        // Dohvati trenutne zauzete datume za bungalov
        const { data: cabinData, error: fetchError } = await supabase
          .from("bungalovi")
          .select("zauzetnadatume")
          .eq("id", bungalov.id)
          .single();

        if (fetchError) {
          console.error(
            `Greška dohvaćanja podataka za bungalov ${bungalov.id}:`,
            fetchError
          );
          continue;
        }

        // Ukloni stare datume rezervacije
        const updatedDates = (cabinData.zauzetnadatume || []).filter(
          (date) => !originalDates.includes(date)
        );

        // Ažuriraj bazu podataka
        const { error: updateError } = await supabase
          .from("bungalovi")
          .update({ zauzetnadatume: updatedDates })
          .eq("id", bungalov.id);

        if (updateError) {
          console.error(
            `Greška ažuriranja datuma za bungalov ${bungalov.id}:`,
            updateError
          );
        }
      } catch (error) {
        console.error(`Neočekivana greška za bungalov ${bungalov.id}:`, error);
      }
    }
  };

  const { register, handleSubmit, reset, formState, watch, setValue } = useForm(
    {
      defaultValues: {
        imeRezervacije: editValues.imeRezervacije || "",
        brojGostiju: editValues.brojGostiju || 0,
        djeca: editValues.djeca || 0,
        brojVegana: editValues.brojVegana || 0,
        odakleRezervacija: editValues.odakleRezervacija || "Email",
        kontakt: editValues.kontakt || "",
        brojNocenja: editValues.brojNocenja || 0,
        aranzman: editValues.aranzman || "bez aranzmana",
        popust: editValues.popust || 0,
        ukupnoZaNaplatu: editValues.ukupnoZaNaplatu || 0,
        avans: editValues.avans || 0,
        napomena: editValues.napomena || "",
        isVikend: editValues.isVikend || false,
        isApartman: editValues.isApartman || false,
        dorucak: editValues.isDorucak || false,
        rucak: editValues.isRucak || false,
        isVelenici: editValues.isVelenici || false,
        isJahanje: editValues.isJahanje || false,
        isFerataZipline: editValues.isFerataZipline || false,
        isSutjeska: editValues.isSutjeska || false,
        isTrnovacko: editValues.isTrnovacko || false,
        isKanjoning: editValues.isKanjoning || false,
        isSator: editValues.isSator || false,
        isKampKucica: editValues.isKampKucica || false,
      },
    }
  );

  const additionalBungalowsWatch = watch("additionalBungalows") || [];
  const mainBungalowWatch = watch("idBungalova");
  const brojGostiju = watch("brojGostiju");
  const aranzman = watch("aranzman");
  const avans = watch("avans");
  const djeca = watch("djeca");
  const popust = watch("popust");
  const brojGostijuVelenici = watch("brojGostijuVelenici");
  const brojDjeceVelenici = watch("brojDjeceVelenici");
  const brojGostijuSutjeska = watch("brojGostijuSutjeska");
  const brojDjeceSutjeska = watch("brojDjeceSutjeska");
  const brojGostijuTrnovacko = watch("brojGostijuTrnovacko");
  const brojDjeceTrnovacko = watch("brojDjeceTrnovacko");
  const brojGostijuKanjoning = watch("brojGostijuKanjoning");
  const brojDjeceKanjoning = watch("brojDjeceKanjoning");
  const odakleRezervacija = watch("odakleRezervacija");

  const { createBooking, isCreating } = useCreateBooking();
  const { errors } = formState;
  const brojNocenja = watch("brojNocenja");
  const { cabins = [] } = useCabins();
  const navigate = useNavigate();

  const [additionalBungalows, setAdditionalBungalows] = useState([]);

  const [isVikend, setIsVikend] = useState(editValues.isVikend || false);
  const [isApartman, setIsApartman] = useState(editValues.isApartman || false);
  const [isDorucak, setIsDorucak] = useState(editValues.isDorucak || false);
  const [isRucak, setIsRucak] = useState(editValues.isRucak || false);
  const [isVelenici, setIsVelenici] = useState(editValues.isVelenici || false);
  const [isJahanje, setIsJahanje] = useState(editValues.isJahanje || false);
  const [isFerataZipline, setIsFerataZipline] = useState(
    editValues.isFerataZipline || false
  );
  const [isSutjeska, setIsSutjeska] = useState(editValues.isSutjeska || false);
  const [isTrnovacko, setIsTrnovacko] = useState(
    editValues.isTrnovacko || false
  );
  const [isKanjoning, setIsKanjoning] = useState(
    editValues.isKanjoning || false
  );
  const [isSator, setIsSator] = useState(editValues.isSator || false);
  const [isKampKucica, setIsKampKucica] = useState(
    editValues.isKampKucica || false
  );

  const [startDate, setStartDate] = useState(
    isEditSession && bookingToEdit.datumDolaska
      ? new Date(bookingToEdit.datumDolaska)
      : new Date()
  );

  useEffect(() => {
    if (isEditSession) {
      // Fetch additional booking info from the database
      const fetchAdditionalInfo = async () => {
        const { data, error } = await supabase
          .from("additional_booking_info")
          .select(
            `
            id,
            isVikend, isApartman, isDorucak, isRucak,
            isVelenici, brojGostijuVelenici, brojDjeceVelenici, 
            isJahanje, isFerataZipline,
            isSutjeska, brojGostijuSutjeska, brojDjeceSutjeska,
            isTrnovacko, brojGostijuTrnovacko, brojDjeceTrnovacko,
            isKanjoning, brojGostijuKanjoning, brojDjeceKanjoning,
            isSator,
            isKampKucica
          `
          )
          .eq("booking_id", editId)
          .order("id", { ascending: false }) // Order by id (most recent first)
          .limit(1) // Limit to 1 row
          .single();

        if (error) {
          return;
        }

        // Set both form values and local state
        setIsVikend(data.isVikend || false);
        setIsApartman(data.isApartman || false);
        setIsDorucak(data.isDorucak || false);
        setIsRucak(data.isRucak || false);
        setIsVelenici(data.isVelenici || false);
        setIsJahanje(data.isJahanje || false);
        setIsFerataZipline(data.isFerataZipline || false);
        setIsSutjeska(data.isSutjeska || false);
        setIsTrnovacko(data.isTrnovacko || false);
        setIsKanjoning(data.isKanjoning || false);
        setIsSator(data.isSator || false);
        setIsKampKucica(data.isKampKucica || false);

        setValue("isVikend", data.isVikend || false);
        setValue("isApartman", data.isApartman || false);
        setValue("dorucak", data.isDorucak || false);
        setValue("rucak", data.isRucak || false);
        setValue("isVelenici", data.isVelenici || false);
        setValue("isJahanje", data.isJahanje || false);
        setValue("isFerataZipline", data.isFerataZipline || false);
        setValue("isSutjeska", data.isSutjeska || false);
        setValue("isTrnovacko", data.isTrnovacko || false);
        setValue("isKanjoning", data.isKanjoning || false);
        setValue("isSator", data.isSator || false);
        setValue("isKampKucica", data.isKampKucica || false);

        // Set form values for the numeric fields
        if (data.brojGostijuVelenici)
          setValue("brojGostijuVelenici", data.brojGostijuVelenici);
        if (data.brojDjeceVelenici)
          setValue("brojDjeceVelenici", data.brojDjeceVelenici);
        if (data.brojGostijuSutjeska)
          setValue("brojGostijuSutjeska", data.brojGostijuSutjeska);
        if (data.brojDjeceSutjeska)
          setValue("brojDjeceSutjeska", data.brojDjeceSutjeska);
        if (data.brojGostijuTrnovacko)
          setValue("brojGostijuTrnovacko", data.brojGostijuTrnovacko);
        if (data.brojDjeceTrnovacko)
          setValue("brojDjeceTrnovacko", data.brojDjeceTrnovacko);
        if (data.brojGostijuKanjoning)
          setValue("brojGostijuKanjoning", data.brojGostijuKanjoning);
        if (data.brojDjeceKanjoning)
          setValue("brojDjeceKanjoning", data.brojDjeceKanjoning);
      };

      fetchAdditionalInfo();
    }
  }, [isEditSession, editId, setValue]);

  const generateDatesBetween = (startDate, endDate) => {
    const adjustedEndDate = addDays(endDate, -1);

    return eachDayOfInterval({ start: startDate, end: adjustedEndDate }).map(
      (date) => format(date, "yyyy-MM-dd")
    );
  };

  const datumOdlaskaBrojNocenja = addDays(startDate, Number(brojNocenja));

  const filteredCabins = useMemo(() => {
    return cabins.filter((cabin) => {
      const datesBetween = generateDatesBetween(
        startDate,
        datumOdlaskaBrojNocenja
      );
      return (
        !datesBetween.some((date) => cabin.zauzetnadatume?.includes(date)) ||
        bookingToEdit.bungalovi?.some((bungalov) => bungalov.id === cabin.id)
      );
    });
  }, [cabins, startDate, datumOdlaskaBrojNocenja, bookingToEdit.bungalovi]);

  useEffect(() => {
    if (
      isEditSession &&
      bookingToEdit.bungalovi &&
      bookingToEdit.bungalovi.length > 0
    ) {
      setValue("idBungalova", bookingToEdit.bungalovi[0].id);
      setValue(
        "additionalBungalows",
        bookingToEdit.bungalovi.slice(1).map((bungalov) => bungalov.id)
      );
      setAdditionalBungalows(bookingToEdit.bungalovi.slice(1));
    }
  }, [isEditSession, bookingToEdit, setValue, setAdditionalBungalows]);

  const queryClient = useQueryClient();

  const { mutate: editBooking, isLoading: isEditing } = useMutation({
    mutationFn: ({ newBookingData, additionalBookingInfo, id }) =>
      createEditBooking(newBookingData, additionalBookingInfo, id),
    onSuccess: () => {
      toast.success("Uspješno ste uredili rezervaciju!");
      queryClient.invalidateQueries(["bookings"]);
      onCloseModal?.();
    },
  });

  const isWorking = isCreating || isEditing;

  const onSubmit = async (data) => {
    const isDnevniRafting = data.aranzman === "Dnevni rafting";

    // NOVO: Ukloni stare datume ako editiraš rezervaciju
    if (isEditSession) {
      await removeOldDatesFromCabins(bookingToEdit);
    }

    // ... ostatak koda ostaje isti
    const allBungalows = isDnevniRafting
      ? []
      : [
          data.idBungalova || null,
          ...additionalBungalowsWatch.filter((id) => id !== null && id !== ""),
        ];

    const dates = generateDatesBetween(startDate, datumOdlaskaBrojNocenja);

    const bookingData = {
      imeRezervacije: data.imeRezervacije,
      brojGostiju: data.brojGostiju,
      djeca: data.djeca,
      brojNocenja: data.brojNocenja,
      datumDolaska: format(startDate, "yyyy-MM-dd"),
      datumOdlaska: format(datumOdlaskaBrojNocenja, "yyyy-MM-dd"),
      ukupnoZaNaplatu: data.ukupnoZaNaplatu,
      avans: data.avans,
      aranzman: data.aranzman,
      brojVegana: data.brojVegana,
      napomena: data.napomena,
      odakleRezervacija: data.odakleRezervacija,
      kontakt: data.kontakt,
      bungalows: allBungalows,
      dates,
    };

    // Prepare additional booking info
    const additionalBookingInfo = {
      isVikend,
      isApartman,
      isDorucak,
      isRucak,
      isVelenici,
      isJahanje,
      isFerataZipline,
      isSutjeska,
      isTrnovacko,
      isKanjoning,
      isSator,
      isKampKucica,
      brojGostijuVelenici: data.brojGostijuVelenici,
      brojDjeceVelenici: data.brojDjeceVelenici,
      brojGostijuSutjeska: data.brojGostijuSutjeska,
      brojDjeceSutjeska: data.brojDjeceSutjeska,
      brojGostijuTrnovacko: data.brojGostijuTrnovacko,
      brojDjeceTrnovacko: data.brojDjeceTrnovacko,
      brojGostijuKanjoning: data.brojGostijuKanjoning,
      brojDjeceKanjoning: data.brojDjeceKanjoning,
    };

    if (isEditSession) {
      editBooking({
        newBookingData: bookingData,
        additionalBookingInfo,
        id: editId,
      });
    } else {
      createBooking(
        { bookingData, additionalBookingInfo },
        {
          onSuccess: (response) => {
            reset();
            onCloseModal?.();
            navigate(`/rezervacije/${response.id}?novaRez=true`);
          },
        }
      );
    }
  };

  const onError = (errors) => {};

  const selectedBungalows = useMemo(() => {
    return [mainBungalowWatch, ...additionalBungalowsWatch].filter(Boolean);
  }, [mainBungalowWatch, additionalBungalowsWatch]);

  const duplicateBungalows = useMemo(() => {
    const counts = selectedBungalows.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).filter((id) => counts[id] > 1);
  }, [selectedBungalows]);

  const [ukupnoKreveta, setUkupnoKreveta] = useState(0);

  useEffect(() => {
    const selectedBungalows = [
      mainBungalowWatch,
      ...additionalBungalowsWatch,
    ].filter(Boolean);

    const totalBeds = selectedBungalows.reduce((total, bungalowId) => {
      const selectedCabin = cabins.find(
        (cabin) => String(cabin.id) === String(bungalowId)
      );
      return total + (selectedCabin?.brojKreveta || 0);
    }, 0);

    setUkupnoKreveta(totalBeds);
  }, [mainBungalowWatch, additionalBungalowsWatch, cabins]);

  const isDuplicate = (id) => duplicateBungalows.includes(id);

  const handleNoviBungalov = () => {
    setValue("additionalBungalows", [...additionalBungalowsWatch, ""]);
  };

  const handleUkloniPosljednjiBungalov = async () => {
    const currentBungalows = additionalBungalowsWatch;
    if (currentBungalows.length === 0) return;

    // Get the ID of the last bungalow to be removed
    const removedBungalowId = currentBungalows[currentBungalows.length - 1];

    // Remove the last bungalow from the UI
    setValue("additionalBungalows", currentBungalows.slice(0, -1));

    // Remove dates from "zauzetnadatume" for this cabin in the database
    // Only do this if you are editing an existing booking
    if (removedBungalowId && isEditSession) {
      // Calculate the dates for this booking
      const datesToRemove = generateDatesBetween(
        startDate,
        datumOdlaskaBrojNocenja
      );

      // Fetch the current cabin's data
      const { data: cabinData, error: fetchError } = await supabase
        .from("bungalovi")
        .select("zauzetnadatume")
        .eq("id", removedBungalowId)
        .single();

      if (fetchError) {
        toast.error("Greška prilikom dohvaćanja bungalova.");
        return;
      }

      // Remove the dates for this booking from the cabin's zauzetnadatume
      const updatedDates = (cabinData.zauzetnadatume || []).filter(
        (date) => !datesToRemove.includes(date)
      );

      // Update the cabin in the database
      const { error: updateError } = await supabase
        .from("bungalovi")
        .update({ zauzetnadatume: updatedDates })
        .eq("id", removedBungalowId);

      if (updateError) {
        toast.error("Greška prilikom ažuriranja zauzetih datuma.");
      } else {
        toast.success("Bungalov i njegovi datumi su uklonjeni.");
      }
    }
  };

  const isDnevniRafting = aranzman === "Dnevni rafting";

  useEffect(() => {
    const aranzmanMapping = {
      "Aranžman 1": 100,
      "Aranžman 2": 120,
      "Aranžman 3": 130,
      "Aranžman 4": 150,
    };

    const aranzmanValue = aranzmanMapping[aranzman] || 0;
    let adultAmount = (brojGostiju || 0) * aranzmanValue;
    let childrenAmount = (djeca || 0) * aranzmanValue * 0.5;

    let totalAmount = adultAmount + childrenAmount;

    if (isDnevniRafting) {
      if (isRucak && isDorucak) {
        totalAmount += (brojGostiju || 0) * 20 + ((djeca || 0) * 20) / 2;
      } else if (isRucak) {
        totalAmount += (brojGostiju || 0) * 15 + ((djeca || 0) * 15) / 2;
      }
    }

    if (isVelenici) {
      totalAmount += 30 * brojGostijuVelenici + 15 * brojDjeceVelenici;

      if (isJahanje) {
        totalAmount += 25 * brojGostijuVelenici + 12.5 * brojDjeceVelenici;
      }
      if (isFerataZipline) {
        totalAmount += 35 * brojGostijuVelenici + 17.5 * brojDjeceVelenici;
      }
    }

    if (isSutjeska) {
      totalAmount += 60 * brojGostijuSutjeska + 30 * brojDjeceSutjeska;
    }

    if (isTrnovacko) {
      totalAmount += 80 * brojGostijuTrnovacko + 40 * brojDjeceTrnovacko;
    }

    if (isKanjoning) {
      totalAmount += 100 * brojGostijuKanjoning + 50 * brojDjeceKanjoning;
    }

    // Add price for Šator
    if (isSator) {
      totalAmount += 10;
    }

    // Add price for Kamp kućica
    if (isKampKucica) {
      totalAmount += 20;
    }

    const cijenaPoslePopusta =
      totalAmount - (popust * brojGostiju || 0) - (popust * djeca || 0);

    // Subtract the avans value from the total amount
    const finalAmount = cijenaPoslePopusta - (avans || 0);

    setValue("ukupnoZaNaplatu", finalAmount);
  }, [
    brojGostiju,
    aranzman,
    djeca,
    setValue,
    popust,
    isDnevniRafting,
    isRucak,
    isDorucak,
    isVelenici,
    brojGostijuVelenici,
    brojDjeceVelenici,
    isJahanje,
    isFerataZipline,
    isSutjeska,
    brojGostijuSutjeska,
    brojDjeceSutjeska,
    isTrnovacko,
    brojGostijuTrnovacko,
    brojDjeceTrnovacko,
    isKanjoning,
    brojGostijuKanjoning,
    brojDjeceKanjoning,
    isSator,
    isKampKucica,
    avans,
  ]);

  useEffect(() => {
    if (isDnevniRafting) {
      setValue("idBungalova", "");
      setValue("additionalBungalows", []);
    }
  }, [isDnevniRafting, setValue]);

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow
        label="Ime na koje se vodi rezervacija"
        error={errors?.imeRezervacije?.message}
      >
        <Input
          type="text"
          id="imeRezervacije"
          disabled={isWorking}
          placeholder="Ime i prezime"
          {...register("imeRezervacije", {
            required: "Obavezno polje",
          })}
        />
      </FormRow>
      <FormRow
        label="Broj gostiju(odrasli)"
        error={errors?.brojGostiju?.message}
      >
        <Input
          type="number"
          id="brojGostiju"
          disabled={isWorking}
          placeholder="Broj gostiju"
          {...register("brojGostiju", {
            required: "Obavezno polje",
            min: {
              value: 1,
              message: "Broj gostiju ne može biti manji od 1",
            },
          })}
        />
      </FormRow>
      <FormRow label="Djeca" error={errors?.djeca?.message}>
        <Input
          type="number"
          id="djeca"
          disabled={isWorking}
          defaultValue={0}
          {...register("djeca", {
            required: "Obavezno polje",
          })}
        />
      </FormRow>
      {odakleRezervacija !== "Booking" && (
        <FormRow label="Broj vegana" error={errors?.brojVegana?.message}>
          <Input
            type="number"
            id="brojVegana"
            placeholder="Broj vegana"
            disabled={isWorking}
            {...register("brojVegana", {
              required: "Obavezno polje",
              min: {
                value: 0,
                message: "Broj vegana ne može biti manji od 0",
              },
              validate: (value) =>
                value <= watch("brojGostiju") ||
                "Broj vegana ne može biti veći od broja gostiju",
            })}
          />
        </FormRow>
      )}
      <FormRow
        label="Gost kontaktirao putem"
        error={errors?.odakleRezervacija?.message}
      >
        <SelectWrapper>
          <select
            className="select-element"
            name="odakleRezervacija"
            id="odakleRezervacija"
            defaultValue={"Email"}
            disabled={isWorking}
            {...register("odakleRezervacija")}
          >
            <option value={"Email"}>Email</option>
            <option value={"Instagram"}>Instagram</option>
            <option value={"WhatsApp"}>WhatsApp</option>
            <option value={"Viber"}>Viber</option>
            <option value={"Redovan poziv"}>Redovan poziv</option>
            <option value={"Booking"}>Booking</option>
            <option value={"Airbnb"}>Airbnb</option>
          </select>
        </SelectWrapper>
      </FormRow>
      <FormRow label="Kontakt" error={errors?.kontakt?.message}>
        <Input
          type="text"
          id="kontakt"
          disabled={isWorking}
          placeholder="Email, br telefona, instagram..."
          {...register("kontakt", {
            required: "Obavezno polje",
          })}
        />
      </FormRow>
      <FormRow label="Datum dolaska">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="dd-MM-yyyy"
          customInput={<StyledDatePickerInput />}
        />
      </FormRow>
      <FormRow label="Broj noćenja" error={errors?.brojNocenja?.message}>
        <Input
          type="number"
          id="brojNocenja"
          disabled={isWorking}
          placeholder="Broj noćenja gostiju"
          {...register("brojNocenja", {
            required: "Obavezno polje",
            min: {
              value: 0,
              message: "Broj noćenja ne može biti manji od 0",
            },
          })}
        />
      </FormRow>
      <FormRow label="Datum odlaska">
        <Input
          type="text"
          id="datumOdlaska"
          value={
            brojNocenja ? format(datumOdlaskaBrojNocenja, "dd-MM-yyyy") : ""
          }
          disabled={true}
        />
      </FormRow>
      {odakleRezervacija !== "Booking" && (
        <>
          <FormRow label="Aranžman" error={errors?.aranzman?.message}>
            <SelectWrapper>
              <select
                className="select-element"
                name="aranzman"
                id="aranzman"
                disabled={isWorking}
                value={aranzman}
                {...register("aranzman", {
                  required: "Odabir aranžmana je obavezan",
                  validate: (value) =>
                    value !== "placeholder" || "Odabir aranžmana je obavezan",
                })}
              >
                <option value="placeholder" disabled>
                  Odaberi aranžman
                </option>

                <option>Aranžman 1</option>
                <option>Aranžman 2</option>
                <option>Aranžman 3</option>
                <option>Aranžman 4</option>

                {/* Always include all options */}
              </select>
            </SelectWrapper>
          </FormRow>
        </>
      )}

      {!isDnevniRafting && !isSator && !isKampKucica && brojNocenja > 0 && (
        <>
          <span style={{ fontWeight: "500" }}>
            Slobodni bungalovi za ovaj datum:
          </span>
          <FormRow label="Bungalov">
            {filteredCabins.length > 0 ? (
              <SelectWrapper>
                <select {...register("idBungalova")} defaultValue="">
                  {filteredCabins.map((cabin) => (
                    <option value={cabin.id} key={cabin.id}>
                      {cabin.imeBungalova.toUpperCase()} -{" "}
                      {cabin.vrstaBungalova} - 1/
                      {cabin.brojKreveta}
                    </option>
                  ))}
                </select>
              </SelectWrapper>
            ) : (
              <p style={{ color: "red", fontWeight: "500" }}>
                Nema slobodnih bungalova za ovaj datum.
              </p>
            )}
          </FormRow>
          {additionalBungalowsWatch.map((bungalov, index) => (
            <FormRow key={index} label={`Dodatni bungalov ${index + 1}`}>
              <SelectWrapper>
                <select
                  {...register(`additionalBungalows.${index}`)}
                  defaultValue={bungalov || ""}
                >
                  {filteredCabins.map((cabin) => (
                    <option value={cabin.id} key={cabin.id}>
                      {cabin.imeBungalova.toUpperCase()} -{" "}
                      {cabin.vrstaBungalova} - 1/
                      {cabin.brojKreveta}
                    </option>
                  ))}
                </select>
              </SelectWrapper>
              {isDuplicate(bungalov) && (
                <p style={{ color: "red" }}>Duplikat bungalova!</p>
              )}
            </FormRow>
          ))}
          {filteredCabins.length > 0 ? (
            <Button
              type="button"
              variation="seocndary"
              size="small"
              onClick={() => handleNoviBungalov()}
            >
              Dodaj bungalov
            </Button>
          ) : null}
          &nbsp;&nbsp;&nbsp;
          {additionalBungalowsWatch.length > 0 && (
            <>
              <Button
                type="button"
                variation="danger"
                size="small"
                onClick={handleUkloniPosljednjiBungalov}
              >
                Ukloni posljednji bungalov
              </Button>
              &nbsp; &nbsp;
              <br />
            </>
          )}
        </>
      )}

      <FormRow label="Avans" error={errors?.avans?.message}>
        <Input
          type="number"
          id="avans"
          disabled={isWorking}
          placeholder="Avans"
          {...register("avans", {
            required: "Obavezno polje",
          })}
        />
      </FormRow>

      <FormRow label="Popust(€)" error={errors?.popust?.message}>
        <Input
          type="number"
          id="popust"
          disabled={isWorking}
          defaultValue={0}
          {...register("popust", {
            required: "Obavezno polje",
          })}
        />
      </FormRow>
      <FormRow
        label="Ukupno za naplatu"
        error={errors?.ukupnoZaNaplatu?.message}
      >
        <Input
          type="number"
          id="ukupnoZaNaplatu"
          placeholder="Ukupna cijena"
          disabled={isWorking}
          {...register("ukupnoZaNaplatu", {
            required: "Obavezno polje",
            min: {
              value: 0,
              message: "Cijena ne može biti manja od 0",
            },
          })}
        />
      </FormRow>
      <FormRow label="Napomena" error={errors?.napomena?.message}>
        <Textarea
          id="napomena"
          disabled={isWorking}
          placeholder="Napomena..."
          {...register("napomena")}
        />
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
          {isEditSession ? "Uredi rezervaciju" : "Dodaj rezervaciju"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
