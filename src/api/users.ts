import supabase from "@/helpers/supabase";

export interface UserProfile {
  id: string;
  name: string;
  created_at?: string;
}

export async function createAccountWithProfile(
  email: string,
  password: string,
  full_name: string,
) {
  const data = await createAccount(email, password, full_name);

  if (data.user) {
    await insertUserProfile(data.user.id, full_name);
  }

  return data;
}

export async function createAccount(
  email: string,
  password: string,
  full_name: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: full_name,
        display_name: full_name,
      },
    },
  });

  if (error) throw error;

  return data;
}

export class ProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProfileError";
  }
}

export async function insertUserProfile(userId: string, name: string) {
  const { data, error } = await supabase
    .from("Users")
    .insert([
      {
        id: userId,
        name: name,
      },
    ])
    .select();

  if (error) throw new ProfileError(error.message);

  return data;
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("user is undefined");
  }

  const { data, error } = await supabase
    .from("Users")
    .select()
    .eq("id", user?.id);

  if (error) {
    throw error;
  }

  if (data.length <= 0 || data.length > 1) {
    throw Error("ID does not exist or is not unique");
  }

  return data[0];
}

export const getUsers = async () => {
  const { data, error } = await supabase.from("Users").select();

  if (error) {
    throw error;
  }

  return data;
};

export const getUserById = async (userId: string) => {
  const { data, error } = await supabase
    .from("Users")
    .select()
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  if (data.is_public) {
    return data;
  }

  return null;
}
