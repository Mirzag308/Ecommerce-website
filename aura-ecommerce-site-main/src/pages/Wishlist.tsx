import { Heart } from "lucide-react"

const Wishlist = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
      <p className="text-muted-foreground">Save your favorite items here!</p>
    </div>
  )
}

export default Wishlist