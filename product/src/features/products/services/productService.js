import { EVENTS } from "../constants/events";

const mockProducts = [
  {
    id: "headphones",
    name: "Wireless Headphones",
    category: "Audio",
    price: 1290000,
    rating: "4.8",
    stock: "24 in stock",
    description: "Active noise reduction, soft ear pads, and 30-hour battery life.",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "keyboard",
    name: "Mechanical Keyboard",
    category: "Workspace",
    price: 1590000,
    rating: "4.7",
    stock: "18 in stock",
    description: "Compact layout, tactile switches, and hot-swappable keycaps.",
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "watch",
    name: "Smart Fitness Watch",
    category: "Wearable",
    price: 2190000,
    rating: "4.9",
    stock: "9 in stock",
    description: "Daily activity tracking, sleep insights, and quick notifications.",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "dock",
    name: "USB-C Travel Dock",
    category: "Accessories",
    price: 990000,
    rating: "4.6",
    stock: "31 in stock",
    description: "HDMI, USB-A, card reader, and pass-through charging in one hub.",
    imageUrl:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80"
  }
];

export async function getProducts() {
  return mockProducts;
}

export function getProductCategories(products = mockProducts) {
  return Array.from(new Set(products.map((product) => product.category)));
}

export function addProductToCart(product) {
  window.dispatchEvent(
    new CustomEvent(EVENTS.CART_ADD, {
      detail: product
    })
  );

  return product;
}
