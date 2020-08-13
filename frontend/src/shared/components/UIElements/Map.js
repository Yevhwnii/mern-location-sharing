import React, { useRef, useEffect } from "react";

import "./Map.css";

const Map = (props) => {
  // Use ref hook may be used:
  // 1. To create pointer to the real DOM node
  // 2. To create variable which will survive DOM rerender cycles
  const mapRef = useRef();

  const { center, zoom } = props;

  // Runs function below on every changes of values in arrays which passed as second argument
  // Initially it will run after JSX code has been executed
  // That means that connection between refs will be established before function runs
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });

    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}></div>
  );
};

export default Map;
