(function () {
  const CITY_REGISTRY = [
    // NORTH
    { key: "agra", name: "Agra", region: "North India", lat: 27.1767, lon: 78.0081 },
    { key: "delhi", name: "Delhi", region: "North India", lat: 28.6139, lon: 77.2090 },
    { key: "chandigarh", name: "Chandigarh", region: "North India", lat: 30.7333, lon: 76.7794 },
    { key: "jaipur", name: "Jaipur", region: "North India", lat: 26.9124, lon: 75.7873 },
    { key: "lucknow", name: "Lucknow", region: "North India", lat: 26.8467, lon: 80.9462 },
    { key: "amritsar", name: "Amritsar", region: "North India", lat: 31.6340, lon: 74.8723 },
    { key: "dehradun", name: "Dehradun", region: "North India", lat: 30.3165, lon: 78.0322 },
    { key: "shimla", name: "Shimla", region: "North India", lat: 31.1048, lon: 77.1734 },
    { key: "gurgaon", name: "Gurgaon", region: "North India", lat: 28.4595, lon: 77.0266 },
    { key: "faridabad", name: "Faridabad", region: "North India", lat: 28.4089, lon: 77.3178 },
    { key: "ghaziabad", name: "Ghaziabad", region: "North India", lat: 28.6692, lon: 77.4538 },
    { key: "allahabad", name: "Allahabad", region: "North India", lat: 25.4358, lon: 81.8463 },
    { key: "bareilly", name: "Bareilly", region: "North India", lat: 28.3670, lon: 79.4304 },
    { key: "bikaner", name: "Bikaner", region: "North India", lat: 28.0229, lon: 73.3119 },
    { key: "gorakhpur", name: "Gorakhpur", region: "North India", lat: 26.7606, lon: 83.3732 },
    { key: "jalandhar", name: "Jalandhar", region: "North India", lat: 31.3260, lon: 75.5762 },
    { key: "kanpur", name: "Kanpur", region: "North India", lat: 26.4499, lon: 80.3319 },
    { key: "kota", name: "Kota", region: "North India", lat: 25.2138, lon: 75.8648 },
    { key: "ludhiana", name: "Ludhiana", region: "North India", lat: 30.9010, lon: 75.8573 },
    { key: "meerut", name: "Meerut", region: "North India", lat: 28.9845, lon: 77.7064 },
    { key: "srinagar", name: "Srinagar", region: "North India", lat: 34.0837, lon: 74.7973 },
    { key: "udaipur", name: "Udaipur", region: "North India", lat: 24.5854, lon: 73.7125 },
    { key: "varanasi", name: "Varanasi", region: "North India", lat: 25.3176, lon: 82.9739 },
    { key: "aligarh" , name: "Aligarh", region: "North India", lat: 27.8974, lon: 78.0880 },


    // SOUTH
    { key: "bangalore", name: "Bangalore", region: "South India", lat: 12.9716, lon: 77.5946 },
    { key: "chennai", name: "Chennai", region: "South India", lat: 13.0827, lon: 80.2707 },
    { key: "hyderabad", name: "Hyderabad", region: "South India", lat: 17.3850, lon: 78.4867 },
    { key: "coimbatore", name: "Coimbatore", region: "South India", lat: 11.0168, lon: 76.9558 },
    { key: "madurai", name: "Madurai", region: "South India", lat: 9.9252, lon: 78.1198 },
    { key: "vijayawada", name: "Vijayawada", region: "South India", lat: 16.5062, lon: 80.6480 },
    { key: "visakhapatnam", name: "Visakhapatnam", region: "South India", lat: 17.6868, lon: 83.2185 },

    // EAST
    { key: "kolkata", name: "Kolkata", region: "East India", lat: 22.5726, lon: 88.3639 },
    { key: "bhubaneswar", name: "Bhubaneswar", region: "East India", lat: 20.2961, lon: 85.8245 },
    { key: "patna", name: "Patna", region: "East India", lat: 25.5941, lon: 85.1376 },
    { key: "ranchi", name: "Ranchi", region: "East India", lat: 23.3441, lon: 85.3096 },
    { key: "cuttack", name: "Cuttack", region: "East India", lat: 20.4625, lon: 85.8830 },
    { key: "dhanbad", name: "Dhanbad", region: "East India", lat: 23.7957, lon: 86.4304 },
    { key: "durgapur", name: "Durgapur", region: "East India", lat: 23.5204, lon: 87.3119 },
    { key: "guwahati", name: "Guwahati", region: "East India", lat: 26.1445, lon: 91.7362 },
    { key: "puri", name: "Puri", region: "East India", lat: 19.8135, lon: 85.8312 },
    { key: "rourkela", name: "Rourkela", region: "East India", lat: 22.2604, lon: 84.8536 },
    { key: "aizawl", name: "Aizawl", region: "East India", lat: 23.7271, lon: 92.7176 },
    { key: "imphal", name: "Imphal", region: "East India", lat: 24.8170, lon: 93.9368 },
    { key: "itanagar", name: "Itanagar", region: "East India", lat: 27.0844, lon: 93.6053 },
    { key: "gangtok", name: "Gangtok", region: "East India", lat: 27.3389, lon: 88.6065 },

    // WEST
    { key: "mumbai", name: "Mumbai", region: "West India", lat: 19.0760, lon: 72.8777 },
    { key: "pune", name: "Pune", region: "West India", lat: 18.5204, lon: 73.8567 },
    { key: "ahmedabad", name: "Ahmedabad", region: "West India", lat: 23.0225, lon: 72.5714 },
    { key: "surat", name: "Surat", region: "West India", lat: 21.1702, lon: 72.8311 },
    { key: "thane", name: "Thane", region: "West India", lat: 19.2183, lon: 72.9781 },
    { key: "navi_mumbai", name: "Navi Mumbai", region: "West India", lat: 19.0330, lon: 73.0297 },
    { key: "nashik", name: "Nashik", region: "West India", lat: 19.9975, lon: 73.7898 },
    { key: "aurangabad", name: "Aurangabad", region: "West India", lat: 19.8762, lon: 75.3433 },
    { key: "rajkot", name: "Rajkot", region: "West India", lat: 22.3039, lon: 70.8022 },
    { key: "vadodara", name: "Vadodara", region: "West India", lat: 22.3072, lon: 73.1812 },
    { key: "gandhinagar", name: "Gandhinagar", region: "West India", lat: 23.2156, lon: 72.6369 },

    // CENTRAL
    { key: "nagpur", name: "Nagpur", region: "Central India", lat: 21.1458, lon: 79.0882 },
    { key: "bhopal", name: "Bhopal", region: "Central India", lat: 23.2599, lon: 77.4126 },
    { key: "indore", name: "Indore", region: "Central India", lat: 22.7196, lon: 75.8577 },
    { key: "jabalpur", name: "Jabalpur", region: "Central India", lat: 23.1815, lon: 79.9864 },
    { key: "gwalior", name: "Gwalior", region: "Central India", lat: 26.2183, lon: 78.1828 },
    { key: "raipur", name: "Raipur", region: "Central India", lat: 21.2514, lon: 81.6296 },
    { key: "bilaspur", name: "Bilaspur", region: "Central India", lat: 22.0797, lon: 82.1409 }
  ];

  const HUBS = {
    "North India": "delhi",
    "West India": "mumbai",
    "South India": "bangalore",
    "East India": "kolkata",
    "Central India": "nagpur"
  };

  function distanceKm(a, b) {
    const R = 6371;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLon = (b.lon - a.lon) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180;
    const lat2 = b.lat * Math.PI / 180;

    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  function etaFromDistance(km) {
    if (km <= 300) return "2–3 days";
    if (km <= 700) return "3–4 days";
    if (km <= 1200) return "4–5 days";
    return "5–6 days";
  }

  const NETWORK = {};

  CITY_REGISTRY.forEach(city => {
    NETWORK[city.key] = {
      name: city.name,
      region: city.region,
      role: HUBS[city.region] === city.key ? "Hub" : "Transit",
      lat: city.lat,
      lon: city.lon,
      incoming: [],
      outgoing: []
    };
  });

  CITY_REGISTRY.forEach(city => {
    const fromNode = NETWORK[city.key];

    CITY_REGISTRY.forEach(target => {
      if (city.key === target.key) return;
      if (city.region !== target.region) return;

      const km = distanceKm(city, target);
      if (km > 800) return;

      const eta = etaFromDistance(km);

      fromNode.outgoing.push({ to: target.name, eta });
      NETWORK[target.key].incoming.push({ from: city.name, eta });
    });
  });

  window.CITY_NETWORK = NETWORK;

})();
