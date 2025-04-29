"use client"

import { useState } from "react"
import { ShoppingCart, Home, CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductList from "@/components/product-list"
import CartView from "@/components/cart-view"
import CheckoutView from "@/components/checkout-view"

export default function PosApp() {
  const [cart, setCart] = useState<
    {
      id: number
      name: string
      price: number
      quantity: number
      image: string
    }[]
  >([])
  const [activeTab, setActiveTab] = useState("products") // Track the active tab

  const addToCart = (product: { id: number; name: string; price: number; image: string }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const goToCheckout = () => {
    console.log("Navigating to checkout...")
    setActiveTab("checkout") // Switch to the "checkout" tab
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      <div className="w-full max-w-md mx-auto h-screen flex flex-col">
        <Card className="rounded-none border-x-0 border-t-0 shadow-sm">
          <CardContent className="p-4">
            <h1 className="text-xl font-bold text-center">Mobile POS</h1>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 sticky top-0 z-10">
            <TabsTrigger value="products">
              <Home className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="cart">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart ({cart.length})
            </TabsTrigger>
            <TabsTrigger value="checkout">
              <CreditCard className="h-4 w-4 mr-2" />
              Checkout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="flex-1 overflow-auto p-4">
            <ProductList addToCart={addToCart} />
          </TabsContent>

          <TabsContent value="cart" className="flex-1 overflow-auto p-4">
            <CartView
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              subtotal={subtotal}
              goToCheckout={goToCheckout} // Pass the goToCheckout function
            />
          </TabsContent>

          <TabsContent value="checkout" className="flex-1 overflow-auto p-4">
            <CheckoutView cart={cart} subtotal={subtotal} tax={tax} total={total} clearCart={clearCart} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
