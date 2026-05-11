import { products } from "../data/products";

export const getProducts = async () => {
  await new Promise((res) => setTimeout(res, 300));
  return products;
};