"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CartViewProps {
  cart: {
    id: number
    name: string
    price: number
    quantity: number
    image: string
  }[]
  updateQuantity: (productId: number, quantity: number) => void
  removeFromCart: (productId: number) => void
  subtotal: number
}

export default function CartView({ cart, updateQuantity, removeFromCart, subtotal }: CartViewProps) {
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Button variant="outline" size="sm">
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        {cart.map((item) => (
          <Card key={item.id} className="mb-3">
            <CardContent className="p-3">
              <div className="flex items-center">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
                <div className="ml-3 flex-1">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="mx-2 text-sm w-5 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 ml-2 text-red-500"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <Button className="w-full">Proceed to Checkout</Button>
      </div>
    </div>
  )
}
