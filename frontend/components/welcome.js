export default function Welcome() {
  return (
    <main className="main">
      <h1 className="title">
        Welcome to the Restaurant App
      </h1>

      <p className="description">
      This app provides different restaurants to choose from. 
      You can select menu items and add them to your cart. 
      After adding all the items to your cart that you want, 
      you can check out by using a provided test credit card number.
      </p>

      <div className="grid">

        <a href="/createAccount" className="custom-card">
          <h2>Create Account</h2>
          <p>Just getting started? Create your account here.</p>
        </a>

        <a href="/login" className="custom-card">
          <h2>Login</h2>
          <p>Already have an account? Login here.</p>
        </a>

      </div>
    </main>
  );
}