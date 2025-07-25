import { enUS } from "date-fns/locale";

export function getCustomLocale({ fullDayNames = false } = {}) {
  return {
    ...enUS,
    localize: {
      ...enUS.localize,
      day: (narrowDay) =>
        fullDayNames
          ? [
              "Nedjelja",
              "Ponedjeljak",
              "Utorak",
              "Srijeda",
              "Četvrtak",
              "Petak",
              "Subota",
            ][narrowDay]
          : ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"][narrowDay],
      month: (narrowMonth) =>
        [
          "Januar",
          "Februar",
          "Mart",
          "April",
          "Maj",
          "Jun",
          "Jul",
          "Avgust",
          "Septembar",
          "Oktobar",
          "Novembar",
          "Decembar",
        ][narrowMonth],
    },
  };
}
