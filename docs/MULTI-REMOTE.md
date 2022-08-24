On peut associer plusieurs repos distant à un repo local

Commande pour savoir quel repos distant on a :

```sh
git remote -v
```

Associer un nouveau repo distant

```sh
git remote add nomDonnéAuRepo urlSSH
```

On peut récupérer les infos du nouveau repo
```sh
git pull nomDonnéAuRepo nomDeLaBranche
```

Si ça ne marche pas, on peut forcer

```sh
git pull nomDonnéAuRepo nomDeLaBranche --force
```

Si on a des souci avec les historiques, on peut forcer la fusion des 2 historiques

```sh
git pull nomDonnéAuRepo nomDeLaBranche --force --allow-unrelated-histories
```


On oublie pas de commit les changement et de les envoyer sur le repo distant
```sh
git add .
git commit -m"correction jour n"
git push origin master
```
