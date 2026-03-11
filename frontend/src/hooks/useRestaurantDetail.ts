import { useState } from "react";

const useRestaurantDetail = () => {
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  const openDetail = (id: number) => setSelectedStoreId(id);
  const closeDetail = () => setSelectedStoreId(null);

  return { selectedStoreId, openDetail, closeDetail };
};

export default useRestaurantDetail;
