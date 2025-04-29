const API_BASE_URL = "http://localhost:5000/api"; //Set Base API URL

export const fetchCartItems = async () => {
    // API code to fetch cart items
    try {
        console.log("Fetching cart items...");
        const response = await fetch(`${API_BASE_URL}/cart`)  // API Call from Cart
        if (!response.ok) {
            throw new Error(`API Error ${response.status}, ${response.statusText}`);
        }
        console.log("Retrieved cart items successfully...")
        const data = await response.json();
        console.log(`Cart items from API: ${data}`);
        return data;
    } catch(error){
        console.error("Failed to get elements from cart ", error);
    }
}

export const fetchMenuItems = async(restaurant) => {
    // API code for fetching menu items of a restaurant
    try {
        console.log(`Fetching menu items of ${restaurant}`);
        const response = await fetch(`${API_BASE_URL}/menu?restaurant=${encodeURIComponent(restaurant)}`)
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}, ${response.statusText}`)
        }
        console.log(`Retrieved menu items of ${restaurant} successfully`)
        data = await response.json();
        console.log(`Menu items of ${restaurant} are: ${data}`);
        return data;
    } catch(error){
        console.error(`Failed to get menu items of ${restaurant}`)
    }
}

export const addItemToCart = async(restaurant,item,quantity) => {
    try {
        console.log(`Adding ${item} to cart`);
        const response = await fetch(`${API_BASE_URL}/items?restaurant=${encodeURIComponent(restaurant)}&item=${encodeURIComponent(item)}&quantity=${encodeURIComponent(quantity)}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status},${response.statusText}`);
        }
        console.log(`Retrieved ${item} from ${restaurant} of quantity ${quantity} successfully`);
        data = await response.json();
        console.log(`Restaurant: ${restaurant}, Item: ${item}, Quantity: ${quantity}`);
        return data;
    } catch(error) {
        console.error(`Failed to get ${item} from ${restaurant} of quantity ${quantity}`);
    }
}

export const newOrder = async () => {
    // Need to complete the code
    try {
        console.log("Fetching new order details")
    } catch(error) {
        console.error("Failed to catch new order items",error)
    }
}

export const fetchFoodFilters = async () => {
    
}