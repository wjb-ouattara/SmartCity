
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// On vérifie si les variables sont bien chargées (pour débugger)
if (!supabaseUrl || !supabaseKey) {
  console.error("⚠️ Alerte ! Les variables d'environnement ne sont pas chargées. As-tu bien renommé le fichier en .env ?");
}

export const supabase = createClient(supabaseUrl, supabaseKey);