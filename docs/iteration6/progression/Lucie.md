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
Je ferais des tests supplémentaires sur le remplissage d'autres trous d'une structure ayant deux trous et on cherchera 
à régler le problème à la prochaine séance. 



### Mardi 19/03 
Sans rien n'avoir touché, les deux trous dans la sphère se remplissent correctement. J'approfondis mes tests. 
Comme mon programme a l'air de bien fermer les trous mais de simplement pas toujours orienté les faces du bon côté, 
je peux essayer de retourner les faces mal orentées du modèle final mais pour le moment ça ne marche pas. 
Ce n'est pas une solution très optimisée mais pour le temps qu'il nous reste ce pourrait être satisfaisant. 

### Mercredi 20/03 
J'essaye de retourner les faces durant cette séance de 2h (on décale 2h du vendredi ensemble ce mercredi)
Bon j'y arrive pas. J'ai beau utiliser la méthode que Xin a utilisé pour réparer les faces mal orientées à l'import 
du fichier, elle ne répart pas les miennes. De plus, lorsqu'on exporte le modèle et qu'on importe le fichier, 
l'endroit où les faces devaient être mal orientées se transforme en trou. 

Je regarde pour voir s'il y a un moyen de savoir dans quel sens enregistrer les points d'une nouvelle face selon la 
normale. Dans mes tests j'ai réussi à inverse les trous bien faits et les trous mal orientés. Je me dis que je tiens 
quelque chose mais je n'arrive pas à combiner les deux. 

ça marche pas... 


### Vendredi 22/03
Toujours sur le même problème. Je fais des recherches 
J'ai essayé plusieurs méthodes pour réussir à calculer la normale de la face que je vais créer en la comparant 
à la normale du modèle mais ça marche décidément pas. Donc je sollicite l'aide de monsieur Dupont 
la semaine prochaine si possible. 


### Lundi 25/03 
On voit monsieur Dupont à 11h30 donc d'ici là je vais faire un peu de refactorisation de code pour qu'il soit un peu 
plus buvable. 