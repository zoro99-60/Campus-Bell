-- Add subject field to teacher_profiles
ALTER TABLE public.teacher_profiles
ADD COLUMN IF NOT EXISTS subject TEXT;

-- Update the v_users view to include subject
CREATE OR REPLACE VIEW public.v_users AS
SELECT 
    u.*,
    sp.roll_number,
    sp.year,
    sp.division,
    sp.semester AS profile_semester,
    tp.teacher_id AS profile_teacher_id,
    tp.designation,
    tp.phone_number,
    tp.subject,
    ap.admin_id AS profile_admin_id,
    ap.access_level
FROM public.users u
LEFT JOIN public.student_profiles sp ON u.user_id = sp.user_id
LEFT JOIN public.teacher_profiles tp ON u.user_id = tp.user_id
LEFT JOIN public.admin_profiles ap ON u.user_id = ap.user_id;
