import { FaShoppingCart } from 'react-icons/fa';

import styles from './Nav.module.css';

import { useCart } from '../hooks/useCart';

const Nav = () => {
  const { subtotal, handleCheckout } = useCart();
  return (
    <nav className={styles.nav}>
      <p className={styles.navTitle}>Space Jelly Shop</p>
      <p className={styles.navCart}>
        <button onClick={handleCheckout}>
          <FaShoppingCart /> ${subtotal.toFixed(2)}
        </button>
      </p>
    </nav>
  );
};

export default Nav;
