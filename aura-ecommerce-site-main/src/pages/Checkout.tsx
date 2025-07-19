import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/store/cart"

const Checkout = () => {
  const { items, getTotalPrice } = useCart()
  const [formData, setFormData] = useState({
    email: "", firstName: "", lastName: "", address: "", city: "", zipCode: ""
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Email" />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="First Name" />
              <Input placeholder="Last Name" />
            </div>
            <Input placeholder="Address" />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="City" />
              <Input placeholder="ZIP Code" />
            </div>
            <Button className="w-full bg-gradient-primary">Complete Order</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4 font-bold">
                Total: ${getTotalPrice().toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Checkout