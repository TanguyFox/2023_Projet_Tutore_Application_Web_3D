# 22/01/2024

## Tavail effectué
- Régler le problème d'export d'un modèle 3D en STL\OBJ. (L'objet 3D disparaissait dans le scène lors de l'export) 
- Régler le problème d'import d'un nouveau modèle 3D. (Impossible de recharger un fichier avec le même nom)
- La taille de la scène s'ajuste automatiquement en fonction de la taille de la fenêtre.

## Plan pour demain
- Faire des recherches sur la réparation de maillage.
- Régler le problème de changement de textures différentes. (Le changement de texture fait revenir le modèle 3D déplcé à sa position initiale)

# 23/01/2024

## Tavail effectué
- Régler le conflit entre le chargement de nouveaux modèles et la texture "fil de fer". (Bug corrigé)
- La position et l'angle de la caméra seront réinitialisés lors du chargement de nouveaux modèles. (Amélioration)

J'ai passé beaucoup de temps aujourd'hui à essayer de réparer un maillage, 
mais sans grand progrès. 

Le défi principal est de détecter les erreurs dans le maillage 
avec la structure de données halfEdge 
et de trouver des solutions de réparation. 

Honnêtement, c'est difficile. 
Il y a beaucoup d'infos sur les erreurs possibles dans les modèles 3D en ligne, 
mais peu sur comment les réparer. 
On recommande souvent d'utiliser des logiciels professionnels.

Demain, je vais chercher des méthodes dans la littérature scientifique.