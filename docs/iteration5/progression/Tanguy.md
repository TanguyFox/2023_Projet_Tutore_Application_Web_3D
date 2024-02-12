#### 06/02/2024 :
Pour commencer cette 5<sup>ème</sup> itération, j'ai continué mon travail sur la détection des trous.
J'ai pu trouvé sur internet, des algortithmes réputés mais difficile à transposer dans notre structure de données.
J'ai essayé plusieurs implémentations mais aucune n'a fonctionné pour le moment, donnant parfois trop de trous (donc des faux trous)
ou résultant en une boucle infinie.

###### Objectif pour la prochaine fois :
- Trouver une implémentation fonctionnelle pour la détection des trous. (voir avec **M. DUPONT**)

---
#### 07/02/2024 : 

Aujourd'hui j'ai continué mes recherches sur la détection des trous et j'ai peut-être trouvé une implémentation fonctionnelle.
Le principe est de partir d'une arêtes sans opposé puis de faire une boucle pour revenir à cette même arêtes en utilisant 
d'autres arêtes sans opposé. Cet ensemble d'arêtes forme un trou.

Cet ensemble est ensuite découpé en plusieurs triangles pour affiché le trou à l'utilisateur.

Je vais la tester demain pour voir si elle est viable dans les cas les plus généraux car elle semble parfois produire des 
résultats inatendu.

###### Objectif pour la prochaine fois : 

- Tester l'implémentation de la détection des trous.
- Améliorer la méthode si besoin
- Si possible, commencer à travailler sur la réparation automatique du maillage.
