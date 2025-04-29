import mysql.connector
import os
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify,request, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request, get_jwt
import json

load_dotenv(dotenv_path='./.env')

db = Flask(__name__)
CORS(db, supports_credentials=True, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# JWT Configuration
db.config['JWT_SECRET_KEY'] = 'DCP_FeastIT_Secret_key'
db.config['JWT_TOKEN_LOCATION'] = ['cookies']  # Accept JWT from cookies
db.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token'  # Optional if you're using 'access_token'
db.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Turn off CSRF for testing in Postman (only for dev)
jwt = JWTManager(db)

user_carts = {}
user_wishlist = {}

def get_db_connection():
    try:
        db_host = os.getenv('DB_HOST')
        db_database = os.getenv('DB_NAME')
        db_password = os.getenv('DB_PASSWORD')
        db_user = os.getenv('DB_USER')
        print(db_host)  # Check if DB_HOST is loaded correctly
        print(db_database)  # Check if DB_NAME is loaded correctly
        print(db_user)  # Check if DB_USER is loaded correctly
        print(db_password)  # Check if DB_PASSWORD is loaded correctly
        conn = mysql.connector.connect(
            host = db_host,
            database = db_database,
            user = db_user,
            password = db_password
        )
        return conn
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None

def initialize_database():
    try:
        conn = get_db_connection()
        if not conn:
            print("Failed to connect to the Database for initialization")
            return False
        cursor = conn.cursor()

        # Initialize Vendor Table
        cursor.execute("SELECT COUNT(*) FROM VENDORS")
        vendor_count = cursor.fetchone()[0]
        print("Total Vendors = ",vendor_count)
        if vendor_count == 0:
            cursor.execute("""
                           INSERT INTO vendors (business_name, email, password, phone_number, address, is_approved, document)
                           VALUES 
                           ('Lunch Box Bowls', 'lunchboxbowls@feastit.com', 'lunchboxbowls', '5551000001', '1 Chicken Way, Lewisville', TRUE, 'lunchboxbowls_license.pdf'),
                           ('Frozen Delights', 'frozendelights@feastit.com', 'frozendelights', '4441000002', '2 Frozen Way, Plano', TRUE, 'frozendelights_license.pdf')
                           """)
        cursor.execute("""
                       SELECT * FROM VENDORS""")
        print("All vendors: ")
        print(cursor.fetchall())

        conn.commit()
        cursor.close()
        conn.close()

        print("Database initialized successfully")
        return True
    except Exception as e:
        print("Error in initializing database: ",e)
        return False

#email = 'noah.davis@example.com'
#password = 'ndavispass'

def verify_user_credentials(email,password):
    conn = get_db_connection()
    if not conn:
        return None
    cursor = conn.cursor()
    try:
        query = "SELECT * FROM customers WHERE customer_email = %s AND customer_password = %s"
        cursor.execute(query,(email,password))
        row = cursor.fetchone()
        if row:
            columns = [col[0] for col in cursor.description]
            user = dict(zip(columns,row))
            user_name = user['customer_name']
            print(user)
            print(user_name)
            return True, user
        else:
            print("Invalid credentials!!")
            user_name = 'User not found'
            return False,None
    except Exception as e:
        print("Exception: ",e)
    finally:
        cursor.close()
        conn.close()

@db.route('/api/login',methods=['POST'])
def customer_login():
    data = request.get_json()  # Data packet containing Username and Password is received from the sign in form
    email = data.get('username')
    password = data.get('password')
    correct_credentials,user = verify_user_credentials(email,password)
    if correct_credentials is True:
        #user_identity = {
            #'user_id': str(user['customer_id']),
            #'user_name': user['customer_name'],
            #'user_address': user['address']
        #}
        user_identity = str(user['customer_id'])
        print("JWT Identity:", user_identity)
        print("Claims:", {
        'user_name': str(user.get('customer_name', '')),
        'user_address': str(user.get('customer_address', ''))
        })
        access_token = create_access_token(identity=user_identity,additional_claims={
            'user_name':str(user['customer_name']),
            'user_address':str(user['customer_address'])
        })
        response = make_response(jsonify({'message':'Login Successful!','user_name':user['customer_name'],'user_id':user['customer_id'],'user_address':user['customer_address']}))
        response.set_cookie("access_token",access_token,httponly=True,samesite='Lax',secure=False) # Secure HTTP only cookie
        return response
    else:
        return jsonify({'message':'Invalid credentials!! Please try again!!', 'user_name':user}),401
    
@db.route('/api/protected',methods=['GET'])
@jwt_required(optional=True) # Requires a valid JWT from the cookie
def protected_route():
    print("🍪 Incoming cookies: ", request.cookies)
    #current_user = get_jwt_identity()  # Retrieve identity from the token
    #return jsonify(logged_in_as=current_user),200
    current_user = get_jwt_identity()
    claims = get_jwt()
    print("current_user: ",current_user)
    print("Request cookies: ",request.cookies)
    if current_user:
        #user_id = int(user_id)
        #conn = get_db_connection()
        #cursor = conn.cursor(dictionary=True)
        #cursor.execute("SELECT customer_id, customer_name, address from customers WHERE customer_id = %s",int((user_id,)))
        #current_user = cursor.fetchone()
        return jsonify(logged_in_as={
            'user_id':current_user,
            'user_name':claims.get('user_name'),
            'user_address':claims.get('user_address')
            }),200
    return jsonify(logged_in_as=None)
    

@db.route('/api/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"message": "Logout successful"}))
    response.delete_cookie("access_token")  # Delete the cookie on logout
    return response, 200

@db.route('/api/signup',methods=['POST'])
def add_new_customer():
    try:
        data = request.get_json()
        customer_name = data.get('customer_name')
        customer_email = data.get('customer_email')
        customer_password = data.get('customer_password')
        customer_phone = data.get('customer_phone')
        customer_address = data.get('customer_address')
        new_user = {'customer_name':customer_name,'customer_email':customer_email,'customer_password':customer_password,'customer_phone':customer_phone,'customer_address':customer_address}
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM customers WHERE email = %s",(customer_email,))
        existing = cursor.fetchone()
        if existing:
            return jsonify({'message':'User already exists'}),409

        cursor.execute("""INSERT INTO customers (customer_name, customer_email, customer_password, customer_phone, customer_address) VALUES
                       (%s,%s,%s,%s,%s)""",(customer_name,customer_email,customer_password,customer_phone,customer_address))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message':"New user created successfully",'new_user':new_user}),201
    except Exception as e:
        return jsonify({'message':'Error creating new user'}),500

@db.route('/api/restaurants',methods=['GET'])
def get_all_restaurants():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM VENDORS")
    vendors = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(vendors)

@db.route('/api/menu/<int:vendor_id>',methods=['GET'])
def get_menu_items(vendor_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM menu_items WHERE vendor_id = %s",(vendor_id,))
    items = cursor.fetchall()
    cursor.execute("SELECT * FROM vendors WHERE vendor_id = %s",(vendor_id,))
    vendor = cursor.fetchone()
    #Append the business_name to the final returned json dictionary
    cursor.close()
    conn.close()
    business_name = vendor["business_name"] if vendor else "Unknown Vendor"
    vendor_address = vendor["vendor_address"] if vendor else "Unknown Address"
    for item in items:
        item["business_name"] = business_name
        item["vendor_address"] = vendor_address
    return jsonify(items)

@db.route('/api/menu/search',methods=['GET'])
def search_menu_items():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = request.args.get('q','').lower()
        search_query = f"%{query}%"
        cursor.execute("SELECT * FROM menu_items WHERE item_name LIKE %s",(search_query,))
        items = cursor.fetchall()
        # Fetch vendor names
        for item in items:
            cursor.execute("SELECT * FROM vendors WHERE vendor_id = %s",(item['vendor_id'],))
            vendor = cursor.fetchone()
            item['business_name'] = vendor['business_name'] if vendor else "Unknown Business"
            item['vendor_address'] = vendor['vendor_address'] if vendor else "Unknown Address"
        cursor.close()
        conn.close()
        return jsonify(items)
    except Exception as e:
        return jsonify({'message': 'Unable to fetch the menu items','error': str(e)})
        
@db.route('/api/cart',methods=['POST'])
def add_to_cart():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        data = request.get_json()
        item_id = data.get('item_id')
        item_name = data.get('item_name')
        price = data.get('price')
        item_quantity = data.get('quantity')
        availability = data.get('availability')
        cursor.execute("SELECT vendor_id FROM menu_items WHERE item_id = %s",(item_id,))
        vendor_result = cursor.fetchone()
        vendor_id = vendor_result["vendor_id"] if vendor_result else None
        cursor.execute("SELECT business_name FROM vendors WHERE vendor_id = %s",(vendor_id,))
        business_result = cursor.fetchone()
        business_name = business_result["business_name"] if business_result else None
        item = {'item_id':item_id,'item_name':item_name,'price':price,'quantity':item_quantity, 'availability':availability, 'vendor_id':vendor_id,'business_name':business_name}
        #response = make_response(jsonify({'item_id':item_id,'item_name':item_name,'price':price,'vendor_id':vendor_id,'business_name':business_name}))
        
        try:
            verify_jwt_in_request()
            identity = get_jwt_identity()
            key = f"user_{identity}" if identity else f"guest_{data.get('guest_token')}"
        except Exception as e:
            key = f"guest_{data.get('guest_token')}"
        if key not in user_carts:
            user_carts[key] = []
        user_carts[key].append(item)
        cursor.close()
        conn.close()
        return jsonify({"message":"Item added","cart":user_carts[key]})
    except Exception as e:
        return jsonify({'message':'Error occured.'})
    
@db.route('/api/cart/<int:item_id>',methods=['DELETE'])
def remove_from_cart(item_id):
    guest_token = request.args.get('guest_token')
    try:
        verify_jwt_in_request()
        identity = get_jwt_identity()
        key = f"user_{identity}" if identity else f"guest_{guest_token}"
    except Exception as e:
        key = f"guest_{guest_token}"
    if key in user_carts:
        user_carts[key] = [item for item in user_carts[key] if item["item_id"]!=item_id]
    return jsonify({'message':f"Item with {item_id} is removed"})

@db.route('/api/cart/clear',methods=['DELETE'])
def clear_cart():
    guest_token = request.args.get('guest_token')
    try:
        verify_jwt_in_request()
        identity = get_jwt_identity()
        key = f"user_{identity}" if identity else f"guest_{guest_token}"
    except:
        key = f"guest_{guest_token}"
    user_carts[key] = []
    return jsonify({'message':'Cart is cleared'})

@db.route('/api/cart/user', methods=['GET'])
@jwt_required()
def get_user_cart():
    identity = get_jwt_identity()
    key = f"user_{identity}"
    if key in user_carts:
        return jsonify(user_carts[key])
    else:
        return jsonify([])

@db.route('/api/wishlist',methods=['POST'])
def add_to_wishlist():
    try:
        #conn = get_db_connection()
        #cursor = conn.cursor(dictionary=True)
        data = request.get_json()
        vendor_id = data.get('vendor_id')
        business_name = data.get('business_name')
        #cursor.execute("SELECT vendor_id FROM menu_items WHERE item_id = %s",(item_id,))
        #vendor_id = cursor.fetchall()
        #cursor.execute("SELECT business_name FROM vendors WHERE vendor_id = %s",(vendor_id,))
        #business_name = cursor.fetchall()
        vendor = {'vendor_id':vendor_id,'business_name':business_name}
        #response = make_response(jsonify({'item_id':item_id,'item_name':item_name,'price':price,'vendor_id':vendor_id,'business_name':business_name}))
        #verify_jwt_in_request_optional()
        identity = get_jwt_identity()
        key = f"user_{identity}"
        if key not in user_wishlist:
            user_wishlist[key] = []
        vendor_exists = False
        for w in user_wishlist[key]:
            if w['vendor_id'] == vendor_id:
                vendor_exists = True
                break
        if not vendor_exists:
            user_wishlist[key].append(vendor)
        #cursor.close()
        #conn.close()
        return jsonify({"message":"Vendor added","wishlist":user_wishlist[key]})
    except Exception as e:
        return jsonify({'message':'Error occured while adding to wishlist.'})
    
@db.route('/api/wishlist/<int:vendor_id>',methods=['DELETE'])
def remove_from_wishlist(vendor_id):
    #guest_token = request.args.get('guest_token')
    #verify_jwt_in_request_optional()
    identity = get_jwt_identity()
    key = f"user_{identity}"
    if key in user_wishlist:
        user_wishlist[key] = [vendor for vendor in user_wishlist[key] if vendor["vendor_id"]!=vendor_id]
    return jsonify({'message':f"Vendor with {vendor_id} is removed from wishlist"})

@db.route('/api/wishlist/clear',methods=['DELETE'])
def clear_wishlist():
    #guest_token = request.args.get('guest_token')
    #verify_jwt_in_request_optional()
    identity = get_jwt_identity()
    key = f"user_{identity}"
    user_wishlist[key] = []
    return jsonify({'message':'Wishlist is cleared'})

@db.route('/api/wishlist/user', methods=['GET'])
@jwt_required()
def get_user_wishlist():
    identity = get_jwt_identity()
    key = f"user_{identity}"
    wishlist = user_wishlist.get(key, [])
    return jsonify(wishlist)

@db.route('/api/orders',methods=['POST'])
@jwt_required()
def add_to_orders():
    identity = get_jwt_identity()
    customer_id = identity
    data = request.get_json()
    cart_items = data.get('cart_items',[])
    total_amount = float(data.get('total_amount',0))
    vendor_id = int(data.get('vendor_id'))
    delivery_address = data.get('delivery_address')
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""INSERT INTO orders (vendor_id, customer_id, total_amount, delivery_address) VALUES(
                       %s,%s,%s,%s)""", (vendor_id,customer_id,total_amount,delivery_address))
        order = {'vendor_id':vendor_id,'customer_id':customer_id,'total_amount':total_amount,'delivery_address':delivery_address}
        conn.commit()
        order_id = cursor.lastrowid
        for item in cart_items:
            item_id = item['item_id']
            quantity = item['quantity']
            price = float(item['price'])
            cursor.execute(""" INSERT INTO order_items (order_id, item_id, quantity, price) VALUES(
                       %s,%s,%s,%s)""", (order_id,item_id,quantity,price))
            conn.commit()
        order_status = "pending"
        cursor.execute("""INSERT INTO order_status_history (order_id,status) VALUES (%s,%s)""",(order_id,order_status))
        conn.commit()
        key = f"user_{identity}"
        if key in user_carts:
            user_carts[key] = []
        cursor.close()
        conn.close()
        return jsonify({"message":"Order placed successfully","order":order})
    except Exception as e:
        return jsonify({'message':'Error inserting new Order', 'error':str(e)}),500

@db.route('/api/deleteorder/<int:order_id>',methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    identity = get_jwt_identity()
    customer_id = identity
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        #cursor.execute("DELETE FROM order_items WHERE order_id = %s",(order_id,))
        cursor.execute("DELETE FROM order_status_history WHERE order_id = %s",(order_id,))
        cursor.execute("DELETE FROM orders WHERE customer_id = %s AND order_id = %s",(customer_id,order_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message':'Order deleted successfully'})
    except Exception as e:
        conn.rollback()
        return jsonify({'message':'Error deleting the order','error':str(e)})
    
@db.route('/api/showorders',methods=['GET'])
@jwt_required()
def show_orders():
    try:
        identity = get_jwt_identity()
        customer_id = identity
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        claims = get_jwt()
        all_orders = []
        if customer_id:
            cursor.execute("""SELECT * FROM orders WHERE customer_id = %s""",(customer_id,))
            myorders = cursor.fetchall()
            for order in myorders:
                order_id = int(order["order_id"])
                vendor_id = int(order["vendor_id"])
                order_date = order["order_date"]
                total_amount = float(order["total_amount"])
                delivery_address = order["delivery_address"]
                cursor.execute("""SELECT business_name FROM vendors WHERE vendor_id = %s""",(vendor_id,))
                vendor = cursor.fetchone()
                business_name = vendor['business_name'] if vendor else "Unknown Business"
                cursor.execute("""SELECT item_id,quantity FROM order_items WHERE order_id = %s""",(order_id,))
                item_details = cursor.fetchall()
                order_status = order["order_status"]
                ordered_items = []
                for item in item_details:
                    item_id = int(item["item_id"])
                    quantity = int(item["quantity"])
                    cursor.execute("""SELECT item_name FROM menu_items WHERE item_id = %s""",(item_id,))
                    item_name = cursor.fetchone()['item_name']
                    ordered_items.append({"item_id":item_id,"item_name":item_name,"quantity":quantity})
                
                order_packet = {
                    "order_id":order_id,
                    "order_date":order_date,
                    "total_amount":total_amount,
                    "delivery_address":delivery_address,
                    "order_status":order_status,
                    "business_name": business_name,
                    "ordered_items":ordered_items
                }
                all_orders.append(order_packet)
            conn.commit()
            cursor.close()
            conn.close()  
            return jsonify(all_orders)
    except Exception as e:
        return jsonify({'message':'Error fetching orders','error':str(e)})

@db.route('/api/menu/<category>',methods=['GET'])
def filter_menu_items(category):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        category = category.replace(' ','-').lower()
        category_query = f"{category}%"
        cursor.execute("SELECT m.*, v.business_name FROM menu_items m, vendors v WHERE m.vendor_id = v.vendor_id AND LOWER(m.category) LIKE %s",(category_query,))
        items = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(items)
    except Exception as e:
        return jsonify({'message':'Cannot fetch items in category','error':str(e)})

@db.route('/api/businessname/<int:vendorId>',methods=['GET'])
def get_vendor_name(vendorId):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT business_name FROM vendors WHERE vendor_id = %s",(vendorId,))
        vendor = cursor.fetchone()
        cursor.close()
        conn.close()
        return jsonify(vendor)
    except Exception as e:
        return jsonify({'message':'Failed to get vendor name','error':str(e)})


if __name__ == '__main__':
    get_db_connection()
    initialize_database()
    #verify_user_credentials(email,password)
    db.run(debug=True)