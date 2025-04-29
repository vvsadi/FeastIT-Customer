INSERT INTO VENDOR (VENDOR_NAME, EMAIL, VENDOR_PASSWORD,
	PHONE_NUMBER, VENDOR_ADDRESS, REGISTRATION_DATE) VALUES ('Lunch Box Bowls','lunchboxbowls@feastit.com','lunchboxbowls1',1111111111,'3000 Northside Blvd','4/6/2025');
	
INSERT INTO VENDOR (VENDOR_NAME, EMAIL, VENDOR_PASSWORD,
	PHONE_NUMBER, VENDOR_ADDRESS, REGISTRATION_DATE) 
	VALUES 
	('Frozen Delights','frozendelights@feastit.com','frozendelights',2222222222,'3000 Northside Blvd','4/6/2025'),
	('Burger Delight','burgerdelight@feastit.com','burgerdelight',3333333333,'4000 Northside Blvd','4/6/2025');

ALTER TABLE VENDOR
ALTER COLUMN PHONE_NUMBER BIGINT

SELECT * FROM VENDOR

