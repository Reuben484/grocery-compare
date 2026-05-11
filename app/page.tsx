"use client";

import { useEffect, useState } from "react";
import { getProducts } from "./lib/api";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [basket, setBasket] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    load();
  }, []);

  const toggleBasket = (name: string) => {
    setBasket((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedProducts = products.filter((p) =>
    basket.includes(p.name)
  );

  // SAFE filtering to prevent crashes
  const safeSelected = selectedProducts.filter(
    (p) => p?.prices
  );

  const totals = {
    tesco: safeSelected.reduce(
      (sum, p) => sum + p.prices.tesco,
      0
    ),
    sainsburys: safeSelected.reduce(
      (sum, p) => sum + p.prices.sainsburys,
      0
    ),
  };

  const cheapestStore =
    totals.tesco < totals.sainsburys ? "Tesco" : "Sainsbury's";

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Grocery Compare
        </h1>

        <p className="text-gray-600 mb-6">
          Click products to build your basket.
        </p>

        {/* SEARCH */}
        <input
          className="w-full p-4 border rounded-xl mb-6"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* BASKET TOTAL */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-bold mb-3">
            Basket Total
          </h2>

          <p>Tesco: £{totals.tesco.toFixed(2)}</p>
          <p>Sainsbury's: £{totals.sainsburys.toFixed(2)}</p>

          <p className="mt-3 font-bold text-green-600">
            Cheapest Overall: {cheapestStore}
          </p>
        </div>

        {/* PRODUCTS */}
        <div className="space-y-4">
          {filtered.map((p, i) => {
            if (!p?.prices) return null;

            const cheapest =
              p.prices.tesco < p.prices.sainsburys
                ? "Tesco"
                : "Sainsbury's";

            return (
              <div
                key={i}
                onClick={() => toggleBasket(p.name)}
                className={`bg-white p-6 rounded-xl shadow cursor-pointer border-2 ${
                  basket.includes(p.name)
                    ? "border-green-500"
                    : "border-transparent"
                }`}
              >
                <h2 className="text-xl font-semibold mb-3">
                  {p.name}
                </h2>

                <p
                  className={
                    p.prices.tesco < p.prices.sainsburys
                      ? "font-bold text-green-600"
                      : ""
                  }
                >
                  Tesco: £{p.prices.tesco}
                </p>

                <p
                  className={
                    p.prices.sainsburys < p.prices.tesco
                      ? "font-bold text-green-600"
                      : ""
                  }
                >
                  Sainsbury's: £{p.prices.sainsburys}
                </p>

                <p className="mt-3 font-bold text-green-600">
                  Cheapest: {cheapest}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}