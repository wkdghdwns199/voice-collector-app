// supabase client 생성 라이브러리 !! 지우면 안됨 !!

import { createClient } from '@supabase/supabase-js'
const url = process.env.REACT_APP_SUPABASE_URL
const key = process.env.REACT_APP_SUPABASE_KEY
export const supabase = createClient(url, key)