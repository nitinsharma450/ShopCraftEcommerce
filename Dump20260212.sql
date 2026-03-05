CREATE DATABASE  IF NOT EXISTS `social` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `social`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: social
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cancel_order`
--

DROP TABLE IF EXISTS `cancel_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancel_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `reason` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cancel_order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `cancel_order_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cancel_order`
--

LOCK TABLES `cancel_order` WRITE;
/*!40000 ALTER TABLE `cancel_order` DISABLE KEYS */;
INSERT INTO `cancel_order` VALUES (1,27,32,14,'Other'),(2,27,34,12,'Shipping is delayed'),(3,27,35,12,'Item not needed anymore');
/*!40000 ALTER TABLE `cancel_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=289 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (288,27,12,3,'2025-12-22 15:22:26');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checkout`
--

DROP TABLE IF EXISTS `checkout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checkout` (
  `id` int NOT NULL AUTO_INCREMENT,
  `checkout_date` datetime NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkout`
--

LOCK TABLES `checkout` WRITE;
/*!40000 ALTER TABLE `checkout` DISABLE KEYS */;
INSERT INTO `checkout` VALUES (50,'2025-07-26 19:25:25',27),(51,'2025-07-26 20:55:51',27),(52,'2025-07-28 10:24:50',27),(53,'2025-07-28 13:23:13',27),(54,'2025-07-28 13:42:40',27),(55,'2025-07-29 13:03:45',27),(56,'2025-07-29 13:03:57',27),(57,'2025-07-29 21:49:32',27),(58,'2025-07-30 13:16:12',27),(59,'2025-07-30 13:48:29',27),(60,'2025-08-01 15:16:13',27),(61,'2025-08-23 23:03:41',27),(62,'2025-08-23 23:40:53',27),(63,'2025-12-22 20:52:01',27),(64,'2025-12-22 20:52:27',27);
/*!40000 ALTER TABLE `checkout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checkout_item`
--

DROP TABLE IF EXISTS `checkout_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checkout_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `checkout_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `checkout_id` (`checkout_id`),
  CONSTRAINT `checkout_item_ibfk_1` FOREIGN KEY (`checkout_id`) REFERENCES `checkout` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkout_item`
--

LOCK TABLES `checkout_item` WRITE;
/*!40000 ALTER TABLE `checkout_item` DISABLE KEYS */;
INSERT INTO `checkout_item` VALUES (52,50,9,3),(53,51,10,3),(54,52,13,1),(55,53,13,2),(56,54,10,1),(57,55,14,1),(58,56,14,2),(59,57,14,2),(60,58,12,3),(61,59,12,1),(62,60,9,1),(63,61,12,1),(64,62,14,1),(65,63,12,1),(66,64,12,3);
/*!40000 ALTER TABLE `checkout_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES (14,'Footwear'),(15,'Electronic'),(16,'smart watch'),(17,'Fashion');
/*!40000 ALTER TABLE `product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `category` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `discountPercentage` decimal(5,2) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `warrantyInformation` varchar(255) DEFAULT NULL,
  `shippingInformation` varchar(255) DEFAULT NULL,
  `availabilityStatus` varchar(50) DEFAULT NULL,
  `tags` text,
  `image_url` varchar(255) DEFAULT NULL,
  `product_category_id` int DEFAULT NULL,
  `productscol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_category_id_idx` (`product_category_id`),
  CONSTRAINT `product_category_id` FOREIGN KEY (`product_category_id`) REFERENCES `product_category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (9,'Noise S-12','Stay connected, track your health, and elevate your style with the SmartX ProFit Smartwatch. Designed for active lifestyles, this all-in-one smartwatch offers powerful fitness tracking, call and notification sync, customizable watch faces, and a sleek, durable build.','Smart Watch',3500.00,10.00,3.50,7,'Noise','1 years','ship in 5 day','Out of Stock','[\"wqwe\",\"weqqw\"]','/product/1752041206431.jpg',NULL,NULL),(10,'men shoes','Step into all-day comfort and effortless style with the FlexStep™ Sneakers. Designed for everyday wear, these sneakers combine breathable materials, cushioned soles, and a sleek urban look—perfect for both casual and semi-sporty outfits.','Footwear',1000.00,14.00,3.00,10,'Bata','1 years','3 days','Out of Stock','[\"we\",\"ewqe\"]','/product/1752055390236.jpg',NULL,NULL),(12,'Airwave Max 5 Wireless ','Noise Newly Launched Airwave Max 5 Wireless Over Ear Headphones with Adaptive Hybrid ANC (up to 50dB), HFA Tech, 80H Playtime, Dual Pairing(Calm Beige)','Electronic',5000.00,9.00,4.00,9,'Noise','1year','ship in 5 days',NULL,'[\"wee\",\"eqwe\"]','/product/1752055692101.jpg',NULL,NULL),(13,'Head Phone','Experience immersive sound like never before with our premium wireless over-ear headphones. Designed for comfort and engineered for crystal-clear audio, these headphones offer deep bass, crisp highs, and balanced mids, making them perfect for music lovers, gamers, and professionals alike.','Electronic',5000.00,15.00,3.20,7,'Boat','1 years','3 days','null','[\"wqw\",\"wqw\"]','/product/1752511908132.jpg',NULL,NULL),(14,'men shoes','erwerewf wfwerererwe we ewrewr','Footwear',3000.00,30.00,4.20,10,'Bata','1 year','ship in 3 days',NULL,'[\"sa\",\"wew\"]','/product/1753506314008.jpg',NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `signup`
--

DROP TABLE IF EXISTS `signup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `signup` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `signup`
--

LOCK TABLES `signup` WRITE;
/*!40000 ALTER TABLE `signup` DISABLE KEYS */;
INSERT INTO `signup` VALUES (1,'Nitin','nitin@gmail.com','123456','2025-06-28 09:07:05'),(3,'Anuj','Anuj@gmail.com','987654','2025-06-28 09:30:58'),(4,'nikhil','nikhil@gmail.com','987654','2025-06-28 09:34:11'),(5,'adi','adi@gmail.com','12345678','2025-06-28 11:11:12'),(6,'aditya','aditya@gmail.com','7654321','2025-06-28 11:22:37');
/*!40000 ALTER TABLE `signup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `gender` varchar(45) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'user',
  `profile_picture` varchar(255) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `status` varchar(10) NOT NULL,
  `password` varchar(55) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (25,'Administrator','admin@gmail.com','Male','superadmin','/users/1752914837524.jpg','California','USA','1234567890','active','123456'),(26,'abc','abc@gmail.com','Male','User','/users/1753094698870.jpg','dasdas','dsadsa','1234567890','Active','123456'),(27,'Nitin Sharma','nitin@gmail.com','Male','User','/users/1753507810732.jpg','Haryana','India','1234567890','Active','123456');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_order`
--

DROP TABLE IF EXISTS `user_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `order_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `delivery_name` varchar(100) NOT NULL,
  `delivery_phone` varchar(15) NOT NULL,
  `delivery_email` varchar(100) DEFAULT NULL,
  `delivery_address` text NOT NULL,
  `delivery_city` varchar(100) DEFAULT NULL,
  `delivery_state` varchar(100) DEFAULT NULL,
  `delivery_pincode` varchar(10) DEFAULT NULL,
  `delivery_country` varchar(100) DEFAULT 'India',
  `payment_method` varchar(50) DEFAULT 'COD',
  `payment_status` varchar(50) DEFAULT 'Pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_order`
--

LOCK TABLES `user_order` WRITE;
/*!40000 ALTER TABLE `user_order` DISABLE KEYS */;
INSERT INTO `user_order` VALUES (36,27,3200.00,'2025-08-23 18:11:43','khushal sharma','8800817720','khushal@gmail.com','near sector 4','gurugram',NULL,'122001','India','cod','pending');
/*!40000 ALTER TABLE `user_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_order_item`
--

DROP TABLE IF EXISTS `user_order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_order_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `product_category` varchar(100) NOT NULL,
  `quantity` int NOT NULL,
  `user_order_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_order_id` (`user_order_id`),
  CONSTRAINT `user_order_item_ibfk_1` FOREIGN KEY (`user_order_id`) REFERENCES `user_order` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_order_item`
--

LOCK TABLES `user_order_item` WRITE;
/*!40000 ALTER TABLE `user_order_item` DISABLE KEYS */;
INSERT INTO `user_order_item` VALUES (28,14,'Footwear',1,36);
/*!40000 ALTER TABLE `user_order_item` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-12 23:17:33
