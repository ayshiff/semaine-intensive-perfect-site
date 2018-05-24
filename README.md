# semaine-intensive-perfect-site

## Run it locally
- Run ```git clone https://github.com/ayshiff/semaine-intensive-perfect-site.git```   
- ```cd semaine-intensive-perfect-site```
- ``` npm install``` or ```yarn```
- ```node_modules/.bin/sequelize db:migrate```-> it will run migrations    
(Make sure to edit the config.json file inside the config folder with your own databse configuration)
- ```npm start``` or ```yarn start```

## Routing list

| Models  | Route  | Description  |
|---|---|---|
|Partner   | /admin/partners  | PartnerRoute  |
|Images Box | /admin/imagesbox  | ImageBoxRoute  |
|Airline Companie   | /admin/airlinescompanies  | AirlineCompanyRoute  |
|Factsheet   | /admin/factsheets  | FactSheetRoute  |
|Article   | /admin/index  | Main route  |


Each model has the following endpoints :

| Method  | Route  | Description  |
|---|---|---|
|GET   | /  | Get all items  |
|GET   | /add  | Add an item  |
|POST   | /add  | ADD post  |
|GET   | /edit/:id  | Edit an item  |
|POST   | /edit/:id  | POST edit  |
|GET   | /delete/:id | Delete an item  |
|POST   | /delete/:id  | POST delete  |


# Cahier des charges

![Screenshot](./references/Screenshot.png)

## Front

- Actu twitter des compagnies aériennes partenaires

- Fiches pratiques des bars / restaurants / hôtels

- Page de catégorie

- Page de contact par catégorie (Annonceur, Journaliste, Partenaire, Lecteur, Office de Tourisme)

- Lien vers lecture d’une fiche PDF (type “Calameo”)

- Design épuré et en lien avec la cible

## Back

- Création / Modification / Suppression d’article

- Gestion des partenaires

- Gestion des compagnies aériennes présentes dans le fil d’actualité

## Nouveaux contenus

- Demande du client concernant cette page :   
- “La boîte à images propose de mixer visuels et commentaire sur des thématiques de voyages :   
- Voyages - Gastronomie  
- Voyages - Bien-être 
- Voyages - Cultures
- Voyages - Sports”
- 3 “pages” TOP 100 
- Catégorie d’article à saisir en BO 
Les articles seront remplis par les Compagnies Aériennes elles-même.




