import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { env } from "@/lib/env"
import type { Database } from "@/lib/types/database"

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature =
      request.headers.get("x-dodo-signature") ||
      request.headers.get("dodo-signature") ||
      ""

    // Basic webhook handler - extend with signature verification as needed
    const payload = JSON.parse(body)

    // Use service role for webhook if needed
    const supabase = createClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Handle successful payment
    if (
      payload?.type === "payment.succeeded" ||
      payload?.event_type === "payment.succeeded" ||
      payload?.status === "succeeded"
    ) {
      const userId = payload?.metadata?.user_id
      if (userId) {
        // Mark user as paid - you can store in profiles or a separate table
        await supabase
          .from("profiles")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", userId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (e) {
    return NextResponse.json({ received: true })
  }
}
