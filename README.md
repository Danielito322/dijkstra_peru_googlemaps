
## ¿Cómo ejecutar el proyecto?

### 1. Descargar el proyecto

Primero se debe descargar o clonar este repositorio.

```bash
git clone https://github.com/Danielito322/dijkstra_peru_googlemaps.git
```

Luego entrar a la carpeta del proyecto:

```bash
cd dijkstra_peru_googlemaps
```

---

## 2. Abrir el proyecto en Visual Studio Code

Abrir la carpeta del proyecto en **Visual Studio Code**.

Dentro de la carpeta deben estar los archivos principales:

* `index.html`
* `style.css`
* `app.js`

---

## 3. Ejecutar con Live Server

Para que el mapa funcione correctamente, se recomienda abrir el archivo `index.html` usando la extensión **Live Server**.

Pasos:

1. Abrir el archivo `index.html`
2. Clic derecho dentro del archivo
3. Seleccionar la opción **Open with Live Server**
4. Se abrirá automáticamente el proyecto en el navegador

---

## Captura: abrir con Live Server

Aquí se debe colocar una captura donde se vea la opción **Open with Live Server**.

<img width="1140" height="972" alt="image" src="https://github.com/user-attachments/assets/0ff25665-8d0c-42f7-88e4-4f0ac419aab0" />


## 4. Visualización del proyecto

Al ejecutar el proyecto, se muestra un mapa visual del Perú.
El usuario puede seleccionar un departamento de origen y un departamento de destino.

Luego, al presionar el botón **Calcular ruta con Dijkstra**, el sistema muestra la ruta más corta en el mapa.

---

## Captura: página principal del proyecto

<img width="1898" height="906" alt="image" src="https://github.com/user-attachments/assets/7917523e-8170-4153-bf30-7fb3a0db9861" />


## Funcionamiento general

El proyecto representa el mapa del Perú como un grafo:

* Cada departamento es un nodo.
* Cada conexión entre departamentos vecinos es una arista.
* La distancia entre departamentos se calcula usando coordenadas geográficas.
* El algoritmo de Dijkstra busca la ruta más corta entre el origen y el destino.
* La ruta encontrada se muestra visualmente sobre Google Maps.



## Autor

**Daniel Apaza**

Repositorio:

```text
https://github.com/Danielito322/dijkstra_peru_googlemaps.git
```
  
