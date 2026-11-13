import type { Dish } from "../components/DishOrbitCarousel"

import margheritaImg from "../assets/images/pizza_margherita_verace_1794586909462.jpg"
import verdePistacchioImg from "../assets/images/pizza_verde_pistacchio_1794586910133.jpg"
import diavolaImg from "../assets/images/pizza_diavola_piccante_1794586910746.jpg"
import tartufoImg from "../assets/images/pizza_tartufo_bianca_1794586911043.jpg"
import quattroImg from "../assets/images/pizza_quattro_formaggi_1794586911687.jpg"
import woodfireBackdropImg from "../assets/images/delizia_woodfire_backdrop_1794586912165.jpg"

export type PrepStep = {
  time: string
  stage: string
  detail: string
  temp?: string
}

export type KitchenDish = Dish & {
  id: string
  price: number
  prepMinutes: number
  course: string
  steps: PrepStep[]
}

export const DELIZIA_BACKDROP = woodfireBackdropImg

export const DISHES: KitchenDish[] = [
  {
    id: "margherita-verace",
    title: "Margherita",
    subtitle: "Verace",
    eyebrow: "#1 Au Feu de Bois",
    label: "Margherita\nVerace",
    image: margheritaImg,
    alt: "Top-down wood-fired Margherita Verace pizza with San Marzano tomato, fior di latte, and fresh basil",
    rating: 4.9,
    chef: "Marco Bellini",
    kitchen: "Delizia · Forno Napoletano",
    description:
      "Crushed San Marzano DOP tomatoes, creamy fior di latte, torn sweet basil, and cold-pressed olive oil on 72-hour sourdough.",
    likes: 542,
    ingredients: [
      "San Marzano DOP",
      "Fior di Latte",
      "Fresh Basil",
      "72h Sourdough",
      "Extra Virgin Oil",
    ],
    accent: "#ce2b37",
    price: 16,
    prepMinutes: 8,
    course: "Classica Rossa",
    steps: [
      { time: "0:00", stage: "Hand Stretch", detail: "Press 72-hour cold-fermented dough ball outward, leaving an airy cornicione rim." },
      { time: "0:02", stage: "Sauce & Fior", detail: "Ladle hand-crushed San Marzano DOP tomatoes, fior di latte pearls, and basil." },
      { time: "0:04", stage: "Oak Fire Bake", detail: "Slide onto stone hearth beside glowing oak logs for 90 seconds.", temp: "485°C" },
      { time: "0:07", stage: "Basil & Oil", detail: "Finish straight off the peel with fresh basil leaves and peppery olive oil." },
    ],
  },
  {
    id: "verde-pistacchio",
    title: "Verde",
    subtitle: "Pistacchio",
    eyebrow: "#2 Chef's green pick",
    label: "Verde\nPistacchio",
    image: verdePistacchioImg,
    alt: "Top-down wood-fired green pistachio pesto and burrata pizza with crushed pistachios and basil",
    rating: 4.8,
    chef: "Giulia Conti",
    kitchen: "Delizia · Forno Botanico",
    description:
      "Velvety Bronte pistachio and basil pesto baked beneath blistered dough, crowned with cool burrata stracciatella and lemon zest.",
    likes: 419,
    ingredients: [
      "Bronte Pistachio",
      "Burrata Cream",
      "Genovese Basil",
      "Lemon Zest",
      "Sea Salt",
    ],
    accent: "#009246",
    price: 21,
    prepMinutes: 9,
    course: "Speciale Verde",
    steps: [
      { time: "0:00", stage: "Dough Open", detail: "Stretch leavened sourdough disc evenly on dusted semolina bench." },
      { time: "0:02", stage: "Pesto Base", detail: "Spread vibrant green Bronte pistachio and sweet basil cream across the center." },
      { time: "0:05", stage: "Wood Hearth", detail: "Char crust in oak-fired dome until golden leopard spots bloom.", temp: "475°C" },
      { time: "0:08", stage: "Cool Burrata", detail: "Tear fresh creamy burrata, scatter roasted pistachios, and drizzle basil oil." },
    ],
  },
  {
    id: "diavola-piccante",
    title: "Diavola",
    subtitle: "Piccante",
    eyebrow: "#3 Bold & spicy",
    label: "Diavola\nPiccante",
    image: diavolaImg,
    alt: "Top-down wood-fired Diavola pizza with Calabrian salami, mozzarella, and oregano",
    rating: 4.9,
    chef: "Matteo Rossi",
    kitchen: "Delizia · Braciere Vivo",
    description:
      "Bright tomato passata, melted mozzarella, crisp Calabrian spianata salami, wild mountain oregano, and warm chili honey.",
    likes: 487,
    ingredients: [
      "Calabrian Salami",
      "San Marzano",
      "Fior di Latte",
      "Chili Honey",
      "Wild Oregano",
    ],
    accent: "#ce2b37",
    price: 19,
    prepMinutes: 8,
    course: "Classica Rossa",
    steps: [
      { time: "0:00", stage: "Tomato Base", detail: "Coat stretched crust with bright crushed tomatoes and torn fior di latte." },
      { time: "0:02", stage: "Spianata Layer", detail: "Arrange thin Calabrian spicy salami slices and crushed red chili flakes." },
      { time: "0:04", stage: "Flame Blister", detail: "Bake near live flame to curl salami edges and blister the crust.", temp: "485°C" },
      { time: "0:07", stage: "Oregano & Honey", detail: "Dress with fresh green oregano leaves and wildflower chili honey." },
    ],
  },
  {
    id: "tartufo-bianca",
    title: "Tartufo",
    subtitle: "Bianca",
    eyebrow: "#4 White artisan",
    label: "Tartufo\nBianca",
    image: tartufoImg,
    alt: "Top-down wood-fired white truffle and wild mushroom pizza with fresh thyme",
    rating: 4.8,
    chef: "Luca Ferri",
    kitchen: "Delizia · Atelier Bianco",
    description:
      "Whipped ricotta and fior di latte white base layered with wood-roasted wild mushrooms, shaved black truffle, and garden thyme.",
    likes: 396,
    ingredients: [
      "Black Truffle",
      "Wild Mushrooms",
      "Whipped Ricotta",
      "Fior di Latte",
      "Garden Thyme",
    ],
    accent: "#009246",
    price: 23,
    prepMinutes: 10,
    course: "Bianca Gourmet",
    steps: [
      { time: "0:00", stage: "White Cream", detail: "Spread whipped sheep ricotta and fior di latte across stretched sourdough." },
      { time: "0:03", stage: "Mushroom Roast", detail: "Scatter wood-roasted porcini and cremini mushrooms with thyme sprigs." },
      { time: "0:06", stage: "Dome Bake", detail: "Bake until cheese bubbles golden and crust puffs crisp and airy.", temp: "470°C" },
      { time: "0:09", stage: "Truffle Finish", detail: "Shave aromatic Périgord black truffle generously at the pass." },
    ],
  },
  {
    id: "quattro-formaggi",
    title: "Quattro",
    subtitle: "Formaggi",
    eyebrow: "#5 Creamy heritage",
    label: "Quattro\nFormaggi",
    image: quattroImg,
    alt: "Top-down wood-fired Quattro Formaggi pizza with four Italian cheeses and fresh basil",
    rating: 4.7,
    chef: "Sofia Moretti",
    kitchen: "Delizia · Casa Delizia",
    description:
      "A molten white quartet of fior di latte, aged Gorgonzola Dolce, Fontina Val d'Aosta, and 24-month Parmigiano with fresh basil.",
    likes: 348,
    ingredients: [
      "Gorgonzola Dolce",
      "Fontina d'Aosta",
      "Parmigiano 24m",
      "Fior di Latte",
      "Cracked Pepper",
    ],
    accent: "#ce2b37",
    price: 18,
    prepMinutes: 8,
    course: "Bianca Gourmet",
    steps: [
      { time: "0:00", stage: "Cheese Blend", detail: "Layer fior di latte, Fontina cubes, and creamy Gorgonzola Dolce evenly." },
      { time: "0:03", stage: "Parmigiano Dust", detail: "Grate 24-month Parmigiano-Reggiano and crack coarse black pepper." },
      { time: "0:05", stage: "High Hearth", detail: "Bake swiftly in wood-fired oven until bubbling and speckled brown.", temp: "475°C" },
      { time: "0:08", stage: "Basil Crown", detail: "Scatter fresh sweet green basil leaves just before serving." },
    ],
  },
]
