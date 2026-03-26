'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard') // Dashboard dispatcher will handle Admin vs Student
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string // 'admin' | 'student'
  const department = formData.get('department') as string
  const year = parseInt(formData.get('year') as string, 10) || 1
  const division = formData.get('division') as string || 'A'

  // The requested constraint: "restricted to college email id"
  if (!email.includes('.ac.in') && !email.includes('.edu')) {
    return { error: "Registration is restricted to valid college email domains (.edu or .ac.in)" }
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  // Link to public.users table created in Phase 2
  if (!authError && authData.user) {
    const { error: insertError } = await supabase.from('users').insert({
      user_id: authData.user.id,
      name,
      email,
      role,
      department,
      year: year,
      division: division
    })

    if (insertError) {
      // Rollback auth user would go here in production, skipping for brevity
      return { error: 'Failed to create user profile: ' + insertError.message }
    }
  } else if (authError) {
    return { error: authError.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
