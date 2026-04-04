'use server'

export type AuthState = {
  error?: string;
  message?: string;
} | null;


import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const requestedRole = formData.get('requested_role') as string

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  if (requestedRole && authData?.user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', authData.user.id)
      .single()

    if (profile?.role !== requestedRole) {
      await supabase.auth.signOut()
      return { error: `Access denied. You do not have ${requestedRole} privileges.` }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard') // Dashboard dispatcher will handle Admin vs Student
}

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string // 'admin' | 'student' | 'teacher'

  // The requested constraint: "restricted to college email id"
  if (!email.includes('.ac.in') && !email.includes('.edu')) {
    return { error: "Registration restricted to valid college domains (.edu or .ac.in)" }
  }

  // Pre-flight check for admin invite code
  if (role === 'admin') {
    const inviteCode = formData.get('invite_code') as string
    const validCode = process.env.ADMIN_INVITE_CODE || 'CAMPUS_ADMIN_2026'
    if (inviteCode !== validCode) {
      return { error: "Invalid Admin Invite Code." }
    }
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  // Link to public tables
  if (!authError && authData.user) {
    // 1. Insert Core User config
    const { error: userError } = await supabase.from('users').insert({
      user_id: authData.user.id,
      name,
      email,
      role,
      active: role === 'student' // Require explicit approval for teachers/admins? For now let's set true
    })

    if (userError) {
      // rollback or report (simple reporting for now)
      return { error: 'Failed to create core user record: ' + userError.message }
    }

    // 2. Insert Profile
    if (role === 'student') {
      await supabase.from('student_profiles').insert({
        user_id: authData.user.id,
        roll_number: formData.get('roll_number') as string,
        department: formData.get('department') as string,
        year: parseInt(formData.get('year') as string, 10) || 1,
        semester: parseInt(formData.get('semester') as string, 10) || 1,
        division: formData.get('division') as string || 'A'
      })
    } else if (role === 'teacher') {
      await supabase.from('teacher_profiles').insert({
        user_id: authData.user.id,
        teacher_id: formData.get('teacher_id') as string,
        department: formData.get('department') as string,
        designation: formData.get('designation') as string,
        phone_number: formData.get('phone_number') as string || null
      })
    } else if (role === 'admin') {
       await supabase.from('admin_profiles').insert({
        user_id: authData.user.id,
        admin_id: formData.get('admin_id') as string,
        department_or_office: formData.get('department_or_office') as string,
        designation: formData.get('designation') as string,
        access_level: 'super_admin'
      })
    }

    if (!authData.session) {
      return { message: 'Registration successful! Please check your college email to confirm your account before logging in.' }
    }

  } else if (authError) {
    return { error: authError.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function toggleUserActive(formData: FormData) {
  const supabase = await createClient()
  const userId = formData.get('user_id') as string
  const currentStatus = formData.get('active') === 'true'

  const { error } = await supabase
    .from('users')
    .update({ active: !currentStatus })
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/teachers')
  revalidatePath('/admin/students')
}

export async function deleteUser(formData: FormData) {
  const supabase = await createClient()
  const userId = formData.get('user_id') as string

  // Due to CASCADE, this will also delete profile records
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/teachers')
  revalidatePath('/admin/students')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
