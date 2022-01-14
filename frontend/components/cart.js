import { context } from './context';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import styles from '../styles/Cart.module.css';

export default function Cart({ type }) {
  const { cart, addOneToCart, removeOneFromCart, deleteAllOfOneItemFromCart } = context();

  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    const itemTotal = Number(cart[i].price) * Number(cart[i].quantity);
    total = total + itemTotal;
  }

  return (
    <div className={styles.cartCard} style={{ width: "100%", maxWidth: "500px"}}>
      <h2 style={{ textAlign: "center" }}>Your Selections</h2>
      <div>
        {cart.map(item => (
          <div key={item.id}>
            <div className="d-flex">
              <p className="me-auto">{item.name}</p>
              <p>${Number(item.price) * Number(item.quantity)}</p>
            </div>
            <div>
              <p style={{ fontSize: ".9rem" }}>From {item.restaurant}</p>
            </div>
            <div className="d-flex" style={{ marginBottom: "10px"}}>
              <p style={{ fontSize: "1rem" }}>Qty {item.quantity}</p>
              {
                type !== 'checkout' && (
                  <>
                    <div
                      className={styles.cartButton}
                      style={{marginLeft: "16px"}} 
                      onClick={() => addOneToCart(item)}
                    >+</div>
                    <div
                      className={`${styles.cartButton} me-auto`}
                      style={{marginLeft: "10px"}}
                      onClick={() => removeOneFromCart(item)}
                    >-</div>
                    <div
                      className={styles.cartButton}
                      onClick={() => deleteAllOfOneItemFromCart(item)}
                    >Delete</div>
                  </>
                )
              }
            </div>
          </div>
        ))}
        <h2 style={{ textAlign: "center" }}>Total: $ {total}</h2>
          {
            type === 'order' &&
            <Link href="/checkout">
              <a>
                <Button className="w-100">Checkout</Button>
              </a>
            </Link>
          }
          {
            type === 'checkout' &&
            <Link href="/">
              <a>
                <Button className="w-100">Back To Restaurants</Button>
              </a>
            </Link>
          }
      </div>
    </div>
  );
}