import { useState, useCallback, useEffect } from "react";
import styles from "./Card.module.css";
import clsx from "clsx";
import { Icon } from "../index";
import { useFavorite } from "@/hooks/useFavorite";
import { useBasket } from "@/hooks/useBasket";
import { useLocation } from "react-router-dom";

export function Card(props) {
  const [loading, setLoading] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const { addFavorite, isSomeFavorite, removeFavorite } = useFavorite();
  const { id, img, title, price, productId } = props;
  const location = useLocation().pathname;
  const { addProduct, isSomeProduct, removeProduct } = useBasket();

  const onClickToBasketProduct = async () => {
    if (isSomeProduct(id)) return;
    setLoading(true);
    await addProduct({ productId: id, img, title, price });
    setLoading(false);
  };

  const onClickToFavoriteProduct = async () => {
    setLoadingFavorite(true);
    if (isSomeFavorite(productId) || location === "/favorite") {
      await removeFavorite(id);
    } else {
      await addFavorite({ productId: id, img, title, price });
    }
    setLoadingFavorite(false);
  };

  return (
    <article className={styles.item}>
      {location !== "/shop" && (
        <button
          disabled={loadingFavorite}
          className={clsx(
            styles.favoriteButton,
            loadingFavorite && styles.favoriteButtonLoading,
            (isSomeFavorite(id) || location === "/favorite") &&
              styles.favoriteButtonActive,
          )}
          onClick={onClickToFavoriteProduct}
        >
          <Icon className={styles.favorite} id="favorite" />
        </button>
      )}
      <img className={styles.img} src={img} alt="sneakers" />
      <h3 className={styles.itemTitle}>{title}</h3>
      <div className={styles.wrapper}>
        <span className={styles.span}>Цена:</span>
        <span className={styles.price}>{price} руб.</span>
        {location !== "/shop" && (
          <button
            disabled={loading}
            className={clsx(
              styles.plusButton,
              loading && styles.plusButtonLoading,
              isSomeProduct(id) && styles.plusButtonActive,
            )}
            onClick={onClickToBasketProduct}
          >
            <Icon
              className={styles.plus}
              id={isSomeProduct(id) ? "checked" : "plus"}
            />
          </button>
        )}
      </div>
    </article>
  );
}
