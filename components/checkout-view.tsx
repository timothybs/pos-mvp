"use client"

import { useState } from "react"
import { Check, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CheckoutViewProps {
  cart: {
    id: number
    name: string
    price: number
    quantity: number
  }[]
  subtotal: number
  tax: number
  total: number
  clearCart: () => void
}

export default function CheckoutView({ cart, subtotal, tax, total, clearCart }: CheckoutViewProps) {
  const [paymentComplete, setPaymentComplete] = useState(false)

  const handleCheckout = () => {
    // Simulate payment processing
    setPaymentComplete(true)
    // Clear the cart after successful payment
    clearCart()
  }

  if (cart.length === 0 && !paymentComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Button variant="outline" size="sm">
          Add Items First
        </Button>
      </div>
    )
  }

  if (paymentComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-green-100 rounded-full p-3 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-gray-500 mb-6 text-center">Your order has been processed successfully.</p>
        <Button onClick={() => setPaymentComplete(false)}>New Order</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Order Summary</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-2 text-sm">
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t my-3"></div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Payment Details</h3>
            <div className="space-y-3">
              <div className="grid gap-1.5">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" placeholder="John Smith" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Button className="w-full" size="lg" onClick={handleCheckout}>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay ${total.toFixed(2)}
        </Button>
      </div>
    </div>
  )
}
