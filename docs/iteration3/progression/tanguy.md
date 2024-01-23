### 22/01/2024 :

- [x] Affichage d'un message pour connaitre l'état du modèle 3D (erreur sur les halfedges ou non)
- [x] HalfEdge ayant des problèmes sont affichées en rouge. Néanmoins leur visibilité 
   est faible sur les gros modèles 3D.
- [ ] Début de l'essai de reséparer les tâches de chargement du fichier et de remplissage des données 
      dans la structure de données.

###### Objectif pour la prochaine fois :

- Réussir à comprendre d'où la partie asynchrone du chargement du fichier STL
- Trouver un moyen de rendre les halfedges ayant des problèmes plus visibles.
- Pouvoir identifier à quel type de problème correspond une halfedge (problème de normale, de 
  connectivité, de surface, etc...).