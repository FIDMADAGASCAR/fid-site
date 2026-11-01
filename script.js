// Adresse du script Google (URL de l'application web)
const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbyLJ3REHaFLEe2GMzDv1BW48bOqSif_mJr_dp_QWJtBZIJgL0KWen4Qb8SG5pWY7GEJeA/exec";

const form = document.getElementById("formulaire");
const etape1 = document.getElementById("etape1");
const etape2 = document.getElementById("etape2");
const champNumero = document.getElementById("numero");
const champCode = document.getElementById("code");
const bouton = document.getElementById("bouton");
const boutonSuivant = document.getElementById("suivant");
const message = document.getElementById("message");

function afficher(texte, type) {
  message.textContent = texte;
  message.className = type || "";
}

async function envoyer(donnees) {
  const reponse = await fetch(URL_SCRIPT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(donnees)
  });
  return reponse.json();
}

// Étape 1 : le numéro d'employé est envoyé dès le clic sur « Continuer »
async function allerEtape2() {
  const numero = champNumero.value.trim();
  if (!numero) { afficher("Entrez votre numéro d'employé.", "erreur"); return; }

  boutonSuivant.disabled = true;
  afficher("Enregistrement de votre numéro…");
  try {
    const data = await envoyer({ action: "numero", numero });
    if (data.statut === "ok") {
      afficher("");
      etape1.hidden = true;
      etape2.hidden = false;
      champCode.focus();
    } else {
      afficher(data.message || "Une erreur est survenue. Réessayez.", "erreur");
    }
  } catch (err) {
    afficher("Connexion impossible. Vérifiez internet et réessayez.", "erreur");
  } finally {
    boutonSuivant.disabled = false;
  }
}

boutonSuivant.addEventListener("click", allerEtape2);
champNumero.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); allerEtape2(); }
});

// Étape 2 : le code d'immatriculation est vérifié puis ajouté sur la ligne du numéro
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const numero = champNumero.value.trim();
  const code = champCode.value.trim();
  if (!code) { afficher("Entrez votre code d'immatriculation.", "erreur"); return; }

  bouton.disabled = true;
  afficher("Envoi en cours…");
  try {
    const data = await envoyer({ action: "code", numero, code });
    if (data.statut === "ok") {
      afficher("Inscription enregistrée. Bonne chance !", "ok");
      form.reset();
      etape2.hidden = true;
      etape1.hidden = false;
    } else {
      afficher(data.message || "Une erreur est survenue. Réessayez.", "erreur");
    }
  } catch (err) {
    afficher("Connexion impossible. Vérifiez internet et réessayez.", "erreur");
  } finally {
    bouton.disabled = false;
  }
});