### 29/01/2024 :

- [x] Amélioration de l'affichage des arêtes à erreurs.
- [x] Affichage des trous dans le maillage (à revoir).
- [x] Amélioration du visuel de l'interface des problèmes avec un code couleur.

###### Objectifs pour la prochaine fois :

- [ ] Revoir l'affichage des erreurs
- [ ] Effectuer des tests sur l'affichage des erreurs
- [ ] Trouver un moyen ludique d'expliquer à l'utilisateur comment régler les erreurs
- [ ] Rechercher problèmes de nombre d'erreur variant d'un import à l'autre

### 30/01/2024 :
J'ai recherché un algorithme plus performant pour afficher les trous à l'utilisateur.
Malheureusement, les résultats ne sont pas concluants. Cela marche très bien pour un seul trou, 
mais dès qu'il y en a plusieurs, l'algorithme ne fonctionne plus correctement.

Aussi, je n'arrive pas à trouver d'où vient la variation du nombre d'erreurs d'un import à l'autre 
du même modèle 3D.

###### Objectifs pour la prochaine fois :
- [ ] Avoir un algorithme d'affichage des trous fonctionnel
- [ ] Trouver d'où vient la variation du nombre d'erreurs d'un import à l'autre

### 31/01/2024 :

M. DUPONT nous a confirmé que l'on doit laisser le choix à l'utilisateur de réparer le maillage automatiquement 
ou manuellement. Il a également demandé à ce que l'on affiche le nom du fichier sur l'application et les informations du 
maillage (nb triangles, sommets).

M. DUPONT nous a aiguillé sur la recherche de l'origine de la variation du nombre d'erreurs d'un import à l'autre.
Selon lui, cela viendrait de la précision des floats utilisés dans le fichier STL. Cette partie est donc mise de côté 
pour le moment.

Ce qui a été fait aujourd'hui :

- [x] Affichage du nom du fichier sur l'application
- [x] Affichage du nombre de triangles du maillage
- [x] Affichage des trous dans le maillage - marche avec des trous dispersés dans le maillage, mais pas avec des trous 
  mais à revoir quand plusieurs triangles forment un trou

###### Objectifs pour la prochaine fois :

- [ ] Avoir un algorithme d'affichage des trous fonctionnel même avec un trou de plusieurs triangles.
- [ ] Afficher le nombre de sommets du maillage