import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {searchPlants} from '../firebaseModel';
import {ThreeDots} from 'react-loader-spinner'
import '../styling/AddPlant.css'
/*TODO:Flytta konstanter till presenter från app */

export default function AddPlantView({addPlantToPersonalList}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [expandedPlantId, setExpandedPlantId] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef();
  const loaderRef = useRef();

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePlantClick = (plantId) => {
    if (expandedPlantId === plantId) {
      setExpandedPlantId(null);
    } else {
      setExpandedPlantId(plantId);
    }
  };

  const handleAddPlantButtonClick = (plant) => {
    addPlantToPersonalList(plant);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await searchPlants(searchTerm);
    if (result && result.length > 0) {
      setSearchResults(result);
    } else {
      setSearchResults([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observerCallback = (entries) => {
      const first = entries[0];
      if (first.isIntersecting && !isFetchingMore) {
        setIsFetchingMore(true);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isFetchingMore]);

  useEffect(() => {
    if (observer.current && searchResults.length > 0) {
      observer.current.observe(loaderRef.current);
    }
  }, [searchResults]);

  return (
    <>
    <div className="add-plant addPlant module">
      <div className="addPlantDescr">
        <h2>Connect your plant to the PotBot</h2>
        <p>First choose what kind of plant you have and we will calibrate the optimal conditions for it</p>
      </div>
      <form className="plant-form" onSubmit={handleSubmit}>
        <input
          className="api-search"
          type="text"
          placeholder="Choose your plant"
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
        <Link to="/home"> Back to your plants
        </Link>
      </form>
    </div>
      {isLoading && (
              <div className="loading">
                <ThreeDots type="ThreeDots" color="#2BAD60" height={200} width={200}/>
              </div>
            )}

      <div className="search-results-grid">
        {searchResults.map((plant, index) => (
          <div
            className="plant-card"
            key={plant.id}
            onClick={() => handlePlantClick(plant.id)}
          >
            <div key={plant.id} style={{textTransform: 'capitalize'}}>
              {plant.default_image && (
                <img
                  src={plant.default_image.original_url}
                  alt={plant.common_name}
                  width="100"
                  height="100"
                />
              )}
              <p>{plant.common_name}</p>
            </div>
            {expandedPlantId === plant.id && (
              <div className="plant-dropdown">
                <button type='submit'
                        className="add-plant-button"
                        onClick={() => handleAddPlantButtonClick(plant)}
                >
                  Add to my plants
                </button>
              </div>
            )}
            {index === searchResults.length - 1 && !isLoading && (
              <div className="load-more" ref={loaderRef}>
                {isFetchingMore && <p>Loading...</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      </>
  );
}
