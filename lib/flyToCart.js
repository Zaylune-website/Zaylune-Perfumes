const SIZE = 56;
const CART_BUTTON_ID = "site-cart-button";

export function flyToCart(sourceEl, imageUrl) {
  if (typeof window === "undefined" || !sourceEl) return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const target = document.getElementById(CART_BUTTON_ID);
  if (!target) return;

  const from = sourceEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const startX = from.left + from.width / 2 - SIZE / 2;
  const startY = from.top + from.height / 2 - SIZE / 2;
  const dx = to.left + to.width / 2 - SIZE / 2 - startX;
  const dy = to.top + to.height / 2 - SIZE / 2 - startY;

  const bubble = document.createElement("div");
  bubble.setAttribute("aria-hidden", "true");
  Object.assign(bubble.style, {
    position: "fixed",
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${SIZE}px`,
    height: `${SIZE}px`,
    borderRadius: "9999px",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: "9999",
    background: "#fff",
    border: "2px solid #c04a1c",
    boxShadow: "0 12px 32px rgba(122,40,18,0.35), 0 0 0 6px rgba(192,74,28,0.12)",
  });

  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "";
    Object.assign(img.style, { width: "100%", height: "100%", objectFit: "cover" });
    bubble.appendChild(img);
  }

  document.body.appendChild(bubble);

  const flight = bubble.animate(
    [
      { transform: "translate(0px, 0px) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 110}px) scale(0.9) rotate(-12deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.18) rotate(8deg)`, opacity: 0.4 },
    ],
    { duration: 850, easing: "cubic-bezier(.45,0,.2,1)", fill: "forwards" }
  );
  flight.onfinish = () => bubble.remove();

  target.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.3)", offset: 0.4 },
      { transform: "scale(0.92)", offset: 0.7 },
      { transform: "scale(1)" },
    ],
    { duration: 500, delay: 700, easing: "ease-out" }
  );
}
