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
