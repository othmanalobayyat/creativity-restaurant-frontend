// src/screens/Profile/OrderDetailsScreen.js
import React, { useEffect, useState } from "react";
import { fetchOrderById } from "../../api/ordersApi";
import OrderDetailsView from "../../components/OrderDetailsView";

export default function OrderDetailsScreen({ route }) {
  const orderId = route.params?.orderId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!orderId) return;

    let active = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const json = await fetchOrderById(orderId);

        if (active) setData(json);
      } catch (e) {
        if (active) {
          setErr(String(e.message || e));
          setData(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [orderId]);

  return (
    <OrderDetailsView
      orderId={orderId}
      data={data}
      loading={loading}
      error={err}
    />
  );
}
