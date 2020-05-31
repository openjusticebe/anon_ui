# Anon UI
Interface web (IHM) pour tester différents algorithmes et techniques d'anonymisation et de dépersonnalisation.

Il interroge directement le service [anon_api](https://github.com/openjusticebe/anon_api), qui renvoie le résultat de l'opération.

## Utilisation
L'interface repose sur Gatsby/React, et après clonage peut être démarré comme suit:
```bash
# Installer le CLI gatsby
> npm install -g gatsby-cli
# Lancer le serveur local
> npm install
> gatsby develop
```

Il peut également être lancé sous docker:
```bash
# Lancer en utilisant docker
> docker build -t "ui" ./  && docker run --rm -it -p 80:80 ui 
```
