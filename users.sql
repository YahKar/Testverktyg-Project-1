CREATE database usersdb;
USE usersdb;
CREATE table users (
    id INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Nickname VARCHAR(255) NOT NULL,
    Age INT NOT NULL,
    Bio VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO users(Name, Nickname, Age, Bio)
VALUES 
("Chama", "Chachou", 33, "Python"),
("Ratnasri", "Ratna", 34, "JavaScript"),
("Shreelakshmi", "Shree", 31, "HTML"),
("Hifza", "Hif", 30, "CSS");
