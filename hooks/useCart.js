import { useState, useEffect, createContext, useContext } from 'react';
import { initiateCheckout } from '../lib/paymentHandler';
import products from '../products.json';

const defaultCart = {
  basket: {},
};

export const CartContext = createContext();

export const useCartState = () => {
  const [cart, updateCart] = useState(defaultCart);

  useEffect(() => {
    const cartFromStorage = window.localStorage.getItem('shopping_cart');
    const persistedCartState = cartFromStorage && JSON.parse(cartFromStorage);
    if (persistedCartState) {
      updateCart(persistedCartState);
    }
  }, []);

  useEffect(() => {
    const cartToBePersisted = JSON.stringify(cart);
    window.localStorage.setItem('shopping_cart', cartToBePersisted);
  }, [cart]);

  const cartItems = Object.keys(cart.basket).map((key) => {
    const productInBasket = products.find(({ id }) => `${id}` === `${key}`);
    return {
      ...cart.basket[key],
      pricePerItem: productInBasket.price,
    };
  });

  const subtotal = cartItems.reduce((accumulator, { pricePerItem, qty }) => {
    return accumulator + pricePerItem * qty;
  }, 0);

  const totalItems = cartItems.reduce((accumulator, { qty }) => {
    return accumulator + qty;
  }, 0);

  const handleCheckout = () => {
    initiateCheckout({
      lineItems: cartItems.map((item) => {
        return {
          price: item.id,
          quantity: item.qty,
        };
      }),
    });
  };

  const addToCart = ({ id } = {}) => {
    updateCart((prevState) => {
      let cartCurrentState = { ...prevState }; //immutability
      if (cartCurrentState.basket[id]) {
        cartCurrentState.basket[id].qty = cartCurrentState.basket[id].qty + 1;
      } else {
        cartCurrentState.basket[id] = {
          id,
          qty: 1,
        };
      }
      return cartCurrentState;
    });
  };

  return {
    cart,
    cartItems,
    subtotal,
    totalItems,
    handleCheckout,
    addToCart,
  };
};

export const useCart = () => {
  const cart = useContext(CartContext);
  return cart;
};
