# 29/01/2024

## Tavail effectué
- Ajout d'une deuxième scène montrant le mesh de base lors de modifications

Rien de spécial aujourd'hui, 
demain je commencerai à rédiger le rapport de fin de semestre.

Je vais aussi tester le projet, 
rechercher des problèmes potentiels et les corriger.

# 30/01/2024

## Travail effectué
- Correction des bugs dans le programme

Ce matin, j'ai corrigé quelques erreurs dans le programme, 
et cet après-midi, j'ai étudié comment détecter les faces qui se croisent. 
En fait, j'ai fait des progrès significatifs. 
J'ai réalisé que je pouvais utiliser le raycasting de Three.js pour y parvenir 
(si deux surfaces se croisent, alors une arête de l'une doit nécessairement traverser l'autre. 
En utilisant les coordonnées de chaque arête pour faire le raycasting, 
je peux vérifier si elle intersecte avec l'autre surface). 
Cependant, j'ai ensuite découvert que 
pour des modèles avec un grand nombre de faces 
(par exemple, le modèle de renard dans notre projet a 200 000 faces), 
calculer les intersections entre chaque paire de faces 
nécessiterait C(200000, 2) calculs, 
soit 19999900000 calculs au total. 
Par conséquent, je dois trouver un moyen de diviser l'espace 
pour réduire le nombre de calculs. 
Je ne sais pas si je trouverai une solution viable demain. 
Si ce n'est pas le cas, 
je devrai me concentrer sur la rédaction du rapport de fin de semestre.