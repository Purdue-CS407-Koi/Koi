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
        .eq("receiver_id", user!.id);

    if (error) throw new Error(error.message);

    return data;
}

export async function insertNewNotificationApi({ receiverId, groupId, expenseId, amount, isSplit } : 
    { receiverId: string; groupId: string; expenseId: string; amount: number; isSplit: boolean }) {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Failed to fetch current user!");
    }

    const { data: userData, error: userError } = await supabase
        .from("Users")
        .select("*")
        .eq("id", receiverId)
        .single();

    if (userError) throw new Error(userError.message);

    if (userData?.notifications === false) {
        return;
    }

    const { data, error } = await supabase
        .from("Notifications")
        .insert([
            {
                receiver_id: receiverId,
                group_id: groupId,
                expense_id: expenseId,
                amount: amount,
                payer_id: user!.id,
                is_split: isSplit,
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
        .eq("receiver_id", user!.id);

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
        .eq("receiver_id", user!.id);

    if (error) throw new Error(error.message);

    return data;
}