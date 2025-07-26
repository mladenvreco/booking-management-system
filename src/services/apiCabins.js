import supabase from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("bungalovi").select("*");

  if (error) {
    throw new Error("Bungalovi se ne mogu učitati.");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  // kreiranje/editovanje bungalova
  let query = supabase.from("bungalovi");

  // kreiranje
  if (!id) query = query.insert([newCabin]);

  // editovanje
  if (id)
    query = query
      .update({ ...newCabin })
      .eq("id", id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    throw new Error("Greška pri dodavanju bungalova.");
  }
  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase
    .from("bungalovi")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("Greška pri brisanju bungalova.");
  }
  return data;
}
