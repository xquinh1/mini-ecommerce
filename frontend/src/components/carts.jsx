import React, { useState, useEffect } from "react";

// Card icons with selectable buttons (mock selection state UI)
const CardIcons = ({ selected, onSelect }) => (
  <div className="flex space-x-3 mb-5">
    <button
      type="button"
      aria-label="Select Visa"
      onClick={() => onSelect("visa")}
      className={`flex items-center justify-center w-10 h-10 rounded-xl border transition
        ${
          selected === "visa"
            ? "border-white bg-white/20 ring-2 ring-white/30"
            : "border-white/30 bg-white/10 hover:bg-white/15"
        }`}
    >
      <svg className="h-6 w-6" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="10" fill="#F0F4FF" />
        <text x="24" y="31" fontSize="20" textAnchor="middle" fill="#2D61E7" fontWeight="bold">
          V
        </text>
      </svg>
    </button>
    <button
      type="button"
      aria-label="Select MasterCard"
      onClick={() => onSelect("mastercard")}
      className={`flex items-center justify-center w-10 h-10 rounded-xl border transition
        ${
          selected === "mastercard"
            ? "border-white bg-white/20 ring-2 ring-white/30"
            : "border-white/30 bg-white/10 hover:bg-white/15"
        }`}
    >
      <svg className="h-6 w-6" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="10" fill="#F0F4FF" />
        <circle cx="20" cy="24" r="10" fill="#F04724" fillOpacity="0.9" />
        <circle cx="28" cy="24" r="10" fill="#FABD06" fillOpacity="0.9" />
      </svg>
    </button>
  </div>
);

// Delete icon (UI only, no functionality yet)
const DeleteIcon = (props) => (
  <svg
    className="w-5 h-5 text-gray-400 hover:text-red-500 transition cursor-pointer"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SHIPPING = 4.99; // Fixed shipping cost

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Payment fields (UI only)
  const [cardType, setCardType] = useState("visa");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCart(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (cart.length ? SHIPPING : 0);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* LEFT Column - Cart */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Shopping cart</h2>
            <p className="text-gray-500 mb-6">
              {loading
                ? "Loading..."
                : cart.length === 0
                ? "Cart is empty"
                : `You have ${cart.length} item${cart.length > 1 ? "s" : ""} in your cart`}
            </p>
            <div className="flex flex-col gap-5 flex-1">
              {loading ? null : cart.length === 0 ? (
                <div className="py-16 flex items-center justify-center text-gray-400 text-lg">
                  <span>🛒</span> &nbsp; Your cart is empty.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cart_item_id}
                    className="bg-white rounded-lg shadow flex items-center gap-4 px-4 py-4"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md border bg-gray-100"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 line-clamp-2">{item.name}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        Quantity: <span className="text-gray-700">{item.quantity}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="font-semibold text-lg text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button title="Remove from cart" className="mt-2">
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* RIGHT Column - Payment */}
          <div className="w-full md:w-80">
            <div className="sticky top-6 h-fit">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white flex flex-col">
                {/* Payment Form */}
                <form autoComplete="off">
                  <h3 className="text-xl font-semibold mb-1">Card Details</h3>
                  <p className="mb-6 text-white/70 text-sm">Complete your payment information.</p>
                  {/* Card Type */}
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-white/90">Card Type</label>
                    <CardIcons selected={cardType} onSelect={setCardType} />
                  </div>
                  {/* Name on Card */}
                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-white/80">
                      Name on card
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-white/40 transition"
                      value={nameOnCard}
                      onChange={e => setNameOnCard(e.target.value)}
                      placeholder="Full name"
                      autoComplete="cc-name"
                    />
                  </div>
                  {/* Card Number */}
                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-white/80">
                      Card number
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-white/40 transition"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      autoComplete="cc-number"
                      maxLength={19}
                      inputMode="numeric"
                    />
                  </div>
                  {/* Expiration + CVV */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <label className="block mb-2 text-sm font-medium text-white/80">
                        Exp. Date
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-white/40 transition"
                        value={expDate}
                        onChange={e => setExpDate(e.target.value)}
                        placeholder="MM/YY"
                        autoComplete="cc-exp"
                        maxLength={5}
                        inputMode="numeric"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block mb-2 text-sm font-medium text-white/80">
                        CVV
                      </label>
                      <input
                        type="password"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 placeholder-white/60 text-white outline-none focus:ring-2 focus:ring-white/40 transition"
                        value={cvv}
                        onChange={e => setCvv(e.target.value)}
                        placeholder="•••"
                        autoComplete="cc-csc"
                        maxLength={4}
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  {/* Accepted Cards */}
                  <div className="flex items-center gap-2 mb-8">
                    <span className="text-xs text-white/60">Accepted:</span>
                    <div className="flex gap-2">
                      {/* Show both card icons, not selectable here */}
                      <svg className="h-5 w-5" viewBox="0 0 48 48" fill="none">
                        <rect width="48" height="48" rx="10" fill="#F0F4FF" />
                        <text x="24" y="30" fontSize="18" textAnchor="middle" fill="#2D61E7" fontWeight="bold">
                          V
                        </text>
                      </svg>
                      <svg className="h-5 w-5" viewBox="0 0 48 48" fill="none">
                        <rect width="48" height="48" rx="10" fill="#F0F4FF" />
                        <circle cx="20" cy="24" r="10" fill="#F04724" fillOpacity="0.9" />
                        <circle cx="28" cy="24" r="10" fill="#FABD06" fillOpacity="0.9" />
                      </svg>
                    </div>
                  </div>
                </form>
                {/* Divider */}
                <hr className="border-white/20 my-2" />
                {/* Summary Section */}
                <div className="mt-3 mb-2 space-y-2">
                  <div className="flex justify-between text-sm text-white/80">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Shipping</span>
                    <span>${cart.length ? SHIPPING.toFixed(2) : "0.00"}</span>
                  </div>
                  <div className="border-t border-white/20 my-2" />
                  <div className="flex justify-between items-center text-lg font-bold text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                {/* Checkout Button */}
                <button
                  disabled={cart.length === 0 || loading}
                  className={`mt-6 w-full py-3 font-bold rounded-xl text-lg shadow-lg
                    bg-gradient-to-r from-green-400 to-teal-400
                    transition hover:opacity-90 
                    disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  Checkout &nbsp; ${total.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;