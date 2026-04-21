import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Placeholder image for broken links
const PLACEHOLDER =
  "https://via.placeholder.com/300x160.png?text=Product+Image";

// Nav icons (simple SVGs)
const CartIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.6 17h8.72a2 2 0 0 0 1.97-1.69L23 6H6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a9 9 0 0 1 13 0" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
  "Sports",
];

// Modal (overlay) component
function Modal({ open, onClose, children, className = "", backdropCls = "" }) {
  // trap focus
  const modalRef = useRef(null);
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);
  if (!open) return null;
  return (
    <div
      className={
        "fixed z-[100] inset-0 flex items-center justify-center bg-black/40 transition-all duration-200 " +
        backdropCls
      }
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className={
          "relative bg-white rounded-2xl shadow-xl p-6 w-[95%] max-w-sm animate-fadeIn " +
          className
        }
        style={{ animation: "fadeIn .3s" }}
        tabIndex={0}
        ref={modalRef}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
        .animate-fadeIn { animation: fadeIn .25s; }
        .animate-slideInUp { animation: slideInUp .3s; }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px) scale(.96);}
          to { opacity: 1; transform: none;}
        }
      `}</style>
    </div>
  );
}

// --- Countdown Timer (fake) ---
function useFakeCountdown() {
  const [time, setTime] = useState(30 * 60);
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// --- Main Component ---
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false)
  const [cart, setCart] = useState([])

  // Popup state
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successProductName, setSuccessProductName] = useState("");
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const navigate = useNavigate()

  const countdown = useFakeCountdown();

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("${import.meta.env.VITE_API_URL}/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then(setProducts)
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("token")
  
    const res = await fetch("${import.meta.env.VITE_API_URL}/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  
    const data = await res.json()
    setCart(data)
    navigate("/cart")
  }

  // Add To Cart UX with login check & toasts
  const addToCart = async (productId, productName) => {

    const token = localStorage.getItem("token")
    if (!token) {
      // Not logged in: show login required popup
      setShowLoginPopup(true);
      return;
    }
    setAddToCartLoading(true);

    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1
        })
      });

      if (!res.ok) {
        setShowLoginPopup(true)
        return
      }

      const data = await res.json();
      // Optionally, you might want to check for errors here as well
      setSuccessProductName(productName || "");
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
        setSuccessProductName("");
      }, 500);
    } catch (err) {
      // Could optionally show an error popup here
      console.log(err)
    } finally {
      setAddToCartLoading(false);
    }
  }

  // Filter logic
  const filtered = products.filter((item) => {
    const matchesCategory =
      activeCategory === "All" ||
      (item.category &&
        item.category.toLowerCase() === activeCategory.toLowerCase());
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // --- LOGIN MODAL JSX ---
  function LoginPopup() {
    return (
      <Modal open={showLoginPopup} onClose={() => setShowLoginPopup(false)}>
        <div className="flex flex-col space-y-4 items-center text-center animate-slideInUp">
          {/* Icon */}
          <svg className="w-12 h-12 text-blue-500 mb-2" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <circle cx="12" cy="11" r="5.5" />
            <path d="M5.5 21a9 9 0 0 1 13 0" strokeLinecap="round" />
          </svg>
          <div className="text-xl font-semibold text-gray-900">Login required</div>
          <div className="text-gray-600 text-sm px-2">Please log in to add items to your cart</div>
          <button
            className="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 font-semibold shadow transition"
            onClick={() => {
              setShowLoginPopup(false);
              navigate("/login");
            }}
          >
            Go to Login
          </button>
        </div>
      </Modal>
    );
  }

  // --- SUCCESS TOAST JSX ---
  function SuccessToast() {
    return (
      <Modal
        open={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        className="p-3 max-w-xs"
        backdropCls="pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2 animate-fadeIn select-none">
          <div className="rounded-full bg-green-100 p-3 mb-1 shadow-sm">
            {/* Checkmark Icon */}
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-green-700 font-semibold text-lg flex items-center gap-1">
            Added to cart <span className="text-lg">✅</span>
          </div>
          {successProductName && (
            <div className="text-sm text-gray-700">{successProductName}</div>
          )}
        </div>
      </Modal>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Popups */}
      <LoginPopup />
      <SuccessToast />

      {/* NAVBAR */}
      <nav className="bg-blue-600 py-3 px-4 flex items-center justify-between shadow">
        <div className="text-2xl font-bold text-white tracking-wide">MyShop</div>
        <div className="flex-1 mx-8 max-w-2xl">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products"
            className="w-full rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-900"
          />
        </div>
        <div className="flex gap-5 items-center">
          <button className="relative" aria-label="View cart" onClick={async () => {
            if (!open) {
              await fetchCart()
            }
            setOpen(!open)
          }}>
            <CartIcon />
            {/* (Optional) badge */}
          </button>

          {open && (
            <div className="absolute right-0 top-12 w-80 bg-white shadow-lg rounded-lg p-4 z-50">

              {cart.length === 0 ? (
                <p className="text-gray-500 text-sm">Cart is empty</p>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.cart_item_id} className="flex gap-3 mb-3">
                      <img
                        src={item.image_url}
                        className="w-12 h-12 object-cover rounded"
                      />

                      <div className="flex-1">
                        <p className="text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          x{item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-semibold">
                        ${item.price}
                      </p>
                    </div>
                  ))}

                  <button
                    className="w-full mt-3 bg-blue-600 text-white py-2 rounded"
                    onClick={() => window.location.href = "/cart"}
                  >
                    View Cart
                  </button>
                </>
              )}

            </div>
          )}
          <button aria-label="User account">
            <UserIcon />
          </button>
        </div>
      </nav>

      {/* CATEGORY MENU */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-6 px-4 py-3 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`relative font-medium transition text-gray-500 hover:text-blue-600 hover:after:bg-blue-200
                ${cat === activeCategory
                  ? "text-blue-600 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                  : ""
                }
                `}
                style={{ minWidth: 80 }}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BANNER */}
      <div className="max-w-6xl w-full mx-auto mt-6 px-4">
        <div className="rounded-2xl flex flex-col md:flex-row items-center justify-between p-8 md:p-12 bg-gradient-to-r from-blue-600 to-purple-500 shadow-lg relative overflow-hidden">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow">Flash Sale</div>
            <div className="text-lg text-blue-100/90 mb-4">Up to 50% off</div>
            <div className="flex items-center">
              <span className="bg-white text-blue-600 font-mono font-semibold rounded px-3 py-1 text-lg tracking-widest shadow">Ends in {countdown}</span>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            {/* Optional: Add an illustration or keep right empty for simplicity */}
            <img
              src="https://cdn.dribbble.com/users/527741/screenshots/10504286/media/cdbdc82b42c1b4b31ecfab0fa4b0c111.png?resize=400x0"
              alt="Flash Sale"
              className="w-40 md:w-52 rounded-xl shadow-lg"
              draggable="false"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="max-w-6xl w-full mx-auto flex-1 mt-10 mb-12 px-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="w-10 h-10 animate-spin text-blue-600" viewBox="0 0 24 24">
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-200 rounded-md px-4 py-3 text-red-600 text-center max-w-md mx-auto font-medium">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-400 text-lg">
                No products found.
              </div>
            )}
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-[1.025] flex flex-col"
              >
                <div className="p-4 pb-0">
                  <img
                    src={product.image_url || PLACEHOLDER}
                    alt={product.name}
                    className="w-full h-[160px] object-cover rounded-lg bg-gray-100"
                    loading="lazy"
                    onError={e => { e.target.src = PLACEHOLDER; }}
                    draggable="false"
                  />
                </div>
                <div className="flex-1 flex flex-col p-4 gap-2">
                  <div className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px]">{product.name}</div>
                  <div className="text-blue-600 font-semibold text-lg mb-1">${parseFloat(product.price).toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mb-3">
                    Stock: {product.stock}
                  </div>
                  <button
                    className={`
                      mt-auto w-full bg-blue-600 hover:bg-blue-700 transition text-white font-medium py-2 rounded-md shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-blue-300
                      ${addToCartLoading ? "opacity-70 cursor-not-allowed" : ""}
                    `}
                    disabled={product.stock === 0 || addToCartLoading}
                    onClick={() => addToCart(product.id, product.name)}
                    style={{ opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? "not-allowed" : "pointer" }}
                  >
                    {product.stock === 0
                      ? "Out of Stock"
                      : addToCartLoading
                        ? "Adding..."
                        : "Add to cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;