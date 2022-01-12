import { context } from './context';

export default function Cart() {
  const { cart } = context();

  return (
    <div className="custom-card" style={{ width: "100%", maxWidth: "400px", textAlign: 'center'}}>
      <h2>Your Selections</h2>
      {cart.map(item => (<p key={item.id}>{item.id}</p>))}
    </div>
  );
}