import supabase, { supabase2 } from "./supabase";

export async function signup({ ime, email, password }) {
  let { data, error } = await supabase2.auth.signUp({
    email,
    password,
    options: {
      data: {
        ime,
      },
    },
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateCurrentUser({ password, ime }) {
  // Construct the updateData object properly
  const updateData = {};
  if (password) updateData.password = password;
  if (ime) updateData.data = { ime };

  const { data: updatedUser, error } = await supabase.auth.updateUser(
    updateData
  );

  if (error) throw new Error(error.message);

  return updatedUser;
}
