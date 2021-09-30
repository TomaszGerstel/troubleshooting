

INSERT INTO `troubleshooting`.`problems` (`name`, `description`) VALUES ('Wada1', 'opis');
INSERT INTO `troubleshooting`.`problems` (`name`, `description`) VALUES ('Wada2', 'opis');

Insert into `troubleshooting`.`solutions` (`description`, `remarks`) VALUES ("rozwiazanie1", "uwaga1");
Insert into `troubleshooting`.`solutions` (`description`, `remarks`) VALUES ("rozwiazanie2", "uwaga2");

Update `troubleshooting`.`solutions` SET `problem_id` = (Select `id` from `troubleshooting`.`problems` where `name` = "Wada1") WHERE `description` = "rozwiazanie1";



