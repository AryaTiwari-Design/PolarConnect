import { useEffect, useState } from "react";
import { Compass, RadioTower } from "lucide-react";
import {
  Circle,
  LayersControl,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  ScaleControl,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { stationApi } from "../../services/api";

function stationIcon(active = false) {
  return L.divIcon({
  className: `station-leaflet-marker ${active ? "active" : ""}`,
  html: "<span></span>",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
  });
}

function MapFocus({ station }) {
  const map = useMap();

  useEffect(() => {
    if (station) {
      map.flyTo([station.latitude, station.longitude], 3.2, { duration: 0.8 });
    }
  }, [map, station]);

  return null;
}

export default function MapPage() {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    stationApi.list().then((items) => {
      setStations(items);
      setSelected(items[0]);
    });
  }, []);

  const stationPath = stations.map((station) => [station.latitude, station.longitude]);

  return (
    <section className="map-page">
      <div className="learning-hero map-hero">
        <div>
          <p className="eyebrow">Antarctica explorer</p>
          <h1>Discover India's polar research stations</h1>
          <p>Tap a station to learn where it is, what scientists study there, and why it matters.</p>
        </div>
        <Compass size={48} />
      </div>
      <div className="station-tabs">
        {stations.map((station) => (
          <button
            type="button"
            key={station.id}
            className={selected?.id === station.id ? "active" : ""}
            onClick={() => setSelected(station)}
          >
            <RadioTower size={16} />
            {station.name}
          </button>
        ))}
      </div>
      <div className="map-layout">
        <div className="antarctica-map leaflet-map-wrap" aria-label="Antarctica research map">
          <MapContainer
            center={[-74, 38]}
            zoom={3}
            minZoom={2}
            maxZoom={6}
            scrollWheelZoom
            className="leaflet-map"
            worldCopyJump
            maxBounds={[[-90, -180], [-58, 180]]}
            maxBoundsViscosity={0.7}
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Satellite">
                <TileLayer
                  attribution="Tiles &copy; Esri"
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Street map">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            <ScaleControl position="bottomleft" />
            <Circle
              center={[-90, 0]}
              radius={2600000}
              pathOptions={{ color: "#7ff1e8", weight: 2, dashArray: "8 10", fillOpacity: 0 }}
            />
            {stationPath.length > 1 && (
              <Polyline
                positions={stationPath}
                pathOptions={{ color: "#ffb454", weight: 3, dashArray: "6 8", opacity: 0.9 }}
              />
            )}
            <MapFocus station={selected} />
            {stations.map((station) => (
              <Marker
                key={station.id}
                position={[station.latitude, station.longitude]}
                icon={stationIcon(selected?.id === station.id)}
                eventHandlers={{ click: () => setSelected(station) }}
              >
                <Tooltip direction="top" offset={[0, -16]} opacity={1} permanent={selected?.id === station.id}>
                  {station.name}
                </Tooltip>
                <Popup>
                  <strong>{station.name}</strong>
                  <p>{station.region}</p>
                  <button type="button" onClick={() => setSelected(station)}>View station</button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        {selected && (
          <article className="station-panel">
            <p className="eyebrow">Selected station</p>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
            <div className="station-stats">
              <div><strong>{selected.country}</strong><span>Country</span></div>
              <div><strong>{selected.topics.length}</strong><span>Research themes</span></div>
            </div>
            <dl>
              <div><dt>Region</dt><dd>{selected.region}</dd></div>
              <div><dt>Coordinates</dt><dd>{selected.latitude}, {selected.longitude}</dd></div>
            </dl>
            <h3>Research themes</h3>
            <div className="sources">{selected.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
          </article>
        )}
      </div>
    </section>
  );
}
