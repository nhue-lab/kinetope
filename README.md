# DERIVE — musée des pages dérivées

Collection de pages web loufoques, autonome et figée. Chaque pièce = un dossier
auto-contenu (HTML/CSS/JS embarqués), zéro backend, zéro CMS, zéro dépendance.

## Pièces

| N° | Pièce | Technique loufoque |
|----|-------|--------------------|
| 01 | [derive-matrix](pieces/derive-matrix/) | Terminal narratif scroll-storytelling, chat fantôme, lapin ASCII glitch |
| 02 | [compteur-2003](pieces/compteur-2003/) | Compteur de visites figé à 000001, fenêtre Win98 en CSS pur, blink sans GIF |

## Principes non négociables

- **Autonome** : chaque pièce marche seule, sertie dans son dossier, partageable par URL directe.
- **Figée** : contenu en dur dans le code. Zéro maintenance, zéro modération, zéro API.
- **Frugale** : < 20 Ko par pièce. Fonts système, aucune image (les "GIF" sont du CSS).
- **Déterministe** : animations cycliques à durées fixes, aucun aléa non seedé.
- **Sûre** : CSP stricte (`default-src 'none'`), pas de formulaire fonctionnel, pas de collecte.

## Easter eggs

Il y en a au moins un par pièce. Les curieux qui lisent la source sont récompensés.
C'est le principe du musée : la plaque dit l'essentiel, la source dit le reste.

> suis le lapin.
