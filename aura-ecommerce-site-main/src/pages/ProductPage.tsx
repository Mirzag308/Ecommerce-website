import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { 
  Heart, 
  Share2, 
  Star, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { featuredProducts } from "@/data/products"
import { useCart } from "@/store/cart"
import { toast } from "@/hooks/use-toast"

const ProductPage = () => {
  const { id } = useParams()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()

  // Mock product data - in real app this would come from API
  const product = featuredProducts.find(p => p.id === id) || featuredProducts[0]
  
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const colors = ["Black", "White", "Navy", "Gray", "Red"]
  
  const productImages = [
    product.image,
    "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop"
  ]

  const reviews = [
    {
      id: 1,
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      comment: "Amazing quality! Exactly as described and fast shipping.",
      date: "2024-01-15",
      verified: true
    },
    {
      id: 2,
      name: "Sarah Smith",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5eb?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      comment: "Great product, very satisfied with the purchase.",
      date: "2024-01-10",
      verified: true
    }
  ]

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-primary">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={productImages[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <Badge 
                variant={product.badge === "Sale" ? "destructive" : "secondary"}
                className="absolute top-4 left-4"
              >
                {product.badge}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImageIndex === index ? "border-primary" : "border-muted"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <Badge variant="destructive">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Size Selection */}
          {product.category === "Fashion" && (
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          <div>
            <h3 className="font-semibold mb-3">Color</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className={`text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-gradient-primary text-lg py-6"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleWishlist}
              className="p-3"
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="outline" size="icon" className="p-3">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <Truck className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">On orders over $100</p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <RotateCcw className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">30-day return policy</p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">100% protected</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Description</h3>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    This premium {product.name.toLowerCase()} offers exceptional quality and style. 
                    Crafted with attention to detail, it combines comfort with durability to meet 
                    your everyday needs. Whether you're looking for functionality or fashion, 
                    this product delivers on all fronts.
                  </p>
                  <ul className="mt-4 space-y-2 text-muted-foreground">
                    <li>• High-quality materials and construction</li>
                    <li>• Modern design that fits any lifestyle</li>
                    <li>• Versatile and practical for daily use</li>
                    <li>• Backed by our satisfaction guarantee</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={review.avatar} alt={review.name} />
                        <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{review.name}</h4>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Shipping Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Free Standard Shipping</h4>
                    <p className="text-muted-foreground text-sm">
                      Free shipping on orders over $100. Delivery within 5-7 business days.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Express Shipping</h4>
                    <p className="text-muted-foreground text-sm">
                      $9.99 for express delivery within 2-3 business days.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">International Shipping</h4>
                    <p className="text-muted-foreground text-sm">
                      Available to most countries. Shipping costs calculated at checkout.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ProductPage