import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { env } from "@/lib/env"
import type { Database } from "@/lib/types/database"

export async function POST(request: Request) {
  try {
    const body = await request.text()

    const payload = JSON.parse(body)

    const supabase = createClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
        env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    if (
      payload?.type === "payment.succeeded" ||
      payload?.event_type === "payment.succeeded" ||
      payload?.data?.status === "succeeded" ||
      payload?.status === "succeeded"
    ) {
      const userId =
        payload?.metadata?.user_id ||
        payload?.data?.metadata?.user_id ||
        payload?.payment?.metadata?.user_id

      if (userId) {
        await supabase
          .from("profiles")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", userId)
      }
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ received: true })
  }
}

