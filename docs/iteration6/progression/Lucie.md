### Lundi 04/03 
    * Après-midi *
Je me lance sur la correction des trous. Je fais plein de schéma pour voir si je peux automatiser la création des faces
et de quelle manière 
17h48 : J'ai une idée qui à l'air de marcher sur papier ! Prochaine séance je mets ça en place 


### Mercredi 06/03
    * Après-midi * 
C'est parti pour le codage. 
Pour une seule face en trou ça se corrige bien, par contre je suis confrontée au problème des coordonnées des 
points lus dans le sens anti-horaire. Faut que je retourne tout ce que j'ai marqué sur papier 


### Lundi 11/03
    * Après-midi *  
Je me suis concentrée sur les trous ayant une longueur de tableau de points paire. A l'issue de la séance, mon trou se 
corrige bien et lorsque j'exporte, puis importe le fichier, le programme ne trouve aucun problème au modèle. Le trou 
est bien comblé. Par contre j'ai sûrement fait l'erreur de raisonner en 2D. Donc la manière dont le trou est 
comblé peut laisser à désirer. Par exemple un cube ne se corrige pas en faisant un beau cube. L'inconvénient 
est que je ne vois pas comment je pourrais faire pour prédire la forme de l'objet 3D que je comble pour 
faire en sorte de bien le remplir. Cela nécessiterait également de savoir quels sont les points spécifiques à relier 
et je ne vois pas, en sachant que notre seule information est un tableau de trou, comment le savoir. 

J'ai fait un test sur un trou ayant un nombre de points impairs et a priori ça se rempli entièrement aussi. 

Je dois approfondir mes tests 


### Mardi 12/03
    * Après-midi *
J'ai lié le bouton "réparer le maillage" avec l'algo de remplissage des trous. Ca a engendré des problèmes que 
je n'ai pas tout de suite compris. Puis ça a été réparé. 
Ensuite j'ai pu effectué plus de tests : 
 - a ma grande surprise, le carré qui ne se remplissait pas bien lorsque le nombre de points autour d'un trou 
   est impair , s'est mis à bien se réparer avec le bon angle 
 - ce n'est pas le cas d'un trou pair. 
 - La forme de sphère se répare également plutôt bien sauf lorsque j'ai deux trous distincts ayant un sommet en 
   commun : un trou se rempli correctement, l'autre à des faces orientées vers l'intérieur. 
Je ferais des tests suplémentaires sur le remplissage d'autres trous d'une structure ayant deux trous et on cherchera 
à régler le problème à la prochaine séance. 