# Projet Tutoré 2023 - 2024
## Groupe : LAURY Lucie, FAURE Solène, RENARD Tanguy, ZHANG Xin
## Sujet : Application Web 3D
## Tuteur : DUPONT Laurent

#### Présentation du sujet :

Ce projet a pour but la visualisation et la manipulation de fichiers STL au sein d'une application web. Ainsi, cette application devra être capable de :

  - Visualiser un fichier STL
  - Mettre en évidence un triangle sélectionné
  - Identifier les problèmes présent au sein du fichier (trous dans la structure, intersection de triangles au sein du maillage de l'objet 3D)
  - Modifier la "texture de l'objet" (maillage en lignes qui se croisent)
  - Créer des triangles autour d'un point

#### Lancer l'application (Version développement) :
Utiliser la commande ```npm install``` à la racine du projet pour installer les dépendances

Utiliser ensuite la commande ```npx vite``` à la racine du projet pour lancer le projet

#### Tester l'application :

Aller sur [MeshWizard](https://tanguyfox.github.io/2023_Projet_Tutore_Application_Web_3D/) pour tester l'application sans avoir à la lancer en local


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
   
   - 