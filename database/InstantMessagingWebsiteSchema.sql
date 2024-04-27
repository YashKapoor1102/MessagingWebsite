-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema webapp
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema webapp
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `webapp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `webapp` ;

-- -----------------------------------------------------
-- Table `webapp`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webapp`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `password` VARCHAR(300) NOT NULL,
  `picture` VARCHAR(100) NOT NULL,
  `status` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 20
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `webapp`.`message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webapp`.`message` (
  `message_id` INT NOT NULL AUTO_INCREMENT,
  `message` VARCHAR(1000) NOT NULL,
  `timestamp` DATETIME NOT NULL,
  `sender_id` INT NULL DEFAULT NULL,
  `recipient_id` INT NULL DEFAULT NULL,
  `message_type` VARCHAR(45) NOT NULL,
  `chat_id` INT NULL DEFAULT NULL,
  `file_path` TEXT NULL DEFAULT NULL,
  `file_name` VARCHAR(255) NULL DEFAULT NULL,
  `scheduled_time` DATETIME NULL DEFAULT NULL,
  `status` VARCHAR(255) NULL DEFAULT 'pending',
  PRIMARY KEY (`message_id`),
  UNIQUE INDEX `message_id_UNIQUE` (`message_id` ASC) VISIBLE,
  INDEX `sender_id_idx` (`sender_id` ASC) VISIBLE,
  INDEX `recipient_id_idx` (`recipient_id` ASC) VISIBLE,
  INDEX `chat_id` (`chat_id` ASC) VISIBLE,
  CONSTRAINT `message_ibfk_1`
    FOREIGN KEY (`chat_id`)
    REFERENCES `webapp`.`chat` (`chat_id`),
  CONSTRAINT `recipient_id`
    FOREIGN KEY (`recipient_id`)
    REFERENCES `webapp`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `sender_id`
    FOREIGN KEY (`sender_id`)
    REFERENCES `webapp`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 1089
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `webapp`.`chat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webapp`.`chat` (
  `chat_id` INT NOT NULL AUTO_INCREMENT,
  `message_id` INT NULL DEFAULT NULL,
  `chat_type` VARCHAR(45) NOT NULL,
  `status` VARCHAR(45) NOT NULL,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`chat_id`),
  UNIQUE INDEX `message_id_UNIQUE` (`chat_id` ASC) VISIBLE,
  INDEX `message_id_idx` (`message_id` ASC) VISIBLE,
  CONSTRAINT `fk_message_id`
    FOREIGN KEY (`message_id`)
    REFERENCES `webapp`.`message` (`message_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 219
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `webapp`.`chat_participants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webapp`.`chat_participants` (
  `chat_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  INDEX `chat_id` (`chat_id` ASC) VISIBLE,
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `chat_participants_ibfk_1`
    FOREIGN KEY (`chat_id`)
    REFERENCES `webapp`.`chat` (`chat_id`),
  CONSTRAINT `chat_participants_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `webapp`.`users` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `webapp`.`contacts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `webapp`.`contacts` (
  `user_id` INT NULL DEFAULT NULL,
  `friend_id` INT NULL DEFAULT NULL,
  `status` VARCHAR(45) NOT NULL,
  INDEX `friend_id_idx` (`friend_id` ASC) VISIBLE,
  INDEX `user_contact_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `friend_id`
    FOREIGN KEY (`friend_id`)
    REFERENCES `webapp`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `user_contact_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `webapp`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
