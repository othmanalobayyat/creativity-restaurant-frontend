// src/screens/Admin/AdminOrderDetailsScreen.js
import React, { useEffect, useState } from "react";
import { fetchAdminOrderById } from "../../api/ordersApi";
import OrderDetailsView from "../../components/OrderDetailsView";

export default function AdminOrderDetailsScreen({ route }) {
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

        const json = await fetchAdminOrderById(orderId);

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

