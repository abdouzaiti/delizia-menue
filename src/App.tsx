import { useEffect, useMemo, useState } from "react"
import {
  Check,
  Flame,
  Clock,
  Minus,
  Moon,
  Pause,
  Play,
  Plus,
  Search,
  ShoppingBag,
  Sun,
  Trash2,
  X,
} from "lucide-react"
import DishOrbitCarousel from "./components/DishOrbitCarousel"
import { DELIZIA_BACKDROP, DISHES, type KitchenDish } from "./data/dishes"

type OrderLine = {
  dish: KitchenDish
  quantity: number
  note: string
}

type SubmittedTicket = {
  id: string
  table: string
  items: { title: string; subtitle: string; quantity: number; price: number }[]
  total: number
  etaMinutes: number
}

export function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [jumpTo, setJumpTo] = useState<{ index: number; seq: number } | null>(null)
  const [darkMode, setDarkMode] = useState(false)

  // Modal / drawer states
  const [videoDish, setVideoDish] = useState<KitchenDish | null>(null)
  const [videoStep, setVideoStep] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(true)

  const [orderOpen, setOrderOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [tableLabel, setTableLabel] = useState("Table 04")
  const [orderLines, setOrderLines] = useState<Record<string, OrderLine>>({})
  const [ticket, setTicket] = useState<SubmittedTicket | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  // Close overlays on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (videoDish) setVideoDish(null)
      else if (searchOpen) setSearchOpen(false)
      else if (orderOpen) setOrderOpen(false)
      else if (menuOpen) setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [videoDish, searchOpen, orderOpen, menuOpen])

  // Auto-advance preparation reel steps while playing
  useEffect(() => {
    if (!videoDish || !videoPlaying) return
    const timer = window.setInterval(() => {
      setVideoStep((prev) => (prev + 1) % videoDish.steps.length)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [videoDish, videoPlaying])

  const triggerJump = (index: number) => {
    setJumpTo((prev) => ({ index, seq: (prev?.seq ?? 0) + 1 }))
    setActiveIndex(index)
  }

  const addDishToOrder = (dish: KitchenDish) => {
    setTicket(null)
    setOrderLines((prev) => {
      const existing = prev[dish.id]
      return {
        ...prev,
        [dish.id]: {
          dish,
          quantity: (existing?.quantity ?? 0) + 1,
          note: existing?.note ?? "",
        },
      }
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setOrderLines((prev) => {
      const line = prev[id]
      if (!line) return prev
      const nextQty = line.quantity + delta
      if (nextQty <= 0) {
        const copy = { ...prev }
        delete copy[id]
        return copy
      }
      return { ...prev, [id]: { ...line, quantity: nextQty } }
    })
  }

  const updateNote = (id: string, note: string) => {
    setOrderLines((prev) => {
      const line = prev[id]
      if (!line) return prev
      return { ...prev, [id]: { ...line, note } }
    })
  }

  const lineList = Object.values(orderLines)
  const itemCount = lineList.reduce((sum, l) => sum + l.quantity, 0)
  const subtotal = lineList.reduce((sum, l) => sum + l.dish.price * l.quantity, 0)

  const submitOrder = () => {
    if (!lineList.length) return
    const maxPrep = Math.max(...lineList.map((l) => l.dish.prepMinutes))
    const ticketId = "DP-" + String(1040 + Math.floor(Math.random() * 90))
    setTicket({
      id: ticketId,
      table: tableLabel,
      items: lineList.map((l) => ({
        title: l.dish.title,
        subtitle: l.dish.subtitle,
        quantity: l.quantity,
        price: l.dish.price,
      })),
      total: subtotal,
      etaMinutes: maxPrep,
    })
    setOrderLines({})
  }

  const filteredDishes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return DISHES.map((d, idx) => ({ dish: d, idx }))
    return DISHES.map((d, idx) => ({ dish: d, idx })).filter(({ dish }) => {
      const haystack = [
        dish.title,
        dish.subtitle,
        dish.chef,
        dish.kitchen ?? "",
        dish.course,
        ...(dish.ingredients ?? []),
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [searchQuery])

  const currentVideoStep = videoDish ? videoDish.steps[videoStep] ?? videoDish.steps[0] : null

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300">
      <DishOrbitCarousel
        dishes={DISHES}
        height="100svh"
        backdrop={DELIZIA_BACKDROP}
        loop={true}
        logoSrc="/logo.png"
        brandName="Delizia Pizza"
        brandTagline="Au Feu de Bois"
        cartCount={itemCount}
        jumpTo={jumpTo}
        onChange={(idx) => setActiveIndex(idx)}
        onPlay={(_dish, idx) => {
          const full = DISHES[idx]
          if (!full) return
          setVideoDish(full)
          setVideoStep(0)
          setVideoPlaying(true)
        }}
        onOrder={(_dish, idx) => {
          const full = DISHES[idx]
          if (!full) return
          addDishToOrder(full)
          setOrderOpen(true)
        }}
        onOpenCart={() => setOrderOpen(true)}
        onSearch={() => {
          setSearchQuery("")
          setSearchOpen(true)
        }}
        onMenu={() => setMenuOpen(true)}
      />

      {/* Search Overlay */}
      {searchOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 px-4 pt-20 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Search Delizia Pizza menu"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-black/10 dark:border-white/15 bg-[var(--color-background)] text-[var(--color-foreground)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 h-1">
              <span className="bg-[#009246]" />
              <span className="bg-white" />
              <span className="bg-[#ce2b37]" />
            </div>
            <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 px-4 py-3.5">
              <Search className="h-4 w-4 shrink-0 text-[#ce2b37]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pizza, topping, pizzaiolo..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-muted-foreground)]"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredDishes.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-[var(--color-muted-foreground)]">
                  No pizzas match “{searchQuery}”.
                </p>
              ) : (
                filteredDishes.map(({ dish, idx }) => (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => {
                      triggerJump(idx)
                      setSearchOpen(false)
                    }}
                    className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#009246]/10"
                  >
                    <img
                      src={dish.image}
                      alt={dish.title + " " + dish.subtitle}
                      referrerPolicy="no-referrer"
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-semibold">
                          {dish.title} {dish.subtitle}
                        </span>
                        <span className="text-xs font-bold tabular-nums text-[#009246]">
                          ${dish.price}
                        </span>
                      </div>
                      <p className="truncate text-xs text-[var(--color-muted-foreground)]">
                        {dish.chef} · {dish.course}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Menu & Display Drawer */}
      {menuOpen ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Delizia Pizza menu"
          onClick={() => setMenuOpen(false)}
        >
          <aside
            className="flex h-full w-full max-w-md flex-col justify-between border-l border-black/10 dark:border-white/15 bg-[var(--color-background)] text-[var(--color-foreground)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 h-1 shrink-0">
              <span className="bg-[#009246]" />
              <span className="bg-white" />
              <span className="bg-[#ce2b37]" />
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between pb-5 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-[#080808] p-1 grid place-items-center shrink-0">
                    <img src="/logo.png" alt="Delizia Pizza" className="h-full w-full object-contain rounded-lg" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-tight">Delizia Pizza</h2>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#ce2b37]">
                      Au Feu de Bois
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-1.5">
                {DISHES.map((d, idx) => {
                  const isCurrent = idx === activeIndex
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        triggerJump(idx)
                        setMenuOpen(false)
                      }}
                      className={`flex w-full items-center gap-3.5 rounded-xl p-2.5 text-left transition-colors ${
                        isCurrent
                          ? "bg-[#009246]/12 ring-1 ring-[#009246]/40"
                          : "hover:bg-black/5 dark:hover:bg-white/8"
                      }`}
                    >
                      <img
                        src={d.image}
                        alt={d.title + " " + d.subtitle}
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold">
                            {d.title} {d.subtitle}
                          </span>
                          <span className="text-xs font-bold tabular-nums text-[#009246]">
                            ${d.price}
                          </span>
                        </div>
                        <p className="truncate text-xs text-[var(--color-muted-foreground)]">
                          {d.chef} · {d.prepMinutes} min wood-fired
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3 border-t border-black/10 dark:border-white/10 p-6">
              <button
                type="button"
                onClick={() => setDarkMode((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl border border-black/15 dark:border-white/15 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              >
                <span className="flex items-center gap-2.5">
                  {darkMode ? <Sun className="h-4 w-4 text-[#ce2b37]" /> : <Moon className="h-4 w-4 text-[#009246]" />}
                  {darkMode ? "Switch to White Daylight" : "Switch to Evening Service"}
                </span>
                <span className="text-xs text-[var(--color-muted-foreground)]">
                  {darkMode ? "Dark" : "Light"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  setOrderOpen(true)
                }}
                className="flex w-full items-center justify-between rounded-xl bg-[#009246] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Open Order Tray
                </span>
                <span className="tabular-nums">
                  {itemCount} {itemCount === 1 ? "pizza" : "pizzas"} · ${subtotal}
                </span>
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      {/* Wood-Fired Preparation Reel Modal */}
      {videoDish && currentVideoStep ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Wood-fired preparation reel for ${videoDish.title} ${videoDish.subtitle}`}
          onClick={() => setVideoDish(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-black/10 dark:border-white/15 bg-[var(--color-background)] text-[var(--color-foreground)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 h-1">
              <span className="bg-[#009246]" />
              <span className="bg-white" />
              <span className="bg-[#ce2b37]" />
            </div>
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-6 py-4">
              <div>
                <p className="text-xs font-semibold text-[#ce2b37]">
                  Au Feu de Bois · {videoDish.chef}
                </p>
                <h2 className="text-lg font-semibold tracking-tight">
                  {videoDish.title} {videoDish.subtitle} — Hearth Reel
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close video reel"
                onClick={() => setVideoDish(null)}
                className="grid h-9 w-9 place-items-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-[220px_1fr] md:items-center">
              <div
                className="relative mx-auto flex h-52 w-52 items-center justify-center rounded-full p-2"
                style={{ background: `color-mix(in oklab, ${videoDish.accent} 20%, transparent)` }}
              >
                <img
                  src={videoDish.image}
                  alt={videoDish.title + " " + videoDish.subtitle}
                  referrerPolicy="no-referrer"
                  className="h-44 w-44 rounded-full object-cover shadow-lg transition-transform duration-700"
                  style={{ transform: `rotate(${videoStep * 18}deg) scale(${videoPlaying ? 1.04 : 1})` }}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[var(--color-muted-foreground)]">
                  <span className="font-semibold uppercase tracking-wider text-[var(--color-foreground)]">
                    Step {videoStep + 1} of {videoDish.steps.length} · {currentVideoStep.stage}
                  </span>
                  <span className="tabular-nums font-medium text-[#ce2b37]">
                    {currentVideoStep.time}
                    {currentVideoStep.temp ? ` · ${currentVideoStep.temp}` : ""}
                  </span>
                </div>

                <p className="min-h-12 text-sm leading-relaxed">{currentVideoStep.detail}</p>

                <div className="grid grid-cols-4 gap-2">
                  {videoDish.steps.map((st, idx) => (
                    <button
                      key={st.stage}
                      type="button"
                      onClick={() => {
                        setVideoStep(idx)
                        setVideoPlaying(false)
                      }}
                      className={`rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                        idx === videoStep
                          ? "bg-[#ce2b37] text-white font-semibold"
                          : "bg-black/5 dark:bg-white/10 text-[var(--color-muted-foreground)] hover:bg-black/10 dark:hover:bg-white/15"
                      }`}
                    >
                      <div className="tabular-nums opacity-80">{st.time}</div>
                      <div className="truncate">{st.stage}</div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setVideoPlaying((p) => !p)}
                    className="inline-flex items-center gap-2 rounded-lg border border-black/15 dark:border-white/20 px-3.5 py-2 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    {videoPlaying ? <Pause className="h-3.5 w-3.5 text-[#ce2b37]" /> : <Play className="h-3.5 w-3.5 text-[#009246]" />}
                    {videoPlaying ? "Pause Reel" : "Resume Reel"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      addDishToOrder(videoDish)
                      setVideoDish(null)
                      setOrderOpen(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#009246] px-4 py-2 text-xs font-semibold text-white hover:opacity-95"
                  >
                    Order Pizza · ${videoDish.price}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Wood-Fired Order Tray Drawer */}
      {orderOpen ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Delizia Pizza order tray"
          onClick={() => setOrderOpen(false)}
        >
          <aside
            className="flex h-full w-full max-w-md flex-col justify-between border-l border-black/10 dark:border-white/15 bg-[var(--color-background)] text-[var(--color-foreground)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 h-1 shrink-0">
              <span className="bg-[#009246]" />
              <span className="bg-white" />
              <span className="bg-[#ce2b37]" />
            </div>

            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#080808] p-1 grid place-items-center shrink-0">
                  <img src="/logo.png" alt="Delizia Pizza" className="h-full w-full object-contain rounded" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight">Delizia Order Tray</h2>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Wood-fired hearth ticket · {tableLabel}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close order tray"
                onClick={() => setOrderOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {ticket ? (
                <div className="rounded-2xl border border-[#009246]/35 bg-[#009246]/8 p-5 space-y-3">
                  <div className="flex items-center gap-2.5 text-sm font-semibold">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#009246] text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>Ticket #{ticket.id} Confirmed — Firing in Hearth</span>
                  </div>
                  <p className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#ce2b37]" />
                    <span>Ready in {ticket.etaMinutes} min · {ticket.table}</span>
                  </p>
                  <div className="border-t border-black/10 dark:border-white/10 pt-3 space-y-1.5 text-xs">
                    {ticket.items.map((it) => (
                      <div key={it.title + it.subtitle} className="flex justify-between tabular-nums">
                        <span>{it.quantity}× {it.title} {it.subtitle}</span>
                        <span>${it.price * it.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-black/10 dark:border-white/10 pt-2 font-bold tabular-nums">
                      <span>Total</span>
                      <span className="text-[#009246]">${ticket.total}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {lineList.length === 0 && !ticket ? (
                <div className="py-12 text-center space-y-2">
                  <Flame className="mx-auto h-7 w-7 text-[#ce2b37]" />
                  <p className="text-sm font-semibold">Your pizza tray is empty</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Tap “Order pizza” on any wood-fired pie to send it straight to the hearth.
                  </p>
                </div>
              ) : null}

              {lineList.map(({ dish, quantity, note }) => (
                <div
                  key={dish.id}
                  className="rounded-xl border border-black/10 dark:border-white/12 p-3.5 space-y-2.5"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={dish.image}
                      alt={dish.title + " " + dish.subtitle}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-semibold">
                          {dish.title} {dish.subtitle}
                        </span>
                        <span className="text-sm font-bold tabular-nums text-[#009246]">
                          ${dish.price * quantity}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-muted-foreground)]">
                        {dish.chef} · {dish.prepMinutes} min
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => updateNote(dish.id, e.target.value)}
                      placeholder="Extra basil, well charred, no chili..."
                      className="flex-1 rounded-lg border border-black/15 dark:border-white/15 bg-transparent px-2.5 py-1.5 text-xs outline-none focus:border-[#009246]"
                    />
                    <div className="flex items-center gap-1 rounded-lg border border-black/15 dark:border-white/15 px-1 py-0.5">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(dish.id, -1)}
                        className="grid h-6 w-6 place-items-center rounded hover:bg-[#ce2b37]/15 hover:text-[#ce2b37]"
                      >
                        {quantity === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                      </button>
                      <span className="w-5 text-center text-xs font-semibold tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(dish.id, 1)}
                        className="grid h-6 w-6 place-items-center rounded hover:bg-[#009246]/15 hover:text-[#009246]"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {lineList.length > 0 ? (
              <div className="border-t border-black/10 dark:border-white/10 p-6 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="table-select" className="font-medium text-[var(--color-muted-foreground)]">
                    Table / Counter
                  </label>
                  <select
                    id="table-select"
                    value={tableLabel}
                    onChange={(e) => setTableLabel(e.target.value)}
                    className="rounded-lg border border-black/15 dark:border-white/15 bg-[var(--color-background)] px-2.5 py-1.5 text-xs font-medium outline-none"
                  >
                    <option value="Table 01">Table 01</option>
                    <option value="Table 04">Table 04</option>
                    <option value="Table 08">Table 08</option>
                    <option value="Hearth Counter">Hearth Counter</option>
                    <option value="Takeaway">Takeaway</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-[#009246]">${subtotal}</span>
                </div>

                <button
                  type="button"
                  onClick={submitOrder}
                  className="w-full rounded-xl bg-[#ce2b37] py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
                >
                  Fire Order at Hearth · ${subtotal}
                </button>
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}
    </main>
  )
}

export default App
