### Lundi 29/01
    * Matin *
Aujourd'hui, c'est suppression de la face principale à l'ajout d'un point pour la fractionner en trois
point.
Rappel : La semaine dernière, lorsque j'essayais de le faire, d'autres faces étaient supprimées sans
que j'arrive à comprendre pourquoi.
Ce matin, j'essaye de gérer la suppression et l'ajout avec l'index dans le bufferedGeometry :
au lieu d'ajouter les trois faces à la fin de la liste positions (contenant les coordonnées de points)
je supprime les trois points correspondant à la face principale et à ce même index j'ajoute mes 9 points
des trois nouvelles faces.

Et voilàààà la face se supprime bien sans problème

hé bin non finalement. Ca part sur un épluchage de la liste de coordonnées

Cette fois c'est bon. Juste une mauvaise utilisation de la méthode splice



Je rejoins Solène sur le calcul de complexité des deux algos

    * Après-midi *
Calcul de complexité (pas juste pour ce premier jet). Monsieur Dupont nous a un peu aiguillé
en fin de journée (visio) donc on doit bien reprendre les algos, faire les calculs de complexités pour
les algorithmes de tris (par rapport à un tri de tableau et à un tri de skiplist) et on devrait
le revoir demain.


### Mardi 30/01
    * Matin * 
Calcul de complexité. Hier ce qu'on a fait n'était vraiment pas correct. C'est pas si facile que ça. 