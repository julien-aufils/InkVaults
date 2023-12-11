# InkVaults

## Présentation

InkVaults est une plateforme novatrice conçue pour répondre aux besoins des auteurs, des maisons d’édition et des passionnés de la littérature. Notre vision est de créer une Communauté d'Édition Décentralisée où l'écriture, l'édition, la promotion et la distribution d'œuvres littéraires deviennent transparentes, accessibles et rentables pour tous.

### [Vidéo de présentation](https://www.loom.com/share/add79e5d7b28469a8c968cc40cde5b79?sid=4a7da20c-2a7f-4697-bc5e-db4290557108)

### Lien vers le site déployé : [InkVaults](https://inkvaults.vercel.app/) avec Vercel Platform

## Front-end (dApp) :

### Technologies

Le front-end utilise principalement les technologies suivantes :

- **Next.js:** Framework React pour le rendu côté serveur et côté client, offrant une architecture basée sur les composants.

- **Typescript:** Langage de programmation superset de JavaScript, ajoutant la vérification des types pour une meilleure maintenabilité du code.

- **Alchemy (RPC):** Service blockchain qui fournit des API et des nœuds pour interagir avec la blockchain. Utilisé comme fournisseur de données (RPC) dans le frontend.
- **Wagmi:** Bibliothèque React de haut niveau permettant d'interagir avec les fournisseurs (RPC) depuis le navigateur.

- **RainbowKit:** Outil permettant d'ajouter une interface de connexion à de nombreux wallets différents.

- **NFT Storage:** Service de stockage décentralisé (IPFS) conçu spécifiquement pour les fichiers liés aux tokens non fongibles (NFT) sur la blockchain. Ici, il nous permet d'interagir avec le réseau IPFS pour récolter des données.

## Principales fonctionnalités

- Une barre de navigation avec un bouton pour connecter son wallet
- Une homepage rudimentaire avec les liens vers les différentes
  pages créées.
- Les pages auteur, avec leur biographie et une liste détaillée de leurs
  bookshares.
- Une fenêtre modale s’ouvrant lorsqu’un utilisateur souhaite acheter un
  bookshare, où il peut visualiser les informations du bookshare
  sélectionné, sélectionner le nombre de parts et voir le coût associé.
  Une fois qu’il clique sur “Buy”, l’état de la transaction s’affiche.
- La page utilisateur, où chacun peut visualiser les bookshares qu’il a
  acheté, et le nombre de parts détenues.

## Back-end (Hardhat)

### Smart Contracts

#### `BookShare.sol`

Le smart contract `BookShare.sol` est un contrat ERC-721 représentant un Book Share sur la blockchain. Les principales fonctionnalités incluent :

- **Achat de Shares :** Permet aux utilisateurs d'acheter des parts patrimoniales de livres.
- **Distribution des Royalties :** Permet à la plateforme de distributer des royalties en fonction des revenus de l'auteur et des parts détenues par les holders

- **Withdraw de Royalties :** Permet aux holders de récolter leurs royalties

#### `BookShareFactory.sol`

Le smart contract `BookShareFactory.sol` est une "usine à contrats" qui permet la création de nouveaux contrats `BookShare.sol`. Les fonctionnalités principales sont :

- **Création de BookShares :** Permet à l'administrateur de la plateforme de créer de nouveaux contrats `BookShare.sol`.

- **Suivi des Contrats Créés :** Garde une trace de tous les contrats `BookShare.sol` créés.

- **Liste des Contrats par Auteur :** Permet de récupérer une liste de tous les contrats `BookShare.sol` associés à un auteur spécifique.

### Scripts de déploiement

Deux scripts ont été développés : `deployLocal.ts` et `deployMumbai.ts`, à choisir en fonction du réseau sur lequel les contrats seront déployés.

Ces scripts déploient chacun une instance du smart contract BookShareFactory. Ensuite, ils créent plusieurs contrats BookShare à l'aide de cette usine en spécifiant différentes informations pour chaque livre partagé, tels que le nom, le symbole, l'auteur, le nombre total de parts, le prix par part, et le lien de base pour les métadonnées sur IPFS.

### Tests unitaires

Le fichier de tests teste les toutes fonctionnalités du contrat `BookShareFactory` ainsi que celles du contrat `BookShare`. Voici un aperçu :

#### 1. Déploiement

- **Déploiement du Contrat Factory :** Vérifie que le contrat `BookShareFactory` est déployé avec succès et que le owner est correctement défini.
- **Déploiement des Contrats BookShare :** Vérifie que les contrats `BookShare` sont déployés avec succès à partir de la `BookShareFactory` et que le owner de chaque contrat `BookShare` est correctement défini.

#### 2. BookShare Factory

- **Vérification du owner :** S'assure que certaines fonctions de la `BookShareFactory` ne peuvent être exécutées que par le owner.
- **Liste des BookShares par Auteur :** Vérifie que la fonction `getBookSharesByAuthor` retourne les contrats `BookShare` appartenant à un auteur spécifique.

#### 3. BookShares Contrat

##### 3.1. Achat de Parts

- **Reverts pour des Conditions Invalides :** Vérifie que l'achat de parts échoue correctement dans différentes conditions invalides.
- **Transfert des Frais à la Plateforme :** Confirme que les frais de marché sont transférés à la plateforme.
- **Transfert des Fonds à l'Auteur :** Vérifie que les fonds de l'achat sont transférés à l'auteur du livre.
- **Modification de la Quantité de Parts Disponibles :** Confirme que la quantité de parts disponibles est correctement mise à jour après un achat.
- **Mint des Tokens pour l'Acheteur :** Vérifie que les tokens sont créés et attribués à l'acheteur.
- **Événement d'Achat Émis :** S'assure que l'événement `BookShareSold` est émis lors d'un achat.

##### 3.2. Distribution des Royalties

- **Reverts pour des Conditions Invalides :** Vérifie que la distribution de royalties échoue correctement dans différentes conditions invalides.
- **Transfert des Frais à la Plateforme lors de la Distribution :** Confirme que les frais de distribution sont transférés à la plateforme.
- **Mise à Jour des Royalties Totales :** Vérifie que le total des royalties est correctement mis à jour après la distribution.
- **Événement de Distribution de Royalties Émis :** S'assure que l'événement `RoyaltiesDistributed` est émis lors de la distribution.

##### 3.3. Retrait des Royalties

- **Reverts pour des Conditions Invalides :** Vérifie que le retrait des royalties échoue correctement dans différentes conditions invalides.
- **Mise à Jour du Solde Retiré et du Solde de l'Utilisateur :** Confirme que le solde retiré et le solde de l'utilisateur sont correctement mis à jour après un retrait.
- **Événement de Retrait de Royalties Émis :** S'assure que l'événement `RoyaltiesWithdrawn` est émis lors du retrait des royalties.

##### 3.4. BookShare URI

- **Récupération de l'URI du BookShare :** Vérifie que la fonction `bookshareURI` retourne correctement l'URI du BookShare.

#### Coverage

| File                 | % Stmts | % Branch | % Funcs | % Lines |
| -------------------- | ------- | -------- | ------- | ------- |
| BookShareFactory.sol | 100     | 100      | 100     | 100     |
| BookShare.sol        | 100     | 78.57    | 100     | 100     |

## Installation en local

### Back-End

#### Installation des dépendances

```bash
cd backend
npm install
```

#### Deploiement des contrats

```bash
cd backend
npx hardhat node
```

Puis ouvrir un nouveau terminal :

```bash
cd backend
npm run deploy:local
```

### Front-End

#### Installation des dépendances

```bash
cd frontend
npm install
```

#### Changement de l'état

Se rendre dans `frontend/constants/index.ts`.

Et mettre la variable : `isProductionState` sur `false` pour spécifier à la dApp que réseau utilisé sera local.

#### Lancement du serveur

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur pour pouvoir consulter le serveur.
