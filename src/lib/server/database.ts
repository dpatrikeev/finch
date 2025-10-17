import { createClient } from '@supabase/supabase-js';

import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from '$env/static/public';
import type { Database } from './database.types';

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (locals: App.Locals) => {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    async accessToken() {
      const token = await locals.auth().getToken();
      return token;
    },
  });
};
