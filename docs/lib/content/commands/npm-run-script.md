import React, { useState } from "react"; import { Button } from "@/components/ui/button"; import { Card, CardContent } from "@/components/ui/card"; import { Input } from "@/components/ui/input"; import { ShoppingCart } from "lucide-react";

const products = [ { id: 1, name: "Payal Design 1", price: 450, image: "/images/payal1.jpg" }, { id: 2, name: "Payal Design 2", price: 600, image: "/images/payal2.jpg" }, { id: 3, name: "Payal Design 3", price: 750, image: "/images/payal3.jpg" } ];

export default function ZeePayal() { const [cart, setCart] = useState([]);

const addToCart = (product) => { setCart([...cart, product]); };

const generateWhatsAppLink = () => { const cartItems = cart.map(item => ${item.name} - ₹${item.price}).join("\n"); const total = cart.reduce((sum, item) => sum + item.price, 0); const message = Order from Zee Payal:%0A${cartItems}%0ATotal: ₹${total}; return https://wa.me/YOUR_PHONE_NUMBER?text=${encodeURIComponent(message)}; };

return ( <div className="p-6 space-y-6"> <h1 className="text-3xl font-bold text-center">Zee Payal Products</h1> <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> {products.map((product) => ( <Card key={product.id}> <CardContent className="p-4"> <img src={product.image} alt={product.name} className="rounded-xl mb-2" /> <h2 className="text-lg font-semibold">{product.name}</h2> <p className="text-gray-600">₹{product.price}</p> <Button className="mt-2" onClick={() => addToCart(product)}> Add to Cart </Button> </CardContent> </Card> ))} </div>

<div className="mt-8 p-4 border rounded-xl bg-gray-100">
    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
      <ShoppingCart size={24} /> Your Cart
    </h2>
    {cart.length === 0 ? (
      <p>Your cart is empty.</p>
    ) : (
      <ul className="list-disc pl-5">
        {cart.map((item, index) => (
          <li key={index}>{item.name} - ₹{item.price}</li>
        ))}
      </ul>
    )}
    {cart.length > 0 && (
      <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer">
        <Button className="mt-4">Share Cart on WhatsApp</Button>
      </a>
    )}
  </div>
</div>

); }

