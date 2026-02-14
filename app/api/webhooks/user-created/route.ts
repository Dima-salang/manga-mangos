import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import supabase from "@/utils/supabase/server";
import { Profile, User } from "@/types/user";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Please add your WEBHOOK_SECRET from .env.local in the .env.local file");
    }

    const headerList = await headers();
    const svix_id = headerList.get("svix-id");
    const svix_timestamp = headerList.get("svix-timestamp");
    const svix_signature = headerList.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const verifier = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;
    try {
        evt = verifier.verify(body, {
            svix_id,
            svix_timestamp,
            svix_signature,
        }) as WebhookEvent;
    } catch (error) {
        console.error("Error verifying webhook:", error);
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    // handle the webhook for the user-created
    const eventType = evt.type;
    if (eventType === "user.created") {
        const { id, email_addresses, first_name, last_name } = evt.data;

        // create the user
        const user: Omit<User, "id"> = {
            clerk_id: id,
            role: "USER",
        };

        // insert the user
        const { data: user_data, error: user_error } = await supabase.from("users").insert([user]).select().single();

        if (user_error) {
            console.error("Error creating user:", user_error);
            return NextResponse.json({ error: "Error creating user" }, { status: 500 });
        }

        // create the profile of the user
        const profile: Omit<Profile, "id"> = {
            user_id: user_data.id,
            username: `${first_name} ${last_name}`,
            bio: "",
            interests: [],
            avatar_url: "",
        };

        // insert the profile
        const { error: profile_error } = await supabase.from("profiles").insert(profile);

        if (profile_error) {
            console.error("Error creating profile:", profile_error);
            return NextResponse.json({ error: "Error creating profile" }, { status: 500 });
        }

        console.log("User created:", user_data);
    }

    return NextResponse.json({ message: "Webhook verified successfully" });
}