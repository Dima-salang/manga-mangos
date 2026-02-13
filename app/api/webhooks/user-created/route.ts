import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

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
        console.log("User created:", id, email_addresses, first_name, last_name);
    }

    return NextResponse.json({ message: "Webhook verified successfully" });
}