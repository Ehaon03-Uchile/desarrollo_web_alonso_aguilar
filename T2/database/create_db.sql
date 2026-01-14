-- Active: 1757859900274@@127.0.0.1@3306@bekho
CREATE DATABASE if NOT EXISTS bekho DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

GRANT ALL ON bekho.* TO root@localhost;

USE `bekho`;

-- DROP TABLE estudents_data;
-- DROP TABLE apoderado;
-- DROP TABLE federative_data;
-- DROP TABLE extra;

CREATE TABLE estudents_data(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    rut VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL, 
    lastname VARCHAR(255) NOT NULL,
    birth_date VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL
);

CREATE TABLE apoderado(
    name_apoderado VARCHAR(255), 
    lastname_apoderado VARCHAR(255), 
    rut_apoderado VARCHAR(255), 
    estudent_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (estudent_id) REFERENCES estudents_data(id) ON DELETE CASCADE
);

CREATE TABLE federative_data(
    regular_program VARCHAR(255) NOT NULL,
    special_program VARCHAR(255) NOT NULL,
    cint VARCHAR(255) NOT NULL,
    midterm VARCHAR(255),
    ata_num INT NOT NULL,
    bekho_num INT NOT NULL,
    belt_size VARCHAR(255) NOT NULL,
    estudent_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (estudent_id) REFERENCES estudents_data(id) ON DELETE CASCADE    
);

CREATE TABLE extra (
    social_media VARCHAR(255) NOT NULL,
    img VARCHAR(255) NOT NULL,
    estudent_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (estudent_id) REFERENCES estudents_data(id) ON DELETE CASCADE
);