import React, { useState, useEffect } from "react";

// Card icons with selectable buttons
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

// Delete icon (functional for item removal now)
const DeleteIcon = (props) => (
  <svg
    className={
      "w-5 h-5 text-gray-400 hover:text-red-500 transition cursor-pointer " +
      (props.disabled ? "opacity-50 cursor-not-allowed" : "")
    }
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MinusIcon = ({ ...props }) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
    {...props}
  >
    <rect x="4.5" y="9" width="11" height="2" rx="1" />
  </svg>
);

const PlusIcon = ({ ...props }) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
    {...props}
  >
    <rect x="9" y="4.5" width="2" height="11" rx="1" />
    <rect x="4.5" y="9" width="11" height="2" rx="1" />
  </svg>
);

const SHIPPING = 4.99; // Fixed shipping cost

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quantity/editing/loading state for individual cart items
  const [itemLoading, setItemLoading] = useState({}); // { cart_item_id: true/false }

  // Payment fields (UI only)
  const [cardType, setCardType] = useState("visa");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Checkout state management
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch cart on mount & after updates
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

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  // Helper to set the loading state for a cart item
  const setItemLoadingState = (id, value) => {
    setItemLoading((prev) => ({ ...prev, [id]: value }));
  };

  // Update quantity - PUT to backend at /cart/item/:cart_item_id
  const updateCartItemQuantity = async (cart_item_id, newQuantity) => {
    if (newQuantity < 0) return;
    setItemLoadingState(cart_item_id, true);
    const token = localStorage.getItem("token");
    try {
      // PUT /cart/item/:cart_item_id { quantity }
      const res = await fetch(`http://localhost:3000/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          quantity: newQuantity, 
          cart_item_id: cart_item_id 
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to update cart");
      }
      await fetchCart();
    } catch (err) {
      console.error(err);
    } finally {
      setItemLoadingState(cart_item_id, false);
    }
  };

  // Remove cart item - DELETE to backend at /cart/item:id
  const removeCartItem = async (cart_item_id) => {
    setItemLoadingState(cart_item_id, true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/cart/item/${cart_item_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to remove item");
      await fetchCart();
    } catch (err) {
      console.error(err);
    } finally {
      setItemLoadingState(cart_item_id, false);
    }
  };

  // Handle checkout click
  const handleCheckout = async () => {
    if (loadingCheckout || cart.length === 0 || loading) return;
    setLoadingCheckout(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        throw new Error("Checkout failed");
      }

      setShowSuccess(true);

      setTimeout(() => {
        window.location.href = "/products";
      }, 2000);
    } catch (err) {
      setLoadingCheckout(false);
      window.alert("Checkout failed");
    }
  };

  // Get subtotal and total
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (cart.length ? SHIPPING : 0);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center max-w-sm w-full">
            <div className="text-green-500 mb-3 text-5xl">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Payment Successful
            </h2>
            <p className="text-gray-500 text-center mb-1">
              Redirecting to products...
            </p>
          </div>
        </div>
      )}

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
              {loading ? (
                <div className="py-20 flex justify-center items-center">
                  <svg className="animate-spin h-8 w-8 text-blue-400" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-16 flex items-center justify-center text-gray-400 text-lg">
                  <span>🛒</span> &nbsp; Your cart is empty.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cart_item_id}
                    className="bg-white rounded-lg shadow flex items-center gap-4 px-4 py-4 transition-all duration-200 border border-transparent hover:border-blue-200"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md border bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 line-clamp-2">{item.name}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            disabled={itemLoading[item.cart_item_id] || item.quantity <= 0}
                            onClick={() => {
                              const nextQty = item.quantity - 1;
                              if (nextQty < 1) {
                                // Remove the item if goes below 1
                                removeCartItem(item.cart_item_id);
                              } else {
                                updateCartItemQuantity(item.cart_item_id, nextQty);
                              }
                            }}
                            className={`
                              flex items-center justify-center w-8 h-8 rounded-md border border-gray-300
                              font-bold text-xl bg-gray-50 
                              transition hover:border-blue-400 hover:bg-blue-50
                              disabled:opacity-50 disabled:cursor-not-allowed
                              duration-200
                            `}
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon />
                          </button>
                          <span
                            className={`
                              min-w-[32px] text-center font-semibold text-gray-800 
                              transition-all text-base select-none
                              ${itemLoading[item.cart_item_id] ? "opacity-60" : ""}
                            `}
                          >
                            {itemLoading[item.cart_item_id] ? (
                              <svg className="inline-block h-5 w-5 text-blue-400 animate-spin" viewBox="0 0 24 24">
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8z"
                                />
                              </svg>
                            ) : item.quantity}
                          </span>
                          <button
                            disabled={itemLoading[item.cart_item_id]}
                            onClick={() =>
                              updateCartItemQuantity(item.cart_item_id, item.quantity + 1)
                            }
                            className={`
                              flex items-center justify-center w-8 h-8 rounded-md border border-gray-300
                              font-bold text-xl bg-gray-50
                              transition hover:border-blue-400 hover:bg-blue-50
                              disabled:opacity-50 disabled:cursor-not-allowed
                              duration-200
                            `}
                            aria-label="Increase quantity"
                          >
                            <PlusIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="font-semibold text-lg text-gray-800 transition-all">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        title="Remove from cart"
                        disabled={itemLoading[item.cart_item_id]}
                        onClick={() => removeCartItem(item.cart_item_id)}
                        className="
                          mt-2 rounded-full p-1
                          transition hover:bg-red-100
                          disabled:opacity-50 disabled:cursor-not-allowed
                        "
                        aria-label="Remove item"
                      >
                        <DeleteIcon disabled={itemLoading[item.cart_item_id]} />
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
                  disabled={cart.length === 0 || loading || loadingCheckout}
                  className={`mt-6 w-full py-3 font-bold rounded-xl text-lg shadow-lg
                    bg-gradient-to-r from-green-400 to-teal-400
                    transition hover:opacity-90 
                    disabled:opacity-60 disabled:cursor-not-allowed
                    flex items-center justify-center
                  `}
                  onClick={handleCheckout}
                >
                  {loadingCheckout ? (
                    <>
                      <svg className="animate-spin inline-block h-5 w-5 mr-2 text-white/80" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Checkout&nbsp;${total.toFixed(2)}
                    </>
                  )}
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