from flask import Blueprint, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
from datetime import datetime

orders_bp = Blueprint("orders", __name__)  # Flask Blueprint
CORS(orders_bp, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # ✅ Allow frontend requests


EXCEL_FILE = "orders.xlsx"

#  Function to initialize Excel if missing
def initialize_excel():
    if not os.path.exists(EXCEL_FILE):
        df = pd.DataFrame(columns=[
            "Order ID", "Customer ID", "Vendor ID", "Total Price", "Status", 
            "Items", "Ordered Time", "Delivered Time"
        ])
        df.to_excel(EXCEL_FILE, index=False)

# Function to read orders from Excel
def read_orders():
    return pd.read_excel(EXCEL_FILE)

#  Function to write orders to Excel
def write_orders(df):
    df.to_excel(EXCEL_FILE, index=False)

# ✅ Handle CORS Preflight Requests
@orders_bp.route("/api/orders", methods=["OPTIONS"])
def orders_preflight():
    response = jsonify({"message": "CORS preflight OK"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    return response, 200

# ✅ API: Place a New Order
@orders_bp.route("/api/orders", methods=["POST"])
def place_order():
    data = request.get_json()

    customer_id = data.get("customer_id")
    vendor_id = data.get("vendor_id")
    total_price = data.get("total_price")
    items = data.get("items", [])

    if not customer_id or not vendor_id or not items:
        return jsonify({"error": "Missing required order fields"}), 400

    df = read_orders()
    new_order_id = 5001 if df.empty else int(df["Order ID"].max() + 1)

    ordered_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Store current time

    new_order = pd.DataFrame([{
        "Order ID": new_order_id,
        "Customer ID": customer_id,
        "Vendor ID": vendor_id,
        "Total Price": total_price,
        "Status": "Pending",
        "Items": str(items),  # Store as a string
        "Ordered Time": ordered_time,
        "Delivered Time": None  # Initially empty
    }])

    df = pd.concat([df, new_order], ignore_index=True)
    write_orders(df)

    response = jsonify({
        "order_id": new_order_id,
        "ordered_time": ordered_time,
        "status": "Pending",
        "message": "Order placed successfully"
    })
    
    # ✅ Explicitly allow frontend access
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 201
    
#  API: Update Order Status (Vendor Marks as Delivered)-not required
@orders_bp.route("/update_order_status", methods=["POST"])
def update_order_status():
    data = request.get_json()

    order_id = data.get("order_id")
    new_status = data.get("status")

    df = read_orders()

    if order_id not in df["Order ID"].values:
        return jsonify({"error": "Order not found"}), 404

    df.loc[df["Order ID"] == order_id, "Status"] = new_status

    #  If the order is marked as "Completed", store Delivered Time
    # delivered_time = None
    # if new_status.lower() == "completed":
    #     delivered_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    #     df.loc[df["Order ID"] == order_id, "Delivered Time"] = delivered_time

    write_orders(df)

    # return jsonify({
    #     "order_id": order_id,
    #     "new_status": new_status,
    #     "delivered_time": delivered_time,
    #     "message": "Order status updated successfully"
    # }), 200

    return jsonify({
        "order_id": order_id,
        "new_status": new_status,
        "message": f"Order status updated to {new_status}"
    }), 200

#  API: Get Order Status by Order ID
@orders_bp.route("/order_status/<int:order_id>", methods=["GET"])
def get_order_status(order_id):
    df = read_orders()

    order = df[df["Order ID"] == order_id]
    if order.empty:
        return jsonify({"error": "Order not found"}), 404

    order_data = order.iloc[0].to_dict()

    return jsonify({
        "order_id": order_data["Order ID"],
        "status": order_data["Status"],
        "ordered_time": order_data["Ordered Time"],
        "delivered_time": order_data["Delivered Time"],
        "items": eval(order_data["Items"])  # ✅ Convert back to list format
    }), 200

#  API: Get All Orders for a Customer
@orders_bp.route("/customer/<int:customer_id>/orders", methods=["GET"])
def get_customer_orders(customer_id):
    df = read_orders()

    customer_orders = df[df["Customer ID"] == customer_id]

    if customer_orders.empty:
        return jsonify({"message": "No orders found for this customer"}), 404

    # Convert orders to JSON-friendly format
    orders_list = customer_orders.to_dict(orient="records")
    for order in orders_list:
        order["Items"] = eval(order["Items"])  # ✅ Convert back to list format

    return jsonify(orders_list), 200
    
@orders_bp.route("/confirm_delivery", methods=["POST"])
def confirm_delivery():
    data = request.get_json()
    
    order_id = data.get("order_id")

    df = read_orders()

    if order_id not in df["Order ID"].values:
        return jsonify({"error": "Order not found"}), 404

    # Check if the order is marked as "Completed"
    if df.loc[df["Order ID"] == order_id, "Status"].values[0].lower() != "completed":
        return jsonify({"error": "Order is not yet marked as Completed"}), 400

    # Update Delivered Time when the customer confirms
    delivered_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    df.loc[df["Order ID"] == order_id, "Delivered Time"] = delivered_time

    write_orders(df)

    return jsonify({
        "order_id": order_id,
        "delivered_time": delivered_time,
        "message": "Order delivery confirmed by customer"
    }), 200


initialize_excel()  # Initialize the Excel file at startup
