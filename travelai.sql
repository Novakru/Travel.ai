CREATE TABLE `users` (
   `id` int NOT NULL AUTO_INCREMENT,
   `email` varchar(255) NOT NULL,
   `password` varchar(255) NOT NULL,
   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`),
   UNIQUE KEY `email` (`email`)
 ) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

 CREATE TABLE `sessions` (
   `id` int NOT NULL AUTO_INCREMENT,
   `user_id` int NOT NULL,
   `session_id` varchar(255) NOT NULL,
   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`),
   KEY `user_id` (`user_id`),
   CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

 CREATE TABLE `messages` (
   `id` int NOT NULL AUTO_INCREMENT,
   `session_id` varchar(255) NOT NULL,
   `type` varchar(50) DEFAULT NULL,
   `content` json DEFAULT NULL,
   `position` varchar(50) DEFAULT NULL,
   `user` json DEFAULT NULL,
   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci