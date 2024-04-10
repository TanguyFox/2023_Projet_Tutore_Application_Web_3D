# Projet Tutoré 2023 - 2024
## Groupe : LAURY Lucie, FAURE Solène, RENARD Tanguy, ZHANG Xin
## Sujet : Application Web 3D
## Tuteur : DUPONT Laurent

#### Présentation du sujet :

Au terme de ce projet, nous sommes capable de : 

  - Visualiser un fichier STL
  - Mettre en évidence un triangle sélectionné
  - Identifier les problèmes présent au sein du fichier (trous dans la structure, intersection de triangles au sein du maillage de l'objet 3D)
  - Modifier la "texture de l'objet" (texture pleine ou maillage)
  - Créer des triangles autour d'un point
  - Réparer les trous dans le maillage de l'objet 3D (de manière sommaire)
  - Exporter le fichier STL modifié


Un mode VR est également disponible pour visualiser l'objet 3D en réalité virtuelle.

Pour pouvoir agir sur les données du maillage de l'objet 3D résultant du fichier STL, nous devions convertir ces données.
Pour cela, nous avons utilisé :
- la structure de données [HalfEdge](https://en.wikipedia.org/wiki/Doubly_connected_edge_list).
  - Elle permet de stocker les informations relatives aux triangles (sommets, arêtes, faces) et de les manipuler plus facilement.
    Les arêtes étant doublement connectés (une arête possède son opposéee, la même arête mais dans l'autre sens), il est plus facile de naviguer dans le maillage de l'objet 3D
    d'y répérer les trous (si une arête n'a pas d'opposée, alors il y a un trou dans le maillage).
- La structure de données [SkipList](https://fr.wikipedia.org/wiki/Skip_list) pour stocker les sommets.
  - Elle permet de pouvoir rechercher rapidement un sommet dans le maillage de l'objet 3D.
  - Elle permet également de pouvoir ajouter ou supprimer un sommet rapidement.
  - Chaque sommet possède un tableau de ses arêtes incidentes sans opposé (les arêtes qui ont ce sommet comme origine).

- la librairie [three.js](https://threejs.org/docs/index.html#manual/en/introduction/Installation) pour la visualisation de l'objet 3D et la manipulation de celui-ci.
  - Elle est utilisé pour la visualisation de l'objet 3D, la sélection d'un triangle, la création de triangles, la modification de la texture de l'objet 3D, etc.
  C'est l'élement centrale l'affichage et de la manipulation de l'objet 3D.
  - C'est également grâce à cette librairie que nous pouvons visualiser l'objet 3D en VR.


Pour prendre rapidement connaissance des différents fichier JS présent dans ce projet, vous pouvez consulter le [ficher de récap](./docs/recapFichier.txt) mis à votre disposition.

#### Lancer l'application (Version développement) :
Utiliser la commande ```npm install``` à la racine du projet pour installer ses dépendances

Utiliser ensuite la commande ```npx vite``` à la racine du projet pour lancer le projet

#### Tester l'application :

Aller sur [MeshWizard](https://tanguyfox.github.io/2023_Projet_Tutore_Application_Web_3D/) pour tester l'application sans avoir à la lancer sur votre propre machine.


### Reprise du projet :

Ce projet pourrait être repris dans le futur par d'autres étudiants. En effet, nous pouvons encore envisager d'autres améliorations comme :

   - Amélioration de l'algorithme de réparations des trous :
        - Actuellement, l'algorithme de réparation des trous se contente de créer des triangles entre les points du trou sans prendre en compte la forme générale de l'objet 3D. 
        Un amélioration envisageable serait d'utiliser l'enveloppe convexe de l'objet 3D (lorsque celle-ci s'applique) afin d'avoir une triangulation plus cohérente par rapport à la forme de l'objet.
   
   - Amélioration de la VR :
     - Actuellement, la VR ne permet que de se déplacer autour de l'objet 3D. 
     Il pourrait être intéressant de pouvoir manipuler l'objet 3D directement en VR (déplacer des points, créer des triangles, etc).
     Cependant, il faudrait pour cela soit crée une interface dédié à la VR, soit adapter l'interface actuelle pour qu'elle soit compatible avec la VR.
     Il faut également prendre en compte la limitation des commandes en VR (nombre de boutons limité sur les contrôleurs).