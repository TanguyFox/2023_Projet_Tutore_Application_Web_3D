### Mardi 06/02
    * Matin *
Je me lance sur l'affichage dans le menu Problèmes les indices des faces dans le fichier STL pour 
pouvoir aller vérifier le fichier. 
La première étape est de vérifier que l'indice lu dans le tableau de position construit par Three.js suit bien 
le fichier STL et que les indices correspondent bien aux mêmes indices dans le fichier STL. Normalement il lit 
le fichier ligne par ligne donc ça doit être stocké dans le tableau dans le même ordre. Mais vaut mieux 
vérifier. 
Avant ça, je dois trouver comment enregistrer les indices des mauvaises faces par rapport à ce qui a déjà 
été fait, sans tout casser. C'est pas une mince affaire. 
Ok il y a un mélange qui s'effectue car pour un même fichier, ce n'est jamais le même indice de face problème 
qui tombe. C'est bien problématique. De plus pour moi avoir l'index de la face n'est pas représentatif 
dans le fichier STL. L'utilisateur va pas compter une par une les faces s'il en a un très grand nombre 
pour trouver laquelle ne va pas. Car dans le fichier STL rien n'indique l'indice de la face. 
Enfaite si, en épluchant le tableau de positions(coordonnées des points) le tableau est bien rangé dans le 
même ordre que les coordonnées des points dans le fichier STL. La différence d'indice vient d'ailleurs. 

Ok j'ai une petite équation qui permet de retourner l'indice de la face (demandé par monsieur Dupont) 
et la ligne dans le fichier. J'implémente ça, je fais en sorte que ça s'affiche dans l'onglet problemes 
du menu de modification et voilà 

    * Après-midi * 
J'ai fait en sorte d'afficher les informations mais je n'ai pas été très productives... 
Tanguy a proposé que si le nombre d'arrêtes à problèmes excède un certain nombre, on mette en place des 
menus déroulant pour que l'affichage ne soit pas surchargé. Ca sera pour demain. 


### Mercredi 07/02
    * Après-midi * 
Aujourd'hui ! Je gère l'affichage des informations des problèmes sur le fichier ! 
1. j'ai rajouté un textarea dans lequel est noté les deux lignes type "STL" des coordonnées des points de
l'halfedge concerné par le problème. Comme ça l'utilisateur peut copier ce qu'il y a d'écrit dans le textarea 
pour faire une recherche dans le fichier et les voir se surligner directement. Comme ça, il retrouve directement 
les deux points responsables de la création de cette halfedge. Et même sur l'application ça lui permet de les 
identifier aussi. 
2. Petit problème de ses informations qui ne se réinitialisaient pas lorsqu'on cliquait sur "nouveau modèle" et qu'on
importait un nouveau fichier. Les informations du fichier précédent demeuraient. Voilà c'est réglé, c'était pas grand  chose. 
3. A présent je dois fractionner l'affichage en plusieurs menus déroulants pour que tout ne s'affiche pas d'un coup dans 
le menu problème. Ca sera plus lisible. Un peu comme lorsqu'on affiche une liste de 1000 éléments dans la console js : 
les éléments sont présentés de manière fractionnée. Et je pense que je vais trier l'affichage par numéro de face

Vers la fin de la séance, j'arrive à découper la liste et à ce que le dom HTML soit organisé en différentes listes 
contenant un certain nombre d'éléments. Maintenant un peu de CSS pour faire le menu déroulant et c'est bon. 

On est pas mal, il y a l'idée. Faut améliorer le design par contre. Prochaine heure. 


### Lundi 12/02 
Je refactorise un peu mon code qui est mal fait. Je le déplace dans un module de fonctionnalité qui lui est propre. 
Je veux rajouter une transition plus agréable pour l'utilisateur
Voilà c'est pas trop mal. 
J'essaye de trouver comment faire pour que les points à la sélection d'une face aient une taille adaptée à l'élément. 
Car ils peuvent apparaitre très petit ou très grand suivant les modèles dû à leur radius fixe. 

### Mardi 13/02 
    * Matin * 
Je continue d'essayer de gérer la taille des points. Hier j'étais dans la compréhension du fonctionnement du radius 
Aujourd'hui faut que j'arrive à trouver l'équation qui permette sa modification en fonction du modèle. 
Au terme de la matinée, on peut changer la taille selon la taille du modèle mais le resultat n'est pas encore bon
(je pense qu'il faut juste trouver le bon coef, avec peut-être une ou deux conditions )

    * Après-midi * 
Après plusieurs tests sur plusieurs grandeurs de modèle, on peut dire que les coef sont plutot bons. Problème en parti 
résolu 

### Mercredi 20/02
J'ai oublié de tenir le petit journal pour la fin de l'itération mais après ce mardi j'ai rejoint Tanguy sur 
l'algorithme dont il avait besoin pour faire le tour complet d'un trou et retourner le tableau de points associés. 
Et ce pour tous les trous du modèle. Ca m'a prit deux-trois séances je crois. J'ai apriori fini ceci, à voir 
ce qu'il en pense et si ça l'aidera pour sa fonctionnalité de combler les trous (générer des faces pour combler). 
Là je m'occupe de la préparation de la soutenance avec le petit powerpoint et les documents à fournir de fin d'itération. 
Et si après j'ai le temps je pourrais retourner vers Tanguy pour trouver un algo qui comble les trous parce que 
ça m'intéresse quand même je serais déçue de passer à côté. 