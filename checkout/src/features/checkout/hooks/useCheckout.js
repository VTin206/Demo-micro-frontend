import { useMemo, useState } from "react";
import {
  confirmMockPayment,
  getCheckoutOrder
} from "../services/checkoutService";

const defaultCheckoutForm = {
  fullName: "Nguyen An",
  address: "123 Nguyen Hue, Ho Chi Minh City",
  method: "Cash on delivery"
};

export function useCheckout() {
  const [order] = useState(getCheckoutOrder);
  const [form, setForm] = useState(defaultCheckoutForm);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("Payment is not submitted");

  const totalQuantity = useMemo(
    () => order.items.reduce((sum, item) => sum + item.quantity, 0),
    [order.items]
  );

  const updateField = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value
    }));
  };

  const submitPayment = (event) => {
    event.preventDefault();
    const nextResult = confirmMockPayment({
      customer: form,
      items: order.items,
      total: order.total
    });

    setResult(nextResult);
    setStatus(`Mock payment submitted successfully: ${nextResult.id}`);
  };

  return {
    order,
    form,
    status,
    result,
    paymentSubmitted: Boolean(result),
    totalQuantity,
    updateField,
    submitPayment
  };
}
