"use client"

import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Sample product data
const products = [
  {
    id: 1,
    name: "Coffee",
    price: 3.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Sandwich",
    price: 6.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Salad",
    price: 8.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Smoothie",
    price: 5.49,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    name: "Bagel",
    price: 2.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 6,
    name: "Muffin",
    price: 3.49,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 7,
    name: "Croissant",
    price: 2.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 8,
    name: "Juice",
    price: 4.49,
    image: "/placeholder.svg?height=80&width=80",
  },
]

interface ProductListProps {
  addToCart: (product: { id: number; name: string; price: number; image: string }) => void
}

export default function ProductList({ addToCart }: ProductListProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardContent className="p-3">
            <div className="flex flex-col items-center">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={80}
                height={80}
                className="rounded-md mb-2"
              />
              <h3 className="font-medium text-sm">{product.name}</h3>
              <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => addToCart(product)}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
