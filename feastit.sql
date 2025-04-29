-- Drop and recreate the database
DROP DATABASE IF EXISTS feastit;
CREATE DATABASE feastit;
USE feastit;

-- Customers Table
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL UNIQUE,
    customer_password VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(15),
    customer_address TEXT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE customers AUTO_INCREMENT = 5001;

-- Admin Users Table
CREATE TABLE admin_user (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    admin_name VARCHAR(100) NOT NULL,
    admin_email VARCHAR(100) NOT NULL UNIQUE,
    admin_password VARCHAR(255) NOT NULL,
    admin_role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE admin_user AUTO_INCREMENT = 15001;

-- Vendors Table
CREATE TABLE vendors (
    vendor_id INT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_email VARCHAR(255) NOT NULL UNIQUE,
    vendor_phone VARCHAR(15),
    vendor_password VARCHAR(255) NOT NULL,
    vendor_description TEXT,
    vendor_taxId VARCHAR(50),
    vendor_address TEXT,
    vendor_status VARCHAR(20) DEFAULT 'pending',
    vendor_rejectedmessage TEXT,
    business_hours VARCHAR(100),
    registration_cert VARCHAR(255),
    supporting_docs VARCHAR(255),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE vendors AUTO_INCREMENT = 10001;

-- Menu Items Table
CREATE TABLE menu_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    item_name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    price DECIMAL(10,2),
    availability BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    customer_id INT,
    total_amount DECIMAL(10,2),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_status ENUM('pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    delivery_address TEXT,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

ALTER TABLE orders AUTO_INCREMENT = 20001;

-- Order Items Table
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    item_id INT,
    quantity INT,
    price DECIMAL(10,2),
    has_offer BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE SET NULL
);

-- Customer Reviews Table
CREATE TABLE customer_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    vendor_id INT,
    rating DECIMAL(2,1) CHECK (rating BETWEEN 1.0 AND 5.0),
    comments TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE
);

-- Order Status History Table
CREATE TABLE order_status_history (
    status_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    status ENUM('pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled') NOT NULL,
    status_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Vendor Review Queue Table
CREATE TABLE vendor_review_queue (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    reviewed_by INT,
    status ENUM('approved', 'rejected', 'pending') DEFAULT 'pending',
    reason TEXT,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id),
    FOREIGN KEY (reviewed_by) REFERENCES admin_user(admin_id)
);

-- Customer Feedback Reports Table
CREATE TABLE customer_feedback_reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    message TEXT,
    status ENUM('open', 'in_progress', 'resolved') DEFAULT 'open',
    admin_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (admin_id) REFERENCES admin_user(admin_id)
);

-- Vendor Feedback Reports Table
CREATE TABLE vendor_feedback_reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    message TEXT,
    status ENUM('open', 'in_progress', 'resolved') DEFAULT 'open',
    admin_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id),
    FOREIGN KEY (admin_id) REFERENCES admin_user(admin_id)
);

-- Analytics Summary Table
CREATE TABLE analytics_summary (
    date DATE PRIMARY KEY,
    total_orders INT DEFAULT 0,
    total_customers INT DEFAULT 0,
    total_vendors INT DEFAULT 0,
    active_offers INT DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0.00
);

-- Customer

INSERT INTO customers (customer_name, customer_email, customer_password, customer_phone, customer_address) VALUES
('Emily Carter', 'emily.carter@example.com', 'password123', '5551234567', '123 Maple Street, Springfield'),
('Liam Johnson', 'liam.johnson@example.com', 'securepass', '5552345678', '456 Oak Avenue, Lakeside'),
('Sophia Williams', 'sophia.williams@example.com', 'sophia@123', '5553456789', '789 Pine Road, Brookfield'),
('Noah Davis', 'noah.davis@example.com', 'ndavispass', '5554567890', '321 Birch Lane, Riverdale'),
('Ava Brown', 'ava.brown@example.com', 'ava2024', '5555678901', '654 Cedar Street, Greenfield'),
('Olivia Martin', 'olivia.martin@example.com', 'oliviapass', '5556789012', '87 Maple St, Hilltown'),
('Ethan Moore', 'ethan.moore@example.com', 'ethansecure', '5557890123', '22 Elm Ave, Stonebridge'),
('Mia Clark', 'mia.clark@example.com', 'miapass99', '5558901234', '99 Cherry Blvd, Ridgeway'),
('James Lewis', 'james.lewis@example.com', 'jameskey', '5559012345', '71 Forest Dr, Lakeview'),
('Isabella Walker', 'isabella.walker@example.com', 'isapass', '5550123456', '33 Garden Ln, Meadowbrook'),
('Aditya VVS', 'adityavvs@example.com', 'adityavvspass', '9998888777', '3000 Northside Blvd');


-- Admin Users
INSERT INTO admin_user (admin_name, admin_email, admin_password, admin_role) VALUES
('Sara Thompson', 'sara.thompson@feastit.com', 'adminpass1', 'super_admin'),
('John Reyes', 'john.reyes@feastit.com', 'adminpass2', 'moderator');



-- INSERTS OF VENDOR DETAILS
INSERT INTO vendors (
    business_name, vendor_name, vendor_email, vendor_phone, vendor_password,
    vendor_description, vendor_taxId, vendor_address, business_hours,
    vendor_status, registration_cert, supporting_docs
) VALUES
('Frozen Delights', 'Sarah Williams', 'frozendelights@gmail.com', '(214) 555-1001', 'defaultpass1', 'Vegan and non-dairy frozen desserts.', 'GST001', '500 Ice Cream Blvd, Dallas, TX', '10 AM - 10 PM', 'approved', NULL, NULL),
('Burger Delight', 'Michael Johnson', 'burgerdelight@gmail.com', '(214) 555-1002', 'defaultpass2', 'Healthy and gourmet burger options.', 'GST002', '1201 Burger St, Dallas, TX', '10 AM - 10 PM', 'approved', NULL, NULL),
('Fresh Pressed Juices', 'Emma Roberts', 'freshjuices@gmail.com', '(469) 555-2003', 'defaultpass3', 'Organic, cold-pressed juices.', 'GST003', '450 Juice Ave, Dallas, TX', '8 AM - 10 PM', 'approved', NULL, NULL),
('Lunch Box Bowls', 'David Smith', 'lunchboxbowls@gmail.com', '(214) 555-3004', 'defaultpass4', 'Nutritious and customizable rice bowls.', 'GST004', '789 Healthy St, Dallas, TX', '11 AM - 10 PM', 'approved', NULL, NULL),
('Seoul Kitchen', 'Kevin Park', 'seoulkitchen@gmail.com', '(469) 555-5005', 'defaultpass5', 'Authentic Korean street food.', 'GST005', '102 Bibimbap Ln, Dallas, TX', '11 AM - 11 PM', 'approved', NULL, NULL),
('Arabian Bites', 'Layla Ahmed', 'arabianbites@gmail.com', '(214) 555-6006', 'defaultpass6', 'Traditional Middle Eastern cuisine.', 'GST006', '305 Shawarma Rd, Dallas, TX', '12 PM - 10 PM', 'approved', NULL, NULL),
('Thai Street Bites', 'Somchai Wong', 'thaistreetbites@gmail.com', '(469) 555-7007', 'defaultpass7', 'Authentic Thai flavors in street-style dishes.', 'GST007', '987 Pad Thai Blvd, Dallas, TX', '11 AM - 10 PM', 'approved', NULL, NULL),
('Classic Italian Pasta', 'Antonio Rossi', 'classicitalianpasta@gmail.com', '(469) 555-8008', 'defaultpass8', 'Handmade pasta with authentic Italian flavors.', 'GST008', '215 Roma St, Dallas, TX', '12 PM - 10 PM', 'approved', NULL, NULL),
('The Pickle Pantry', 'Nancy Cooper', 'picklepantry@gmail.com', '(469) 555-2222', 'defaultpass9', 'Homemade pickles and fermented delicacies.', 'GST009', '444 Pickle St, Dallas, TX', '10 AM - 8 PM', 'approved', NULL, NULL),
('The Sweet Crust Bakery', 'Susan Baker', 'sweetcrustbakery@gmail.com', '(214) 555-1919', 'defaultpass10', 'Handcrafted pastries and fresh-baked bread.', 'GST010', '777 Bakery Ave, Dallas, TX', '9 AM - 9 PM', 'approved', NULL, NULL);



-- MENU_ITEMS
INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(10001, 'Vegan Mango Sorbet', 'Mango sorbet made with natural sweeteners.', 'Vegan', 4.99, TRUE),
(10001, 'Vegan Raspberry Lemon Sorbet', 'Raspberry lemon sorbet made with fresh fruit.', 'Vegan', 5.49, TRUE),
(10001, 'Non-Dairy Salted Caramel Swirl', 'Almond milk-based ice cream with caramel.', 'Vegan', 5.99, TRUE),
(10001, 'Vegan Coconut Milk Chocolate Chip', 'Coconut milk ice cream with chocolate chips.', 'Vegan', 5.25, TRUE),
(10001, 'Strawberry Cheesecake Ice Cream', 'Cheesecake flavored ice cream with strawberries.', 'Non-Vegan', 6.00, TRUE),
(10001, 'Vegan Chocolate Peanut Butter Swirl', 'Vegan ice cream with chocolate and peanut butter.', 'Vegan', 5.75, TRUE),
(10001, 'Gluten-Free Cookies & Cream', 'Vanilla ice cream with gluten-free cookies.', 'Non-Vegan', 5.50, TRUE);
INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(10002, 'Vegan BBQ Chickpea Burger', 'BBQ-marinated chickpeas with avocado and pickles on gluten-free bun.', 'Vegan', 8.49, TRUE),
(10002, 'Grilled Chicken & Avocado Burger', 'Grilled chicken, avocado, spinach, tomato on whole-grain bun.', 'Non-Vegan', 9.99, TRUE),
(10002, 'Gluten-Free Veggie Burger', 'Veggie patty with lettuce, avocado and vegan mayo on GF bun.', 'Vegan', 8.75, TRUE),
(10002, 'Healthy Chicken & Veggie Burger', 'Lean chicken patty with vegetables and mustard dressing.', 'Non-Vegan', 9.25, TRUE),
(10002, 'Sweet Potato & Black Bean Burger', 'Savory patty with sweet potato, black beans, salsa.', 'Vegan', 8.99, TRUE),
(10002, 'Vegan Mushroom & Avocado Burger', 'Grilled mushroom cap with creamy avocado on gluten-free bun.', 'Vegan', 8.50, TRUE);

INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(10003, 'Green Power Detox Juice', 'Kale, spinach, cucumber, apple, lemon, and ginger blend.', 'Vegan', 4.50, TRUE),
(10003, 'Tropical Immunity Boost Juice', 'Pineapple, orange, mango, and turmeric blend.', 'Vegan', 4.75, TRUE),
(10003, 'Carrot Ginger Glow Juice', 'Carrots, ginger, lemon juice combo.', 'Vegan', 4.25, TRUE),
(10003, 'Beetroot & Apple Energizer', 'Beetroot, apple, and lemon mix.', 'Vegan', 4.25, TRUE),
(10003, 'Cucumber Mint Refresher', 'Cucumber, mint, lime juice.', 'Vegan', 4.00, TRUE),
(10003, 'Pineapple & Coconut Hydration', 'Pineapple and coconut water blend.', 'Vegan', 4.75, TRUE),
(10003, 'Watermelon & Basil Cooler', 'Watermelon, basil, lime.', 'Vegan', 4.25, TRUE),
(10003, 'Apple Celery Green Juice', 'Apple, celery, spinach, lemon.', 'Vegan', 4.50, TRUE),
(10003, 'Citrus Sunrise Juice', 'Orange, grapefruit, lemon.', 'Vegan', 4.60, TRUE),
(10003, 'Ginger Lemonade Boost', 'Ginger, lemon, honey optional.', 'Vegan', 4.40, TRUE);

INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(10004, 'Vegan Sweet Potato & Chickpea Rice Bowl', 'Rice with roasted sweet potatoes, chickpeas, avocado, and tahini.', 'Vegan', 9.99, TRUE),
(10004, 'Grilled Chicken Teriyaki Rice Bowl', 'Grilled chicken over jasmine rice with sautéed vegetables.', 'Non-Vegan', 10.49, TRUE),
(10004, 'Spicy Tofu & Veggie Rice Bowl', 'Crispy tofu with bell peppers, onions, broccoli, and spicy sauce.', 'Vegan', 9.49, TRUE),
(10004, 'Grilled Salmon & Avocado Rice Bowl', 'Grilled salmon with avocado, cucumber, and soy-sesame dressing.', 'Non-Vegan', 11.49, TRUE),
(10004, 'Vegan Buddha Rice Bowl', 'Quinoa, roasted vegetables, avocado, chickpeas, lemon-tahini dressing.', 'Vegan', 10.99, TRUE),
(10004, 'Lemon Herb Chicken & Brown Rice Bowl', 'Chicken breast with brown rice and lemon dressing.', 'Non-Vegan', 10.75, TRUE),
(10004, 'Vegan Cauliflower & Lentil Rice Bowl', 'Cauliflower, lentils, spinach, and turmeric dressing over rice.', 'Vegan', 9.75, TRUE);

INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(10005, 'Bibimbap (Chicken or Tofu)', 'Mixed rice bowl with vegetables, protein, fried egg, and gochujang.', 'Mixed', 11.49, TRUE),
(10005, 'Kimchi Fried Rice', 'Stir-fried rice with kimchi and egg.', 'Non-Vegan', 9.99, TRUE),
(10005, 'Japchae (Glass Noodles)', 'Sweet potato noodles stir-fried with vegetables and soy.', 'Vegan', 9.50, TRUE),
(10005, 'Tteokbokki', 'Spicy Korean rice cakes in gochujang sauce.', 'Vegan', 8.75, TRUE),
(10005, 'Korean Fried Chicken', 'Double-fried chicken with spicy Korean glaze.', 'Non-Vegan', 10.99, TRUE),
(10005, 'Hotteok', 'Sweet pancakes with brown sugar, cinnamon, and peanuts.', 'Vegetarian', 6.25, TRUE);

INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(10006, 'Falafel Wrap', 'Falafel in pita with tahini sauce.', 'Vegan', 8.49, FALSE),
(10006, 'Shawarma Platter', 'Chicken or beef shawarma with rice and salad.', 'Non-Vegan', 9.99, TRUE),
(10006, 'Hummus & Pita', 'Creamy chickpea hummus with warm pita.', 'Vegan', 6.50, TRUE),
(10006, 'Lentil Soup', 'Spiced lentil soup with lemon.', 'Vegan', 5.25, TRUE),
(10006, 'Baklava (Walnut & Honey)', 'Walnut-stuffed pastry with honey syrup.', 'Vegetarian', 5.99, TRUE),
(10006, 'Stuffed Grape Leaves', 'Grape leaves filled with herbed rice.', 'Vegan', 6.25, TRUE);

INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(10007, 'Pad Thai', 'Rice noodles with vegetables and choice of protein.', 'Mixed', 10.49, TRUE),
(10007, 'Som Tum', 'Green papaya salad with chili-lime dressing.', 'Vegan', 6.75, TRUE),
(10007, 'Tom Yum Soup', 'Spicy-sour shrimp soup with lemongrass and lime leaves.', 'Non-Vegan', 9.25, TRUE),
(10007, 'Mango Sticky Rice', 'Sticky rice with mango and coconut milk.', 'Vegan', 7.49, TRUE),
(10007, 'Thai Basil Chicken', 'Stir-fried chicken with basil and chili.', 'Non-Vegan', 9.99, TRUE),
(10007, 'Vegetable Spring Rolls', 'Fried spring rolls with sweet chili sauce.', 'Vegan', 6.25, TRUE);


INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(10008, 'Garlic Bread with Cheese', 'Garlic butter toast topped with mozzarella.', 'Vegetarian', 4.50, TRUE),
(10008, 'Spicy Chicken Wings', 'Wings marinated in spicy Italian herbs.', 'Non-Vegan', 6.99, TRUE),
(10008, 'Bruschetta Italiano', 'Toasted bread with tomatoes, garlic, and basil.', 'Vegetarian', 5.25, TRUE),
(10008, 'Creamy Alfredo Pasta', 'Butter, garlic, cream, and parmesan with pasta.', 'Vegetarian', 11.25, TRUE),
(10008, 'Classic Chicken Bolognese', 'Chicken ragu over spaghetti.', 'Non-Vegan', 11.75, TRUE),
(10008, 'Pesto Primavera Pasta', 'Basil pesto with sautéed veggies and spaghetti.', 'Vegetarian', 10.99, TRUE),
(10008, 'Spicy Garlic Shrimp Pasta', 'Shrimp tossed in garlic butter and herbs.', 'Non-Vegan', 12.25, TRUE),
(10008, 'Chocolate Lava Cake', 'Molten chocolate cake with vanilla ice cream.', 'Non-Vegan', 6.99, TRUE);


INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(10009, 'Spicy Mango Pickle (Indian Style)', 'Mango pickle with mustard oil and Indian spices.', 'Vegan', 3.25, TRUE),
(10009, 'Korean Kimchi', 'Fermented napa cabbage with garlic and gochujang.', 'Vegan', 3.50, TRUE),
(10009, 'Garlic Dill Pickles', 'Cucumbers pickled with garlic and dill.', 'Vegan', 3.00, TRUE),
(10009, 'Carrot and Radish Pickle', 'Indian-style pickle with carrots and radishes.', 'Vegan', 3.25, TRUE),
(10009, 'Sweet and Sour Pineapple Pickle', 'Pineapple chunks pickled in sugar and vinegar.', 'Vegan', 3.50, TRUE),
(10009, 'Non-Vegan Fish Pickle (Kerala Style)', 'South Indian fish pickle with mustard oil.', 'Non-Vegan', 4.50, TRUE),
(10009, 'Chili Lemon Pickle', 'Lemon and chili pickle with mustard seeds.', 'Vegan', 3.25, TRUE),
(10009, 'Turmeric Ginger Pickle', 'Pickle made with ginger, turmeric, and spices.', 'Vegan', 3.25, TRUE),
(10009, 'Pickled Beets with Balsamic Vinegar', 'Beets pickled in balsamic with thyme.', 'Vegan', 3.75, TRUE),
(10009, 'Spicy Tomato Chutney', 'Tomato chutney with chili and tamarind.', 'Vegan', 3.50, TRUE);

INSERT INTO menu_items (vendor_id, item_name, description, category, price, availability) VALUES
(10010, 'Classic Apple Pie', 'Spiced apples in a flaky buttery crust.', 'Vegetarian', 5.99, TRUE),
(10010, 'Vegan Chocolate Fudge Cake', 'Moist vegan chocolate cake with ganache.', 'Vegan', 6.50, TRUE),
(10010, 'Chicken and Mushroom Pot Pie', 'Savory pie with chicken and mushrooms.', 'Non-Vegan', 6.99, TRUE),
(10010, 'Lemon and Almond Cake', 'Lemon cake with almond flour.', 'Vegan', 6.25, TRUE),
(10010, 'Chocolate Chip Cookies', 'Classic chewy cookies with chocolate chips.', 'Vegetarian', 4.50, TRUE),
(10010, 'Sugar-Free Banana Bread', 'Naturally sweetened banana bread.', 'Vegan', 5.75, TRUE),
(10010, 'Pecan Pie', 'Pie with roasted pecans and buttery filling.', 'Vegetarian', 6.25, TRUE);

-- Orders
INSERT INTO orders (vendor_id, customer_id, total_amount, order_status, delivery_address)
VALUES
(10001, 5001, 11.98, 'confirmed', '123 Maple Street, Dallas, TX 75254'),
(10002, 5002, 6.49, 'preparing', '456 Oak Avenue, Frisco, TX 75035'),
(10003, 5003, 6.99, 'delivered', '2501 Preston Rd, Frisco, TX 75034'),
(10004, 5004, 3.49, 'pending', '6001 Summerside Dr, Dallas, TX 75252'),
(10005, 5005, 5.99, 'delivered', '3000 Independence Pkwy, Plano, TX 75075' ),
(10006, 5006, 5.49, 'confirmed', '1200 E Collins Blvd, Richardson, TX 75081' ),
(10007, 5007, 8.49, 'cancelled', '789 Legacy Dr, Frisco, TX 75034'),
(10008, 5008, 4.99, 'confirmed', '4555 Belt Line Rd, Dallas, TX 75254'),
(10009, 5009, 7.99, 'preparing', '2305 Coit Rd, Plano, TX 75075'),
(10010, 5010, 6.49, 'delivered', '150 W Campbell Rd, Richardson, TX 75080');

-- Order Items
INSERT INTO order_items (order_id, item_id, quantity, price, has_offer)
VALUES
(20001, 1, 2, 5.99, FALSE),
(20002, 2, 1, 6.49, TRUE),
(20003, 3, 1, 6.99, FALSE),
(20004, 4, 1, 3.49, TRUE),
(20005, 5, 1, 5.99, TRUE),
(20006, 6, 1, 5.49, TRUE),
(20007, 7, 1, 8.49, FALSE),
(20008, 8, 1, 4.99, FALSE),
(20009, 9, 1, 7.99, TRUE),
(20010, 10, 1, 6.49, FALSE);

INSERT INTO vendor_review_queue (vendor_id, reviewed_by, status, reason)
VALUES
(10001, 15001, 'approved', 'All documents verified.'),
(10002, 15002, 'rejected', 'Missing business license.'),
(10003, 15001, 'approved', 'Verified successfully.'),
(10004, 15002, 'pending', NULL),
(10005, 15001, 'approved', 'Compliant with regulations.'),
(10006, 15002, 'rejected', 'Expired health certificate.'),
(10007, 15001, 'approved', 'Review passed.'),
(10008, 15002, 'pending', NULL),
(10009, 15001, 'approved', 'All set for approval.');

INSERT INTO customer_feedback_reports (customer_id, message, status, admin_id)
VALUES
(5001, 'App crashed during payment.', 'resolved', 15001),
(5002, 'Late delivery issue.', 'in_progress', 15002),
(5003, 'Unable to apply coupon.', 'open', 15001),
(5004, 'Received wrong order.', 'resolved', 15002),
(5005, 'Refund not processed.', 'open', 15001),
(5006, 'Payment deducted twice.', 'in_progress', 15002),
(5007, 'Tracking not updating.', 'resolved', 15001),
(5008, 'Profile update failed.', 'open', 15002),
(5009, 'Order cancelled automatically.', 'resolved', 15001);

INSERT INTO vendor_feedback_reports (vendor_id, message, status, admin_id)
VALUES
(10001, 'Unable to update menu.', 'resolved', 15001),
(10002, 'Payout delayed.', 'in_progress', 15002),
(10003, 'Order notifications not received.', 'open', 15001),
(10004, 'Analytics dashboard error.', 'resolved', 15002),
(10005, 'Offer not applying.', 'open', 15001),
(10006, 'Profile verification pending too long.', 'in_progress', 15002),
(10007, 'Wrong commission applied.', 'resolved', 15001),
(10008, 'Bank details update issue.', 'open', 15002);

INSERT INTO analytics_summary (date, total_orders, total_customers, total_vendors, active_offers, revenue_generated)
VALUES
('2024-03-20', 120, 300, 25, 8, 2450.75),
('2024-03-21', 130, 305, 25, 9, 2600.50),
('2024-03-22', 110, 310, 26, 7, 2300.00),
('2024-03-23', 140, 315, 26, 10, 2755.20),
('2024-03-24', 125, 320, 27, 8, 2501.60),
('2024-03-25', 135, 325, 27, 9, 2680.40),
('2024-03-26', 150, 330, 28, 11, 2900.90),
('2024-03-27', 145, 335, 28, 10, 2855.30),
('2024-03-28', 130, 340, 28, 9, 2602.45),
('2024-03-29', 120, 345, 28, 8, 2455.75),
('2024-03-30', 155, 350, 29, 12, 3001.80),
('2024-03-31', 160, 355, 29, 13, 3100.00),
('2024-04-01', 170, 360, 29, 14, 3250.25),
('2024-04-02', 165, 365, 29, 13, 3185.50),
('2024-04-03', 150, 370, 30, 12, 2900.75),
('2024-04-04', 140, 375, 30, 11, 2750.60),
('2024-04-05', 135, 380, 30, 10, 2685.40),
('2024-04-06', 145, 385, 30, 11, 2820.00),
('2024-04-07', 155, 390, 30, 12, 2980.90),
('2024-04-08', 160, 395, 30, 14, 3105.75);
