// src/StripeProvider.js
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51Psj5C07GQO3xPIPjilUjOsVlVATNoTL4thduc4ZIK3USagAzLrl8xTYHva4j0jB44ZoyxzZiSUJ9B6Aa5ELStwc00M4LELpCy');

const StripeProvider = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
