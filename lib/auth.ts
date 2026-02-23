import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function getUser(): Promise<{ email?: string } | null> {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle error silently as cookies may be immutable in some cases
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user ? { email: user.email } : null
}
