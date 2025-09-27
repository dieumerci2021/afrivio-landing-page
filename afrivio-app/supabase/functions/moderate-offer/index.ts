import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Liste de mots-clés interdits pour la simulation
const FORBIDDEN_KEYWORDS = ['arnaque', 'faux', 'illégal', 'danger'];

serve(async (req) => {
  // Cette fonction est conçue pour être déclenchée par un webhook de base de données Supabase
  // sur une insertion dans la table 'offers'.
  const payload = await req.json();
  const newOffer = payload.record;

  // 1. Initialiser le client Supabase avec les droits d'administrateur
  //    (les variables d'environnement sont à définir dans les secrets de la fonction Supabase)
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // 2. Analyser le contenu de la nouvelle offre
  const contentToCheck = `${newOffer.title} ${newOffer.description}`.toLowerCase();
  const containsForbiddenWord = FORBIDDEN_KEYWORDS.some(keyword => contentToCheck.includes(keyword));

  const newStatus = containsForbiddenWord ? 'rejected' : 'approved';

  // 3. Mettre à jour le statut de modération de l'offre
  const { error } = await supabaseAdmin
    .from('offers')
    .update({ moderation_status: newStatus })
    .eq('id', newOffer.id);

  if (error) {
    console.error(`Erreur lors de la mise à jour de l'offre ${newOffer.id}:`, error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(
    JSON.stringify({ message: `Offre ${newOffer.id} modérée avec le statut : ${newStatus}` }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});

/*
--- Instructions pour le déploiement et la configuration ---

1.  **Déployer la fonction :**
    - Installez la CLI Supabase : `npm install supabase --save-dev`
    - Connectez-vous à votre projet : `npx supabase login`
    - Liez votre projet local : `npx supabase link --project-ref VOTRE_ID_PROJET`
    - Déployez la fonction : `npx supabase functions deploy moderate-offer --no-verify-jwt`

2.  **Configurer les variables d'environnement :**
    - Dans votre tableau de bord Supabase, allez dans "Edge Functions" -> "moderate-offer" -> "Secrets".
    - Ajoutez `SUPABASE_URL` (l'URL de votre projet Supabase).
    - Ajoutez `SUPABASE_SERVICE_ROLE_KEY` (la clé "service_role" de votre projet, trouvable dans les paramètres API).

3.  **Créer le webhook de base de données :**
    - Dans votre tableau de bord Supabase, allez dans "Database" -> "Triggers".
    - Créez un nouveau webhook.
    - Donnez-lui un nom (ex: "trigger_offer_moderation").
    - Sélectionnez la table "offers" et cochez l'événement "Insert".
    - Dans la section "HTTP Request", sélectionnez votre fonction "moderate-offer".
*/