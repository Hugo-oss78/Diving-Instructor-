# Instructor Prep — Révision Moniteur de Plongée (parcours SSI)

Application web installable (PWA) pour réviser et mémoriser les fondamentaux
du monitorat de plongée : quiz par thème, fiches mémo et suivi de
progression. Fonctionne hors-ligne une fois installée.

## ⚠️ Important — à lire avant utilisation

Cette application est un **outil de révision personnel**, créée
indépendamment. Elle **n'est pas éditée, vérifiée ni approuvée
officiellement par SSI (Scuba Schools International)**.

- Les questions de physique, physiologie et matériel couvrent des
  connaissances générales de plongée communes à tous les organismes de
  formation.
- La partie « Parcours & pédagogie SSI » reflète la structure publique du
  cursus telle que décrite sur [divessi.com](https://www.divessi.com) au
  moment de la création de l'appli (2026) — les programmes évoluent,
  reconfirme toujours auprès de ton centre SSI ou de ton Instructor
  Trainer.
- **Aucune valeur chiffrée propre à SSI** (ratios encadrant/élèves,
  procédures d'examen, tables RDP/eRDPml) n'est reproduite ici : ce sont
  des données propriétaires, sujettes à changement, à vérifier
  exclusivement dans ton **SSI Instructor Manual** / **MySSI** et auprès de
  ton Instructor Trainer.
- Ne te fie jamais uniquement à cette appli pour un point de sécurité.

## Installer l'application sur un téléphone Android (ex. Google Pixel)

1. Héberger le site (voir ci-dessous), puis ouvrir l'URL dans **Chrome** sur
   le Pixel.
2. Toucher le menu ⋮ de Chrome → **Installer l'application** (ou accepter
   la bannière d'installation qui apparaît automatiquement en bas de
   l'écran).
3. L'icône « Instructor Prep » apparaît alors sur l'écran d'accueil, comme
   une application classique — y compris hors connexion après la première
   ouverture.

Aucun compte, aucun serveur, aucune donnée envoyée nulle part : tout
(les réponses et la progression) reste stocké localement sur l'appareil
(`localStorage`).

## Héberger le site (nécessaire pour l'installer sur un vrai téléphone)

Le plus simple avec ce dépôt GitHub :

1. Dans le repo GitHub → **Settings → Pages**.
2. Source : **Deploy from a branch**, choisir la branche du site (celle-ci)
   et le dossier `/ (root)`.
3. GitHub fournit une URL du type
   `https://<utilisateur>.github.io/<repo>/` — c'est cette URL qu'il faut
   ouvrir dans Chrome sur le Pixel pour installer l'app.

## Développement local

Aucune dépendance, aucun build : HTML/CSS/JS natifs.

```bash
python3 -m http.server 8080
# puis ouvrir http://localhost:8080/index.html
```

## Structure du projet

```
index.html              Squelette de l'application
manifest.webmanifest     Métadonnées d'installation (PWA)
sw.js                    Service worker (cache hors-ligne)
css/styles.css           Styles
js/app.js                Logique de l'appli (navigation, quiz, progression)
js/data.js               Contenu : questions et fiches mémo
icons/                   Icônes de l'application
```

## Contenu couvert

- **Physique** : lois de Boyle-Mariotte, Dalton, Henry, flottabilité, pression.
- **Physiologie & accidents** : narcose, ADD, barotraumatismes, surpression
  pulmonaire, toxicité de l'oxygène, essoufflement.
- **Matériel** : détendeur, gilet, manomètre, ordinateur, combinaison.
- **Planification & tables** : azote résiduel, intervalle de surface,
  vitesse de remontée, palier de sécurité, altitude *(concepts uniquement,
  sans valeurs chiffrées propriétaires)*.
- **Environnement & sécurité** : gestion de groupe, courants, plongée de
  nuit, briefings.
- **Parcours & pédagogie SSI** : structure du cursus professionnel
  (Dive Control Specialist → ITC → IE → Open Water Instructor → Specialty
  Instructor → Instructor Trainer), rôle pédagogique de l'instructeur.
