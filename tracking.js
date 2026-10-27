const customerName = document.getElementById("customerName");
const deliveryAddress = document.getElementById("deliveryAddress");
const customerPhone = document.getElementById("customerPhone");
const mapStatus = document.getElementById("mapStatus");

try {
  const lastOrder = JSON.parse(localStorage.getItem("freshCartLastOrder"));
  if (lastOrder && typeof lastOrder === "object") {
    customerName.textContent = lastOrder.name || "Not provided";
    deliveryAddress.textContent = lastOrder.address || "Not provided";
    customerPhone.textContent = lastOrder.phone || "Not provided";
  }
} catch (error) {
  console.error("Could not load saved delivery details.", error);
  customerName.textContent = "Delivery details unavailable";
}

if (typeof L === "undefined") {
  mapStatus.textContent = "The map could not load. Check your internet connection and refresh the page.";
} else {
  const route = [
    [14.4673, 78.8242],
    [14.4711, 78.8218],
    [14.4742, 78.8195],
    [14.4771, 78.8168]
  ];
  const map = L.map("trackingMap").setView(route[1], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  L.polyline(route, { color: "#2f9e44", weight: 5, opacity: 0.8 }).addTo(map);
  L.marker(route[0]).addTo(map).bindPopup("Kadapa dispatch hub");
  L.marker(route[route.length - 1]).addTo(map).bindPopup("Delivery address");
  L.marker(route[1]).addTo(map).bindPopup("Sample courier location");
  map.fitBounds(route, { padding: [24, 24] });
  mapStatus.textContent = "Sample route and courier position near Kadapa.";
}
