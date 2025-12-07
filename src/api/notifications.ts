import supabase from "@/helpers/supabase";

export async function fetchNotificationsApi() {
        const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Failed to fetch current user!");
    }

    const { data, error } = await supabase
        .from("Notifications")
        .select("*")
        .eq("user_id", user!.id);

    if (error) throw new Error(error.message);

    return data;
}

export async function insertNewNotificationApi(notification: { userId: string; description: string; detailed_description: string }) {

  const { data, error } = await supabase
    .from("Notifications")
    .insert([
      {
        user_id: notification.userId,
        description: notification.description,
        detailed_description: notification.detailed_description,
      },
    ])
    .select();

  if (error) throw new Error(error.message);

  return data;

}

export async function deleteAllNotificationsApi() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Failed to fetch current user!");
    }

    const { data, error } = await supabase
        .from("Notifications")
        .delete()
        .eq("user_id", user!.id);

    if (error) throw new Error(error.message);

    return data;
}

export async function markNotificationAsReadApi() {
    const {
        data: { user },
    } = await supabase.auth.getUser();  

    if (!user) {
        throw new Error("Failed to fetch current user!");
    }

    const { data, error } = await supabase
        .from("Notifications")
        .update({ seen: true })
        .eq("user_id", user!.id);

    if (error) throw new Error(error.message);
    
    return data;
}