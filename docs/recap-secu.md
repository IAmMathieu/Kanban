# Check List Security

## Never trust User

Ce n'est pas pq j'attend des données sous un format particulier (par ex. un entier) que mes utilisateurs m'enverront des données à ce format (ex. "coucou").

Je dois toujours contrôler / sécuriser ce que m'envoi mes utilisateurs.

## Mot de passe

### Complexité

Pour mes mots de passe ET celui des utilisateurs de mon application je dois m'assurer d'une certaine complexité.

Minimum 8 caractères avec majuscules, minuscules, chiffres et caractères spéciaux est un bon début.

*Pour valider la complexité des mots de passe des utilisateurs qui créent un compte j'utilise les regexs*

### Hash

Je **ne dois jamais** stocker en clair dans ma base de données les mots de passe de mes utilisateurs.

Pour ça je vais leur appliquer une transformation (un hashage). Et pour l'authentification je vais comparé la version hashé de ce que m'envoi l'utilisateur avec ce que j'ai en base de données.

Je dois utiliser des algos de hashage **fiable** (et je ne dois pas les refaire moi même).

Aujourd'hui les algos de hash fiables sont :
1. argon2
2. scrypt
3. bcrypt

En plus de hashé les mots de passe il faut aussi les saler.

Globalement, ou pour chaque utilisateur (c'est encore mieux) on va générer une longue chaîne de caractère aléatoire, que l'on concaténer au mot de passe avant le hashage.

Procédure :
- Lors de la création d'un utilisateur on génère une longue chaîne aléatoire le `salt`.
- On stock ce `salt` dans une colonne de ma base de données.
- On récupère le mot passe. On concatène le mot de passe et le `salt`
- On hash le tout
- On stock dans la BDD le hash généré

- Pour l'authentification
- On récupère la ligne associé au mail
- On récupère la valeur du `salt` pour cette ligne
- On concatène le mot de passe envoyer par l'utilisateur et le `salt`
- On hash le tout
- On compare ce que l'on a obtenu avec ce que est stocké en BDD

### Anti brut force

Sur un formulaire d'authentification, il est très fortement recommandé de bloquer pendant un certain temps (quelques minutes) la connexion à un compte utilisateur qui à reçu plusieurs tentative qui ont échoué.

### Ne pas faire

Les **master passoword** : Il ne faut jamais mettre en place un mot de passe qui marche sur tous les comptes.

Envoyer les mots de passe par mail : Si l'utilisateur demande un nouveau mot de passe, il ne faut pas le renvoyer dans le mail. Il faut générer un lien vers le formulaire de changement de mot de passe.

Sur un formulaire d'authentification, en cas d'échec, je **ne dois pas** préciser si l'utilisateur s'est trompé d'email (aucun email correspondant en base) ou de mot de passe.


## Injection SQL

Je **ne dois jamais** intégrer directement dans mes requêtes SQL des données envoyer par l'utilisateur.

Si je veux utiliser une données de l'utilisateur comme valeur (par ex, `id = valeurDuUser`), l faut utiliser les fonctions / paramètres indiqué dans la doc de mon outil pour sécuriser ces éléments (le système avec les `$` du connecteur pg).

Si je veux utiliser une données de l'utilisateur comme nom de champs (ex: `WHERE field = valeur`). Je dois vérifier que la saisie utilisateur est bien dans une liste de valeur autorisé.

Sinon on laisse la possibilité à n'importe qui d'effectuer n'importe quel requête sur notre base de données.

## CORS

Par défaut du JS dans un navigateur ne peut accéder, avec `fetch`, qu'aux API sur le même domaine.

Par exemple : si j'ai mon front sur `www.oclock.com` il ne pourra pas faire de requête vers `api.oclock.io`. Ceci pour protéger / empêcher des fuites de données.

Si j'ai besoin d'autoriser cette communication il faudra que les réponses de `api.oclock.io` comporte le header `Access-Control-Allow-Origin` avec pour valeur : `www.oclock.com`. La valeur spéciale `*` autorise tout le monde à faire des requêtes vers cette API.

:warning: Cette sécurité n'est valable que dans les navigateurs.


## XSS

Pour Cross-site scripting. L'idée c'est de stocker du HTML / JS / CSS dans une variable qui sera restitué par le back.

Par exemple : `<script>alert('toto');</script>` dans un commentaire pour déclencher l'apparition d'une popup chaque fois que le commentaire est affiché.

Pour sécuriser notre site l'objectif est d'être sur que le contenu de nos variable sera considéré comme du texte et pas comme des noeuds HTML.

Pour ça, plusieurs option :
- Dans EJS : on évite d'utiliser `<%-` avec des choses saisies par l'utilisateur
- En JS Front : on évite d'utiliser `node.innerHTML` on privilégie `node.textContent`
- Dans le back : on "sanitize" les données reçu de l'utilisateur à l'aide de package approprié (ex: https://www.npmjs.com/package/xss)

## Service direct de fichiers

*(Par exemple avec le module public)*

Il faut toujours faire très attention dès qu'une URL permet de récupérer (télécharger) des fichiers sur le serveur (via `sendFile` ou via le middleware `static`).

Par exemple je dois absolument éviter que mes sauvegardes de base de données soit accessible.

## Sécurité Front Ou Back

Les mesures de sécurité doivent être si possible des deux cotés. Mais à choisir ce sera coté back.

En effet, avec Insomnia par exemple, je peux m'affranchir de tous les contrôles qu'il pourrait y avoir coté front.

Les contrôles sécurité coté front servent surtout à indiquer précisément à l'utilisateur où il fait des erreurs.

## HTTPS

Depuis les scandales Snowden, Lustre, etc... Il est impératif de chiffrer les communication entre le serveur et le navigateur.

Pour cela on utilisera HTTPS à la place du protocole HTTP.

*(voir fiche récap associé)*