CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('pickup_request','pickup_accepted','pickup_completed','plan_expiring','system','esg_update') NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`relatedPickupId` int,
	`relatedWasteLogId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pickups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`wasteLogId` int NOT NULL,
	`mallUserId` int NOT NULL,
	`truckUserId` int,
	`mallName` text NOT NULL,
	`mallAddress` text NOT NULL,
	`loadingDock` text,
	`contactPerson` text,
	`phoneNumber` text,
	`materialType` enum('cardboard','plastic_wrap','wooden_pallets') NOT NULL,
	`weightKg` double NOT NULL,
	`detourKm` double DEFAULT 0,
	`fuelAllowance` double DEFAULT 0,
	`status` enum('pending','accepted','in_progress','completed','declined') NOT NULL DEFAULT 'pending',
	`distanceToMall` double DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pickups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` enum('mall','truck') NOT NULL,
	`mallName` text,
	`mallAddress` text,
	`loadingDock` text,
	`contactPerson` text,
	`phoneNumber` text,
	`wasteType` text,
	`driverName` text,
	`truckNumber` text,
	`vehicleCapacity` text,
	`gpsEnabled` boolean DEFAULT false,
	`plan` enum('free','gold','platinum') NOT NULL DEFAULT 'free',
	`planDaysLeft` int DEFAULT 10,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin','mall','truck') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `waste_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`profileId` int NOT NULL,
	`materialType` enum('cardboard','plastic_wrap','wooden_pallets') NOT NULL,
	`weightKg` double NOT NULL,
	`status` enum('pending','matched','picked_up','completed') NOT NULL DEFAULT 'pending',
	`matchedPickupId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `waste_logs_id` PRIMARY KEY(`id`)
);
