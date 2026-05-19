import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Cursor, Card, Tabs, Button, Modal, Icon, Divider, Footer } from 'animal-island-ui';
import type { TabItem } from 'animal-island-ui';
import { DISHES, CATEGORIES } from './data';
import type { CartItem, Dish, CategoryKey } from './data';

// ── Helpers ──
function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('diancai_v2_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem('diancai_v2_cart', JSON.stringify(cart));
}

function cartTotal(cart: CartItem[]) {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function cartCount(cart: CartItem[]) {
  return cart.reduce((s, i) => s + i.qty, 0);
}

// ── Toast ──
let toastTimer: ReturnType<typeof setTimeout>;
function showToast(msg: string) {
  const el = document.getElementById('app-toast');
  if (!el) return;
  clearTimeout(toastTimer);
  el.textContent = msg;
  el.classList.add('show');
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

// ── Confetti ──
function spawnConfetti() {
  const container = document.getElementById('confetti-layer');
  if (!container) return;
  const colors = ['#5CB8A5', '#B8956A', '#7EC8A0', '#8FD4C5', '#A67C52', '#D4A574', '#C8EDE2', '#489E8E'];
  for (let i = 0; i < 40; i++) {
    const bit = document.createElement('div');
    bit.className = 'confetti-bit';
    bit.style.left = Math.random() * 100 + '%';
    bit.style.top = -(Math.random() * 100) + 'px';
    bit.style.animationDelay = Math.random() * 0.8 + 's';
    bit.style.animationDuration = 1.2 + Math.random() * 1.5 + 's';
    bit.style.background = colors[Math.floor(Math.random() * colors.length)];
    bit.style.width = 8 + Math.random() * 10 + 'px';
    bit.style.height = 8 + Math.random() * 10 + 'px';
    bit.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
    container.appendChild(bit);
    setTimeout(() => bit.remove(), 2500);
  }
}

// ── DishCard ──
const DishCard: React.FC<{
  dish: Dish;
  qty: number;
  onChangeQty: (id: number, delta: number) => void;
}> = React.memo(({ dish, qty, onChangeQty }) => {
  return (
    <Card color="app-teal">
      <div className="dish-card-inner">
        <div className="dish-emoji-box">{dish.emoji}</div>
        <div className="dish-info">
          <div className="dish-name-text">{dish.name}</div>
          <div className="dish-desc-text">{dish.desc}</div>
          <div className="dish-row">
            <span className="dish-price-text">{dish.price}</span>
            <div className="qty-row">
              {qty > 0 && (
                <>
                  <button className="qty-btn" onClick={() => onChangeQty(dish.id, -1)}>−</button>
                  <span className="qty-num">{qty}</span>
                </>
              )}
              <button
                className="qty-btn"
                style={qty === 0 ? { background: '#5CB8A5', color: '#fff', border: 'none', fontSize: '20px' } : {}}
                onClick={() => onChangeQty(dish.id, 1)}
              >
                {qty === 0 ? '+' : '+'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

// ── Menu Page ──
const MenuPage: React.FC<{ cart: CartItem[]; onChangeQty: (id: number, delta: number) => void }> = ({
  cart,
  onChangeQty,
}) => {
  const tabItems: TabItem[] = CATEGORIES.map((cat) => {
    const dishes = DISHES.filter((d) => d.category === cat.key);
    return {
      key: cat.key,
      label: `${cat.emoji} ${cat.label}`,
      children: (
        <div className="dish-grid">
          {dishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              qty={cart.find((c) => c.id === dish.id)?.qty ?? 0}
              onChangeQty={onChangeQty}
            />
          ))}
        </div>
      ),
    };
  });

  return (
    <div className="tabs-wrapper">
      <Tabs items={tabItems} defaultActiveKey="signature" />
    </div>
  );
};

// ── Lottery Page ──
const LotteryPage: React.FC<{ onAddToCart: (dish: Dish) => void }> = ({ onAddToCart }) => {
  const [spinning, setSpinning] = useState(false);
  const [currentDish, setCurrentDish] = useState<Dish>(DISHES[Math.floor(Math.random() * DISHES.length)]);
  const [resultDish, setResultDish] = useState<Dish | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSpin = useCallback(() => {
    setSpinning(true);
    setResultDish(null);
    intervalRef.current = setInterval(() => {
      setCurrentDish(DISHES[Math.floor(Math.random() * DISHES.length)]);
    }, 60);
  }, []);

  const stopSpin = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const picked = DISHES[Math.floor(Math.random() * DISHES.length)];
    setCurrentDish(picked);
    setResultDish(picked);
    setSpinning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="lottery-page">
      <div className="lottery-page-title">🎰 今天吃什么？</div>

      <Card color="app-teal">
        <div className="lottery-card-inner">
          <div className={`lottery-display${spinning ? ' spinning' : ''}${resultDish ? ' result-pop' : ''}`}>
            {currentDish.emoji}
          </div>
          <div className="lottery-name-display">{currentDish.name}</div>
          <div className="lottery-desc-display">{resultDish ? currentDish.desc : ''}</div>
          <div className="lottery-price-display">{resultDish ? `¥${currentDish.price}` : ''}</div>

          <div className="lottery-actions">
            <Button
              type="primary"
              size="large"
              onClick={spinning ? stopSpin : startSpin}
            >
              {spinning ? '停！' : resultDish ? '再来一次' : '开 始'}
            </Button>

            {resultDish && (
              <Button
                type="dashed"
                size="middle"
                onClick={() => {
                  onAddToCart(resultDish);
                  setResultDish(null);
                  showToast('✅ 已加入购物车！');
                }}
              >
                🛒 加入购物车
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

// ── Cart Modal Content ──
const CartModalBody: React.FC<{
  cart: CartItem[];
  onChangeQty: (id: number, delta: number) => void;
  onClear: () => void;
}> = ({ cart, onChangeQty, onClear }) => {
  if (cart.length === 0) {
    return <div className="cart-empty">🛒 购物车是空的哦~ 快去点菜吧！</div>;
  }

  return (
    <div className="cart-modal-body">
      {cart.map((item) => (
        <div key={item.id} className="cart-item-row">
          <div className="cart-item-emoji">{item.emoji}</div>
          <div className="cart-item-info">
            <div className="cart-item-name">{item.name}</div>
            <div className="cart-item-price">¥{item.price}</div>
          </div>
          <div className="cart-item-qty-row">
            <button className="qty-btn" onClick={() => onChangeQty(item.id, -1)}>−</button>
            <span className="qty-num">{item.qty}</span>
            <button className="qty-btn" onClick={() => onChangeQty(item.id, 1)}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Order Modal Content ──
const OrderModalBody: React.FC<{ cart: CartItem[] }> = ({ cart }) => {
  return (
    <div className="order-modal-body">
      {cart.map((item) => (
        <div key={item.id} className="order-item-row">
          <span>
            {item.emoji} <span className="order-qty-label">x{item.qty}</span> {item.name}
          </span>
          <span style={{ color: '#5CB8A5', fontWeight: 600 }}>¥{item.price * item.qty}</span>
        </div>
      ))}
      <Divider type="wave-yellow" />
      <div className="order-total">
        <span className="label">合计 </span>
        ¥{cartTotal(cart)}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// App
// ═══════════════════════════════════════════
const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [page, setPage] = useState<'menu' | 'lottery'>('menu');
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // Persist cart
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const changeQty = useCallback((id: number, delta: number) => {
    const dish = DISHES.find((d) => d.id === id);
    if (!dish) return;

    setCart((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + delta };
        return next.filter((c) => c.qty > 0);
      } else if (delta > 0) {
        return [...prev, { id: dish.id, name: dish.name, price: dish.price, emoji: dish.emoji, qty: 1 }];
      }
      return prev;
    });
  }, []);

  const addToCart = useCallback((dish: Dish) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.id === dish.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { id: dish.id, name: dish.name, price: dish.price, emoji: dish.emoji, qty: 1 }];
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCartModalOpen(false);
    showToast('购物车已清空');
  }, []);

  const handleConfirmOrder = useCallback(() => {
    setOrderModalOpen(false);
    setCart([]);
    spawnConfetti();
    showToast('✨ 下单成功！请稍等片刻~');
  }, []);

  const count = cartCount(cart);
  const total = cartTotal(cart);

  return (
    <Cursor>
      <div className="app-shell">
        {/* Toast */}
        <div className="app-toast" id="app-toast" />

        {/* Confetti */}
        <div className="confetti-layer" id="confetti-layer" />

        {/* Header */}
        <header className="app-header">
          <h1 className="app-title">🍽️ 芋頭的点菜单</h1>
          <button className="header-cart-btn" onClick={() => setCartModalOpen(true)}>
            🛒
            {count > 0 && <span className="cart-badge-dot">{count}</span>}
          </button>
        </header>

        {/* Main Content */}
        <div className="main-area">
          {page === 'menu' ? (
            <MenuPage cart={cart} onChangeQty={changeQty} />
          ) : (
            <LotteryPage onAddToCart={addToCart} />
          )}
        </div>

        {/* Cart bar */}
        <div className="cart-bar">
          <div className="cart-bar-left" onClick={() => setCartModalOpen(true)}>
            <div className="cart-bar-icon-wrap">
              🛒
              {count > 0 && <span className="cart-bar-badge">{count}</span>}
            </div>
            <span className="cart-bar-text">{count > 0 ? `共 ${count} 件` : '选点什么吧~'}</span>
          </div>
          <span className="cart-bar-total">{total}</span>
          <Button
            type="primary"
            size="middle"
            disabled={count === 0}
            onClick={() => setOrderModalOpen(true)}
            style={{ marginLeft: 12 }}
          >
            下单
          </Button>
        </div>

        {/* Bottom Nav */}
        <nav className="bottom-nav-bar">
          <button className={`nav-btn${page === 'menu' ? ' active' : ''}`} onClick={() => setPage('menu')}>
            <span className="nav-icon">🍽️</span>
            <span>菜单</span>
          </button>
          <button className={`nav-btn${page === 'lottery' ? ' active' : ''}`} onClick={() => setPage('lottery')}>
            <span className="nav-icon">🎰</span>
            <span>抽选</span>
          </button>
          <button className={`nav-btn`} onClick={() => setCartModalOpen(true)}>
            <span className="nav-icon">🛒</span>
            <span>购物车</span>
          </button>
        </nav>

        {/* Cart Modal */}
        <Modal
          open={cartModalOpen}
          title="🛒 购物车"
          onClose={() => setCartModalOpen(false)}
          footer={
            <>
              <Button onClick={() => setCartModalOpen(false)}>继续点菜</Button>
              <Button type="primary" danger onClick={clearCart}>
                清空
              </Button>
            </>
          }
          typewriter={false}
        >
          <CartModalBody cart={cart} onChangeQty={changeQty} onClear={clearCart} />
        </Modal>

        {/* Order Confirm Modal */}
        <Modal
          open={orderModalOpen}
          title="🎉 订单确认"
          onClose={() => setOrderModalOpen(false)}
          onOk={handleConfirmOrder}
          footer={
            <>
              <Button onClick={() => setOrderModalOpen(false)}>再想想</Button>
              <Button type="primary" onClick={handleConfirmOrder}>
                ✨ 确认下单
              </Button>
            </>
          }
          typewriter={false}
        >
          <OrderModalBody cart={cart} />
        </Modal>

        {/* Footer */}
        <Footer type="tree" />
      </div>
    </Cursor>
  );
};

export default App;
