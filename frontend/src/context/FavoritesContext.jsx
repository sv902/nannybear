import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "../axiosConfig.js";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axios.get(`${baseUrl}/api/favorite-nannies`);
      if (response.data && Array.isArray(response.data.data)) {
        setFavoriteIds(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching favorites: ", error);
    }
  }, [isAuthenticated, baseUrl]);

  const setAuthToken = useCallback(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
      fetchFavorites();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setIsAuthenticated(false);
    }
  }, [fetchFavorites]);

  useEffect(() => {
    setAuthToken();
  }, [setAuthToken]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteNannies');
    if (storedFavorites) {
      setFavoriteIds(JSON.parse(storedFavorites));
    } else if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated, fetchFavorites]);

  const updateLocalStorage = useCallback((updatedFavorites) => {
    const storedFavorites = localStorage.getItem('favoriteNannies');
    const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    if (JSON.stringify(updatedFavorites) !== JSON.stringify(parsedFavorites)) {
      localStorage.setItem('favoriteNannies', JSON.stringify(updatedFavorites));
    }
  }, []);

  useEffect(() => {
    updateLocalStorage(favoriteIds);
  }, [favoriteIds, updateLocalStorage]);

  const toggleFavorite = async (id) => {
    const updatedFavorites = favoriteIds.some((fav) => fav.nanny_id === id)
      ? favoriteIds.filter((fav) => fav.nanny_id !== id)
      : [...favoriteIds, { nanny_id: id }];

    setFavoriteIds(updatedFavorites);
    localStorage.setItem("favoriteNannies", JSON.stringify(updatedFavorites));

    try {
      if (updatedFavorites.some((fav) => fav.nanny_id === id)) {
        await axios.post(`${baseUrl}/api/favorite-nannies`, { nanny_id: id });
      } else {
        await axios.delete(`${baseUrl}/api/favorite-nannies/${id}`);
      }
    } catch (error) {
      console.error("Error adding/removing favorite nanny", error);
      // Optionally revert the change if the API fails
      setFavoriteIds(favoriteIds);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
