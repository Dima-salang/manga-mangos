import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/utils/supabase/server";

export default async function OnboardingPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/login");
    }

    // check if the user exists in the db
    let { data: dbUser, error: userError } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single();

    // if there is no existing user in the db, create one
    if (userError?.code === "PGRST116") { // PGRST116 is the code for "no rows returned"
        const { data: newUser, error: createError } = await supabaseAdmin
            .from("users")
            .insert({
                clerk_id: user.id,
                role: "USER"
            })
            .select()
            .single();

        if (createError) {
            console.error("Error creating new user:", createError);
            redirect("/");
        }
        dbUser = newUser;
    } else if (userError) {
        console.error("Error fetching existing user:", userError);
        redirect("/");
    }

    // check whether there is a profile associated with the user
    const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("user_id", dbUser.id)
        .single();

    if (profileError?.code === "PGRST116") {
        // create the profile in the db
        const { error: newProfileError } = await supabaseAdmin
            .from("profiles")
            .insert({
                user_id: dbUser.id,
                username: user.username || `${user.firstName} ${user.lastName}`,
                bio: "",
                interests: [],
                avatar_url: user.imageUrl || ""
            });

        if (newProfileError) {
            console.error("Error creating new profile:", newProfileError);
            redirect("/");
        }
    } else if (profileError) {
        console.error("Error fetching profile:", profileError);
        redirect("/");
    }

    redirect("/");
}