drop schema if exists  CSECU; 
CREATE SCHEMA CSECU;
USE CSECU;

CREATE TABLE IF NOT EXISTS Book1 (
    user_id INT,
    name VARCHAR(30),
    email VARCHAR(50),
    phone_number VARCHAR(15),  
    password VARCHAR(255),    
    role VARCHAR(10),
    club_id INT,
    club_name VARCHAR(25),
    description VARCHAR(255), 
    creation_date DATETIME,
    resource_id INT,  
    title VARCHAR(30),
    type VARCHAR(20),
    upload_date1 DATETIME,
	file_path VARCHAR(255),
    report_id INT,
    report_type VARCHAR(10),
    generated_date DATETIME,
    content VARCHAR(255),     
    event_id INT,
    event_name VARCHAR(30),
    event_date DATETIME,      
    event_description VARCHAR(255), 
    location VARCHAR(50),
    feedback_id INT,
    feedback_content VARCHAR(255), 
    feedback_date DATETIME
);

INSERT INTO `Book1` VALUES (1,'Rudra Pratap Deb Nath','rudra@cu.ac.bd',880127878,'p123','Admin',NULL,NULL,NULL,NULL,1,'LateX workshop presentation','presentation','2024-06-02 00:00:00','https://www.colorado.edu/aps/sites/default/files/attached-files/latex_primer.pdf',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'IT Faculty,University Of Chittagong',NULL,NULL,NULL),
	(22701015,'Md. Ibrahim Ali','ibrahimcsecu@gmail.com',1733438430,'e132','Member',1,'ACM','A club for programmer','2024-01-01 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,'IT Fest','2024-12-12 00:00:00',NULL,'IT Faculty,University Of Chittagong',NULL,NULL,NULL),
	(22701017,'Arafat Sheikh','arafat.csecu@gmail.com',1718916147,'13e','Member',2,'Data Science Club','A club for data science','2023-01-15 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'CSE Fest','2024-12-12 00:00:00',NULL,'IT Faculty,University Of Chittagong',1,'about workshop','2024-11-11 00:00:00');


