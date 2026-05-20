import { MapContainer, TileLayer, useMap, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import { MapPin } from "lucide-react";
import L from "leaflet";
import { renderToString } from "react-dom/server";


const createCustomIcon = () => {
  return L.divIcon({
    html: renderToString(
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <MapPin size={36} color="#FF4D4D" fill="#FF4D4D" />
      </div>
    ),
    className: "", // important (default style remove)
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  });
};

// 🔥 MAP MOVE COMPONENT
function ChangeMapView({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

// 🔥 CLICK HANDLER (FIXED)
function LocationClickHandler({ setMarker, setLocationData }) {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setMarker([lat, lng]);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
        );

        const data = await res.json();

        console.log("LOCATION DATA:", data);

        // 🔥 CLEAN AREA NAME
        const area =
          data.address?.suburb ||
          data.address?.neighbourhood ||
          data.address?.road ||
          data.address?.city ||
          data.display_name;

        setLocationData({
          location: area,          // ✅ AREA NAME SAVE
          latitude: lat,
          longitude: lng
        });

      } catch (err) {
        console.log(err);

        // fallback (important)
        setLocationData({
          location: `${lat}, ${lng}`,
          latitude: lat,
          longitude: lng
        });
      }
    }
  });

  return null;
}

export default function LocationPicker({ setLocationData }) {
  const [position, setPosition] = useState([21.1458, 79.0882]); // default Nagpur
  const [marker, setMarker] = useState(null);
  const [search, setSearch] = useState("");

  // 🔍 SEARCH LOCATION
  const handleSearch = async () => {
    if (!search) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${search},India&addressdetails=1&limit=1`
      );

      const data = await res.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        setPosition([lat, lon]);
      } else {
        alert("Location not found. Try: Sitabuldi Nagpur");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>

      {/* 🔍 SEARCH BOX */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search location (e.g. Sitabuldi Nagpur)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "10px" }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* 🗺 MAP */}
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <ChangeMapView center={position} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🔥 CLICK FIX */}
        <LocationClickHandler 
          setMarker={setMarker} 
          setLocationData={setLocationData} 
        />

        {/* 🔥 MARKER */}
        {marker && (
          <Marker
  position={marker}
  icon={createCustomIcon()}
  draggable={true}
/>
        )}
      </MapContainer>

    </div>
  );
}