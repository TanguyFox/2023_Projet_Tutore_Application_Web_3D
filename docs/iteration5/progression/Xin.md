# 06/02/2024

## Tavail effectué
- Affichage des faces qui se croisent (60% terminé)

## Problèmes rencontrés
Le principal problème actuel est que le temps de détection est trop long.

Pour un modèle de renard avec 200 000 faces, 
la détection prend encore environ 10 secondes.

Actuellement, je divise l'espace en `100*100*100` petits espaces 
pour effectuer la détection des intersections entre les faces. 

Si ce nombre dépasse 100, 
l'amélioration des performances n'est pas significative 
et ça occupe beaucoup de mémoire.

La solution d'optimisation que 
je peux envisager maintenant 
consiste à utiliser une méthode plus mathématique 
pour implémenter l'algorithme. 

L'algorithme actuel est basé sur le lancer de rayons de Three.js, 
c'est une méthode un peu bête et complexe, 
mais qui fonctionne. 

Cependant, si je veux améliorer la performance, 
je dois utiliser d'autres algorithmes plus efficaces.

# 06/02/2024

## Tavail effectué
- Affichage des faces qui se croisent (70% terminé)

## Problèmes rencontrés
Actuellement, j'ai réussi à trouver un nouvel algorithme 
pour réduire la quantité de calculs, 
mais la détection n'est pas encore très précise. 

Il peut détecter avec succès toutes les surfaces qui se croisent, 
mais parfois il les confond aussi avec des surfaces normales. 
En général, il nécessite encore des améliorations. 

La réunion d'aujourd'hui avec Monsieur Dupont m'a donné une nouvelle idée: 
lors de la division de l'espace, 
on peut d'abord le diviser grossièrement en huit espaces, 
puis effectuer une division plus détaillée en fonction du nombre de surfaces contenues 
dans chaque espace. 

J'ai essayé cette méthode, mais les résultats ne sont pas très satisfaisants.
