### 22/01/2024 :

- [x] Affichage d'un message pour connaitre l'état du modèle 3D (erreur sur les halfedges ou non)
- [x] HalfEdge ayant des problèmes sont affichées en rouge. Néanmoins leur visibilité 
   est faible sur les gros modèles 3D.
- [ ] Début de l'essai de reséparer les tâches de chargement du fichier et de remplissage des données 
      dans la structure de données.

###### Objectif pour la prochaine fois :

- Réussir à comprendre où s'arrête la partie asynchrone du chargement du fichier STL
- Trouver un moyen de rendre les halfedges ayant des problèmes plus visibles.
- Pouvoir identifier à quel type de problème correspond une halfedge (problème de normale, de 
  connectivité, de surface, etc...).

---
### 23/01/2024 :

- &#x2612; : Abandon de la séparation des tâches de chargement du fichier et de remplissage des données 
      dans la structure de données. En effet, le chargement du fichier STL est asynchrone et malgré de multiples 
      solution essayées, aucune n'a permis d'obtenir un résultat satisfaisant. Comme cette tâche ne gêne en rien 
      la progression du projet mais relève plus de l'aspect esthétique, elle sera donc abandonnée, après avoir passée une 
      journée et demi dessus.
- [ ] : Il est important de pouvoir identifier les différentes problèmes liées aux halfedges sans opposée.
        J'ai donc commencé à 17h à faire des recherches sur comment identifer ces problèmes.

Cette journée n'a pas été très probante en terme d'avancée de mon côté. Néanmoins, j'ai pu aider Lucie et Solène sur
certains petits problèmes qu'elles ont rencontrés dans leur fonctionnalité.

###### Objectif pour la prochaine fois :

- Trouver des algorithmes de détection des problèmes adaptées à notre nouvelle structure de données.
- Si possible, commencer à tester ces algorithmes.
---

### 24/01/2024 :

Cette journée a été riche en tests pour ma part, malheureusement peu fructuant. En effet, j'ai cherché à différencier
les halfedges étant dupliquées de celles proches d'un potentiel trou.

Comme ces deux type d'halfedge ont comme point commun de ne pas avoir d'arête opposée. Il faut donc trouver d'autres conditons
permettant de les différencier. Je vais sûrement rechercher ce soir comment les différencier.

Nous avons également discuter avec Xin sur le problème des faces mal orientées. Il semble avoir trouvé une solution, il faudra
la mettre à l'épreuve.

Enfin, j'ai ajouté un nouvel onglet dans notre menu, permettant de visualisé le nombre de problèmes (trous potentiels, halfedges dupliquées, faces mal orientées).

###### Objectif pour la prochaine fois :
* Trouver comment différencier les halfedges étant dupliquées de celles proches d'un potentiel trou.
---

### 25/01/2024 :
Je me suis rendu compte qu'il n'y a potentiellent pas d'arêtes dupliquées, seulement des arêtes non définies dans le STL lui même.
Tester avec le fichier ````sphere_error.stl````, celui affiche des erreurs de trous potentiels, alors qu'il n'y en a pas. 
Cependant, si l'on déplace l'on change un point d'une de ces arêtes, alors le trou apparait, ce qui n'est pas le cas
sur une face normale.