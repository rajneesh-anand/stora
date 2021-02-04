import { CHECKOUT } from "../defines";

const initialState = {
  orderID: "",
  amount: "",
  message: "",
  cartItems: [],
};

export default function checkoutReducer(state = initialState, action) {
  switch (action.type) {
    case CHECKOUT.CHECKOUT_SUCCESS:
      return {
        ...state,
        orderID: action.order_id,
        amount: action.amount,
        message: action.message,
        cartItems: action.cartItems,
      };

    case CHECKOUT.CHECKOUT_FAIL:
      return {
        ...state,
        message: action.message,
      };

    default:
      return state;
  }
}
