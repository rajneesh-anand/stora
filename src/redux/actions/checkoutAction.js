import { CHECKOUT } from "../defines";

export const checkoutSuccess = (order_id, amount, message) => ({
  type: CHECKOUT.CHECKOUT_SUCCESS,
  order_id,
  amount,
  message,
});

export const checkoutFail = (message) => ({
  type: CHECKOUT.CHECKOUT_FAIL,
  message,
});
