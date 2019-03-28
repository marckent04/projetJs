-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  jeu. 28 mars 2019 à 19:14
-- Version du serveur :  10.1.36-MariaDB
-- Version de PHP :  7.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `maman`
--

-- --------------------------------------------------------

--
-- Structure de la table `commandes`
--

CREATE TABLE `commandes` (
  `num` int(11) NOT NULL,
  `client` int(11) NOT NULL,
  `idFact` int(11) NOT NULL,
  `idFood` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `commandes`
--

INSERT INTO `commandes` (`num`, `client`, `idFact`, `idFood`) VALUES
(56, 41, 30, 1),
(57, 41, 30, 3);

-- --------------------------------------------------------

--
-- Structure de la table `facture`
--

CREATE TABLE `facture` (
  `idFact` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `livre` tinyint(1) NOT NULL DEFAULT '0',
  `dateCom` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idCli` int(11) NOT NULL,
  `price` double NOT NULL,
  `numComm` varchar(10) COLLATE utf8_bin NOT NULL,
  `commentaire` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `facture`
--

INSERT INTO `facture` (`idFact`, `status`, `livre`, `dateCom`, `idCli`, `price`, `numComm`, `commentaire`) VALUES
(30, 1, 1, '2019-03-28 18:04:19', 41, 4000, '41-ORBFQ', 'Vraiment je me suis regale j\'avais meme envie de commander a nouveau');

-- --------------------------------------------------------

--
-- Structure de la table `foods`
--

CREATE TABLE `foods` (
  `id` int(11) NOT NULL,
  `lib` varchar(100) COLLATE utf8_bin NOT NULL,
  `description` varchar(150) COLLATE utf8_bin NOT NULL,
  `poster` varchar(255) COLLATE utf8_bin NOT NULL,
  `price` double NOT NULL,
  `idType` int(11) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `foods`
--

INSERT INTO `foods` (`id`, `lib`, `description`, `poster`, `price`, `idType`, `amount`) VALUES
(1, 'Garba', 'Semoule de manioc accompagne de poisson thon, utilise le plus souvent pour remplacer un somnifere ca ment pas ohhh!!!', 'garba.jpg', 1500, 2, 16),
(2, 'Placali', 'Boon ca la il faut vivre pour y croire hein bon kplo qui est dessus la c\'est pas amusement HEIN!!!', 'placali.jpg', 1500, 2, 18),
(3, 'Foutou sauce graine ', 'Banane plantain + manioc plie accompagne d\'une sauce faite a base de graines de palmier avec du bon poule connaisseur connait ', 'foutou.jpg', 1500, 2, 16),
(4, 'Frites Poulet', 'Frites de pomme de terre accompagne de poulet cuit au feu de bois ideale pour un dejeuner equilibre et chocolaté', 'fritesPoulet.jpg', 2500, 2, 20),
(5, 'SucrySugar', 'Gateau au four fourre a la chantili et recouvert de sucre glace et de chocolat fondu, vendu par lot de 10', 'chocolate.jpg', 5000, 3, 13),
(6, 'Cookies', 'Cookies faits maison avec la traditionnelle recette de Cookievore.\r\nVendu par lot de 20', 'cookiesMaison.jpg', 5000, 3, 8),
(7, 'Crepes', 'Des crepes faites avec du lait de france ideal pour un apres-midi entre potes.', 'Crepes.jpg', 1500, 3, 29),
(8, 'pretzels', 'Des biscuits au chocolat faits avec du nutella. Bon pur les petits gourmets ...Vendu par lot de 10', 'pretzels.jpg', 6000, 3, 10),
(9, 'Muffins au chocolat', 'Gateaux au four au chocolat et fourre au chocolat de noisette. Vendu par lot de 10', 'muffins_chocolate_pastries.jpg', 4000, 3, 10),
(10, 'Attieke Alloco Poisson', 'Le trio Attieke poisoon alloco pour un dejeuner complet', 'attAlloco.jpg', 2000, 2, 30),
(11, 'Casolette d\'aubergines a la sauce tomate accompagne de riz ', 'sauce a base d\'aubergines replie de viande de boeuf ', 'cassolette-d-aubergines-a-la-sauce-tomate.jpg', 2000, 2, 15),
(12, 'Pancakes + the ', '4 pancakes au miel + du bon cafe nespresso ppour tenir toute une journee ', 'pancakes.jpeg', 3000, 1, 10),
(13, 'Cafe + pain + confiture ', 'Parfait pour bien debuter la journee', 'ptiDej6.jpg', 2000, 1, 16),
(14, 'Dejeuner complet', 'charcuterie hallal + 4 croissant + pain + jus d\'orange + fromage + cafe', 'ptiDej4.jpg', 4000, 1, 8),
(15, 'Borritos', '2 bons borittos pour avoir le ventre plein des le matin ', 'borritos.jpg', 3000, 1, 10),
(16, 'Gnamakouji', 'Jus de gimgembre', 'gnamankou.jpg', 1000, 5, 29),
(17, 'bissap', 'Jua de bissap', 'jus-bissap.png', 1000, 5, 27),
(18, 'Tomidji', 'Jus de tamarin', 'tamarin.jpg', 1000, 5, 28),
(19, 'Ivorio', 'Jus naturel d\'ananas', 'ivoirio.jpg', 1000, 5, 29),
(20, 'Petits pois au pigeons sautes', 'DU petit pois accompagne de pigeons sautes cuit au vin blanc ', 'pigons.jpg', 2500, 4, 13),
(21, 'Ragout au sanglier', 'Ragout de pommes de terre accompagne de sanglier sauvage ', 'Ragoût_de_sanglier_aux_châtaignes.jpg', 5000, 4, 9),
(22, 'Choucouya de poulet ', 'POulets a la braise et bien assaisonne pour le bonheur des gourmets ', 'choucouya.jpg', 4000, 4, 8),
(23, 'Pates homard', 'Pates alimentaires accompagne d\'une bonne partie de homard fraichement venu d\'Italie (EN EXCLU !!!)', 'patesHomard.jpg', 5000, 4, 10),
(24, 'Porcodjo', 'Souper de porc accomppagne de semoule de manioc', 'souper.JPG', 3000, 4, 10),
(25, 'Love nuggets', 'Nuggets en forme de coeur pour un bon diner de couple ', 'chicken.jpg', 5000, 4, 10);

-- --------------------------------------------------------

--
-- Structure de la table `type`
--

CREATE TABLE `type` (
  `id` int(11) NOT NULL,
  `lib` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `type`
--

INSERT INTO `type` (`id`, `lib`) VALUES
(1, 'P\'tit Dej'),
(2, 'Dej'),
(3, 'dessert'),
(4, 'diner'),
(5, 'boissons');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_bin NOT NULL,
  `firstname` varchar(255) COLLATE utf8_bin NOT NULL,
  `mail` varchar(255) COLLATE utf8_bin NOT NULL,
  `mdp` varchar(254) COLLATE utf8_bin NOT NULL,
  `tel` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `firstname`, `mail`, `mdp`, `tel`) VALUES
(41, 'Nanguy', 'Marc-Henry', 'marchenrynanguy1@gmail.com', '059b5a9f4e9ae0ce15458c26f6d80191647803f9e935c0549a1d446117d47200', 12345678);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD PRIMARY KEY (`num`),
  ADD KEY `client` (`client`),
  ADD KEY `idFact` (`idFact`),
  ADD KEY `idFood` (`idFood`);

--
-- Index pour la table `facture`
--
ALTER TABLE `facture`
  ADD PRIMARY KEY (`idFact`),
  ADD KEY `idCli` (`idCli`);

--
-- Index pour la table `foods`
--
ALTER TABLE `foods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idType` (`idType`);

--
-- Index pour la table `type`
--
ALTER TABLE `type`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `commandes`
--
ALTER TABLE `commandes`
  MODIFY `num` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT pour la table `facture`
--
ALTER TABLE `facture`
  MODIFY `idFact` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT pour la table `foods`
--
ALTER TABLE `foods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `type`
--
ALTER TABLE `type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD CONSTRAINT `commandes_ibfk_1` FOREIGN KEY (`client`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `commandes_ibfk_2` FOREIGN KEY (`idFact`) REFERENCES `facture` (`idFact`),
  ADD CONSTRAINT `commandes_ibfk_3` FOREIGN KEY (`idFood`) REFERENCES `foods` (`id`);

--
-- Contraintes pour la table `facture`
--
ALTER TABLE `facture`
  ADD CONSTRAINT `facture_ibfk_1` FOREIGN KEY (`idCli`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `foods`
--
ALTER TABLE `foods`
  ADD CONSTRAINT `foods_ibfk_1` FOREIGN KEY (`idType`) REFERENCES `type` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
