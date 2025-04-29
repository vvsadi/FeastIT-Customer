# from flask import Flask
# from flask_cors import CORS
# from routes.orders import orders_bp

# app = Flask(__name__)

# CORS(app, resources={r"/api/*": {"origins": "*"}})

# # Register the Blueprint
# app.register_blueprint(orders_bp)

# # Debugging: Print all registered routes
# # print("\nRegistered routes:")
# # for rule in app.url_map.iter_rules():
# #     print(rule)

# if __name__ == "__main__":
#     app.run(debug=True)

# #testing for data fetch
# # from flask import Flask, jsonify
# # from flask_cors import CORS
# # app = Flask(__name__)
# CORS(app)  # ✅ Allows all frontend requests (temporary fix)

# @app.route('/api/cart', methods=['GET'])
# def get_cart():
#     cart_items = [
#         {"id": 1, "name": "Lunch Box Bowl", "price": 13.35, "quantity": 1,}
#     ]
#     return jsonify(cart_items)

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)
from flask import Flask, jsonify
from flask_cors import CORS  # ✅ Import CORS
from routes.orders import orders_bp  # ✅ Import Orders Blueprint
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

app = Flask(__name__)


# ✅ Apply CORS to allow frontend (`localhost:3000`) access
CORS(app, supports_credentials=True,resources={r"/api/*": {"origins": "http://localhost:5173"}})
# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'DCP_FeastIT_Secret_key'  # Replace with a strong secret key
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Only for dev
jwt = JWTManager(app)

# ✅ API: Fetch Cart Items (Only One Item)
@app.route("/api/cart", methods=["GET"])
@jwt_required()
def fetch_cart_items():
    current_user = get_jwt_identity()
    sample_cart = [
        {"id": 1, "name": "Lunch Box Bowl", "price": 10.99, "image": "https://via.placeholder.com/70"}
    ]
    return jsonify(cart_items=sample_cart, user=current_user), 200

# ✅ Register the Orders Blueprint (for placing orders)
app.register_blueprint(orders_bp)

if __name__ == "__main__":
    app.run(debug=True)




    



