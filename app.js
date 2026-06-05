// =============================
// 1. NODOS: departamentos del Perú
// Cada nodo tiene una latitud y longitud aproximada de su capital o punto central.
// =============================
const departamentos = {
  "Amazonas": { lat: -6.2317, lng: -77.8690 },
  "Áncash": { lat: -9.5278, lng: -77.5278 },
  "Apurímac": { lat: -13.6339, lng: -72.8814 },
  "Arequipa": { lat: -16.4090, lng: -71.5375 },
  "Ayacucho": { lat: -13.1631, lng: -74.2236 },
  "Cajamarca": { lat: -7.1617, lng: -78.5128 },
  "Callao": { lat: -12.0566, lng: -77.1181 },
  "Cusco": { lat: -13.5319, lng: -71.9675 },
  "Huancavelica": { lat: -12.7864, lng: -74.9764 },
  "Huánuco": { lat: -9.9306, lng: -76.2422 },
  "Ica": { lat: -14.0678, lng: -75.7286 },
  "Junín": { lat: -12.0651, lng: -75.2049 },
  "La Libertad": { lat: -8.1116, lng: -79.0288 },
  "Lambayeque": { lat: -6.7714, lng: -79.8409 },
  "Lima": { lat: -12.0464, lng: -77.0428 },
  "Loreto": { lat: -3.7491, lng: -73.2538 },
  "Madre de Dios": { lat: -12.5933, lng: -69.1891 },
  "Moquegua": { lat: -17.1933, lng: -70.9357 },
  "Pasco": { lat: -10.6856, lng: -76.2564 },
  "Piura": { lat: -5.1945, lng: -80.6328 },
  "Puno": { lat: -15.8402, lng: -70.0219 },
  "San Martín": { lat: -6.4869, lng: -76.3597 },
  "Tacna": { lat: -18.0146, lng: -70.2536 },
  "Tumbes": { lat: -3.5669, lng: -80.4515 },
  "Ucayali": { lat: -8.3791, lng: -74.5539 }
};

// =============================
// 2. GRAFO: departamentos adyacentes
// Las aristas representan conexiones entre departamentos vecinos.
// El peso NO se escribe manualmente: se calcula con Haversine.
// =============================
const adyacencias = {
  "Tumbes": ["Piura"],
  "Piura": ["Tumbes", "Lambayeque", "Cajamarca"],
  "Lambayeque": ["Piura", "Cajamarca", "La Libertad"],
  "Cajamarca": ["Piura", "Lambayeque", "La Libertad", "Amazonas"],
  "Amazonas": ["Cajamarca", "La Libertad", "San Martín", "Loreto"],
  "La Libertad": ["Lambayeque", "Cajamarca", "Amazonas", "San Martín", "Áncash"],
  "Áncash": ["La Libertad", "Huánuco", "Lima"],
  "San Martín": ["Amazonas", "La Libertad", "Huánuco", "Loreto"],
  "Loreto": ["Amazonas", "San Martín", "Ucayali"],
  "Huánuco": ["Áncash", "San Martín", "Ucayali", "Pasco", "Lima"],
  "Ucayali": ["Loreto", "Huánuco", "Pasco", "Junín", "Cusco", "Madre de Dios"],
  "Pasco": ["Huánuco", "Ucayali", "Junín", "Lima"],
  "Junín": ["Pasco", "Ucayali", "Lima", "Huancavelica", "Ayacucho", "Cusco"],
  "Lima": ["Áncash", "Huánuco", "Pasco", "Junín", "Huancavelica", "Ica", "Callao"],
  "Callao": ["Lima"],
  "Huancavelica": ["Lima", "Junín", "Ayacucho", "Ica"],
  "Ica": ["Lima", "Huancavelica", "Ayacucho", "Arequipa"],
  "Ayacucho": ["Huancavelica", "Junín", "Cusco", "Apurímac", "Arequipa", "Ica"],
  "Apurímac": ["Ayacucho", "Cusco", "Arequipa"],
  "Cusco": ["Apurímac", "Ayacucho", "Junín", "Ucayali", "Madre de Dios", "Puno", "Arequipa"],
  "Madre de Dios": ["Ucayali", "Cusco", "Puno"],
  "Arequipa": ["Ica", "Ayacucho", "Apurímac", "Cusco", "Puno", "Moquegua"],
  "Puno": ["Cusco", "Madre de Dios", "Arequipa", "Moquegua", "Tacna"],
  "Moquegua": ["Arequipa", "Puno", "Tacna"],
  "Tacna": ["Moquegua", "Puno"]
};

let map;
let markers = [];
let lineasGrafo = [];
let lineasRuta = [];
let marcadorUsuario = null;

// =============================
// 3. Inicialización de Google Maps
// Esta función es llamada por el callback de la API.
// =============================
window.initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -9.19, lng: -75.0152 },
    zoom: 5.5,
    mapTypeId: "terrain"
  });

  cargarSelects();
  dibujarNodos();
  dibujarGrafoCompleto();

  document.getElementById("btnCalcular").addEventListener("click", calcularRuta);
  document.getElementById("btnUbicacion").addEventListener("click", usarGeolocalizacion);
  document.getElementById("btnLimpiar").addEventListener("click", limpiarRuta);
};

// =============================
// 4. Cargar departamentos en los select
// =============================
function cargarSelects() {
  const origen = document.getElementById("origen");
  const destino = document.getElementById("destino");

  Object.keys(departamentos).forEach(nombre => {
    const option1 = document.createElement("option");
    option1.value = nombre;
    option1.textContent = nombre;
    origen.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = nombre;
    option2.textContent = nombre;
    destino.appendChild(option2);
  });

  origen.value = "Lima";
  destino.value = "Puno";
}

// =============================
// 5. Dibujar marcadores de departamentos
// =============================
function dibujarNodos() {
  Object.entries(departamentos).forEach(([nombre, coord]) => {
    const marker = new google.maps.Marker({
      position: coord,
      map,
      title: nombre
    });

    const info = new google.maps.InfoWindow({
      content: `<strong>${nombre}</strong><br>Lat: ${coord.lat}<br>Lng: ${coord.lng}`
    });

    marker.addListener("click", () => info.open(map, marker));
    markers.push(marker);
  });
}

// =============================
// 6. Dibujar todas las conexiones del grafo
// =============================
function dibujarGrafoCompleto() {
  const dibujadas = new Set();

  Object.entries(adyacencias).forEach(([origen, vecinos]) => {
    vecinos.forEach(destino => {
      const clave1 = `${origen}-${destino}`;
      const clave2 = `${destino}-${origen}`;

      if (!dibujadas.has(clave1) && !dibujadas.has(clave2)) {
        const linea = new google.maps.Polyline({
          path: [departamentos[origen], departamentos[destino]],
          geodesic: true,
          strokeColor: "#64748b",
          strokeOpacity: 0.45,
          strokeWeight: 2,
          map
        });

        lineasGrafo.push(linea);
        dibujadas.add(clave1);
      }
    });
  });
}

// =============================
// 7. Fórmula de Haversine
// Calcula distancia real aproximada entre dos puntos de la Tierra.
// Resultado en kilómetros.
// =============================
function distanciaHaversine(p1, p2) {
  const R = 6371; // radio de la Tierra en km
  const dLat = gradosARadianes(p2.lat - p1.lat);
  const dLng = gradosARadianes(p2.lng - p1.lng);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(gradosARadianes(p1.lat)) * Math.cos(gradosARadianes(p2.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function gradosARadianes(grados) {
  return grados * Math.PI / 180;
}

// =============================
// 8. Construir grafo con pesos calculados
// =============================
function construirGrafoConPesos() {
  const grafo = {};

  Object.keys(departamentos).forEach(dep => {
    grafo[dep] = [];
  });

  Object.entries(adyacencias).forEach(([origen, vecinos]) => {
    vecinos.forEach(destino => {
      const peso = distanciaHaversine(departamentos[origen], departamentos[destino]);
      grafo[origen].push({ nodo: destino, peso });
    });
  });

  return grafo;
}

// =============================
// 9. Algoritmo de Dijkstra
// Encuentra la ruta de menor distancia desde origen hasta destino.
// =============================
function dijkstra(origen, destino) {
  const grafo = construirGrafoConPesos();
  const distancias = {};
  const anteriores = {};
  const visitados = new Set();

  Object.keys(grafo).forEach(nodo => {
    distancias[nodo] = Infinity;
    anteriores[nodo] = null;
  });

  distancias[origen] = 0;

  while (visitados.size < Object.keys(grafo).length) {
    let actual = null;
    let menorDistancia = Infinity;

    Object.keys(grafo).forEach(nodo => {
      if (!visitados.has(nodo) && distancias[nodo] < menorDistancia) {
        menorDistancia = distancias[nodo];
        actual = nodo;
      }
    });

    if (actual === null) break;
    if (actual === destino) break;

    visitados.add(actual);

    grafo[actual].forEach(vecino => {
      const nuevaDistancia = distancias[actual] + vecino.peso;

      if (nuevaDistancia < distancias[vecino.nodo]) {
        distancias[vecino.nodo] = nuevaDistancia;
        anteriores[vecino.nodo] = actual;
      }
    });
  }

  const ruta = [];
  let nodo = destino;

  while (nodo !== null) {
    ruta.unshift(nodo);
    nodo = anteriores[nodo];
  }

  if (ruta[0] !== origen) {
    return { ruta: [], distancia: Infinity };
  }

  return { ruta, distancia: distancias[destino] };
}

// =============================
// 10. Calcular y dibujar la ruta más corta
// =============================
function calcularRuta() {
  const origen = document.getElementById("origen").value;
  const destino = document.getElementById("destino").value;

  if (origen === destino) {
    alert("El origen y el destino no pueden ser iguales.");
    return;
  }

  limpiarRuta();

  const resultado = dijkstra(origen, destino);

  if (resultado.ruta.length === 0) {
    document.getElementById("resumen").textContent = "No existe una ruta disponible.";
    return;
  }

  dibujarRuta(resultado.ruta);
  mostrarResultado(resultado.ruta, resultado.distancia);
}

function dibujarRuta(ruta) {
  for (let i = 0; i < ruta.length - 1; i++) {
    const linea = new google.maps.Polyline({
      path: [departamentos[ruta[i]], departamentos[ruta[i + 1]]],
      geodesic: true,
      strokeColor: "#dc2626",
      strokeOpacity: 1,
      strokeWeight: 5,
      map
    });

    lineasRuta.push(linea);
  }

  const bounds = new google.maps.LatLngBounds();
  ruta.forEach(dep => bounds.extend(departamentos[dep]));
  map.fitBounds(bounds);
}

function mostrarResultado(ruta, distancia) {
  document.getElementById("resumen").innerHTML =
    `Ruta más corta encontrada: <strong>${distancia.toFixed(2)} km</strong>`;

  const lista = document.getElementById("listaRuta");
  lista.innerHTML = "";

  ruta.forEach(dep => {
    const li = document.createElement("li");
    li.textContent = dep;
    lista.appendChild(li);
  });
}

function limpiarRuta() {
  lineasRuta.forEach(linea => linea.setMap(null));
  lineasRuta = [];

  document.getElementById("resumen").textContent = "Aún no se calculó ninguna ruta.";
  document.getElementById("listaRuta").innerHTML = "";
}

// =============================
// 11. Geolocalización del usuario
// Toma la ubicación del navegador y selecciona como origen
// el departamento más cercano.
// =============================
function usarGeolocalizacion() {
  if (!navigator.geolocation) {
    alert("Tu navegador no soporta geolocalización.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    posicion => {
      const usuario = {
        lat: posicion.coords.latitude,
        lng: posicion.coords.longitude
      };

      if (marcadorUsuario) {
        marcadorUsuario.setMap(null);
      }

      marcadorUsuario = new google.maps.Marker({
        position: usuario,
        map,
        title: "Mi ubicación",
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      });

      const masCercano = departamentoMasCercano(usuario);
      document.getElementById("origen").value = masCercano.nombre;

      map.setCenter(usuario);
      map.setZoom(7);

      alert(`Tu departamento más cercano es: ${masCercano.nombre} (${masCercano.distancia.toFixed(2)} km aprox.)`);
    },
    error => {
      alert("No se pudo obtener la ubicación. Revisa los permisos del navegador.");
      console.error(error);
    }
  );
}

function departamentoMasCercano(punto) {
  let nombreCercano = null;
  let distanciaMenor = Infinity;

  Object.entries(departamentos).forEach(([nombre, coord]) => {
    const distancia = distanciaHaversine(punto, coord);
    if (distancia < distanciaMenor) {
      distanciaMenor = distancia;
      nombreCercano = nombre;
    }
  });

  return { nombre: nombreCercano, distancia: distanciaMenor };
}
