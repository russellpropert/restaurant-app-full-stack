export default function Welcome() {
  return (
    <main className="main">
      <h1 className="title">
        Welcome to the Restaurant App
      </h1>

      <p className="description">
        This is a student project for MIT’s Professional Certificate 
        in Coding: Full Stack Development with MERN.
        This is not a real restaurant app and provides no services.
        The app displays different restaurants to choose from. 
        You can select menu items from the restaurants to add them to your cart.
        Afterwards, you can checkout by using a provided test credit card number.
      </p>

      <div className="grid">

        <a href="/createaccount" className="custom-card">
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