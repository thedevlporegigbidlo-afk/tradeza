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
      payload?.status === "succeeded" ||
      payload?.payment?.status === "succeeded"
    ) {
      const userId =
        payload?.metadata?.user_id ||
        payload?.data?.metadata?.user_id ||
        payload?.payment?.metadata?.user_id

      const paymentId =
        payload?.data?.payment_id || payload?.payment_id || payload?.id
      const checkoutId = payload?.data?.checkout_id || payload?.checkout_id

      if (userId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sb: any = supabase
        await sb.from("payments").upsert(
          {
            user_id: userId,
            dodo_payment_id: paymentId || null,
            dodo_checkout_id: checkoutId || null,
            product_id: env.DODO_PRODUCT_ID || null,
            amount: 49,
            currency: "INR",
            status: "succeeded",
            metadata: payload,
          },
          { onConflict: "dodo_payment_id" }
        )

        await sb
          .from("profiles")
          .update({
            paid_at: new Date().toISOString(),
            has_paid_listing: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)
      }
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ received: true })
  }
}
