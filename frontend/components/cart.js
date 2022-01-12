import { context } from './context';
import { Button } from 'react-bootstrap';

export default function Cart() {
  const { cart, addOneToCart, removeOneFromCart, deleteAllOfOneItemFromCart } = context();

  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    const itemTotal = Number(cart[i].price) * Number(cart[i].quantity);
    total = total + itemTotal;
  }

  return (
    <div className="custom-card" style={{ width: "100%", maxWidth: "500px"}}>
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
              <p 
                style={{
                  fontSize: "1rem",
                  marginLeft: "16px",
                  cursor: "pointer",
                  color: "blue"
                }} 
                onClick={() => addOneToCart(item)}
              >+</p>
              <p 
                className="me-auto" 
                style={{ 
                  fontSize: "1rem",
                  marginLeft: "8px",
                  cursor: "pointer",
                  color: "blue"
                }}
                onClick={() => removeOneFromCart(item)}
              >-</p>
              <p 
                style={{ 
                  fontSize: "1rem",
                  cursor: "pointer",
                  color: "blue"
                }}
                onClick={() => deleteAllOfOneItemFromCart(item)}
              >Delete</p>
            </div>
          </div>
        ))}
      <Button className="w-100">
        Checkout Total: $ {total}
      </Button>
      </div>
    </div>
  );
}