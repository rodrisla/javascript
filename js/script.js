const productos = [
  { id: 1, categoria: "accesorios", nombre: "Mascara de pestaña Tei", precio: 3900, imagen: "../imagenes/rimel.webp" },
  { id: 2, categoria: "accesorios", nombre: "Broches Moño", precio: 2700, imagen: "../imagenes/broches.webp" },
  { id: 3, categoria: "accesorios", nombre: "Balsamo Frutilla", precio: 2600, imagen: "../imagenes/balsamos.webp" },
  { id: 4, categoria: "accesorios", nombre: "Tinta Tei", precio: 3200, imagen: "../imagenes/tinta.webp" },
  { id: 5, categoria: "accesorios", nombre: "Labial Tei", precio: 3400, imagen: "../imagenes/labial.webp" },
  { id: 14, categoria: "accesorios", nombre: "Mascara Facial Mely", precio: 2500, imagen: "../imagenes/labial.webp" },


  { id: 6, categoria: "vasos", nombre: "Vaso Starbucks Vinilo", precio: 4000, imagen: "../imagenes/vasoStarbucks.webp" },
  { id: 7, categoria: "vasos", nombre: "Vaso Transparente Vinilo", precio: 3700, imagen: "../imagenes/vasoTransparente.webp" },
  { id: 8, categoria: "vasos", nombre: "Vaso Starbucks DTF", precio: 5700, imagen: "../imagenes/vasoStarbucks.webp" },
  { id: 9, categoria: "vasos", nombre: "Vaso Transparente DT", precio: 4000, imagen: "../imagenes/vasoTransparente.webp" },
  { id: 10, categoria: "vasos", nombre: "Vaso Termico DTF", precio: 6800, imagen: "../imagenes/vasoTermico.webp" },

  { id: 11, categoria: "botellas", nombre: "Botella Color DTF", precio: 6800, imagen: "../imagenes/botellaColor.webp" },
  { id: 12, categoria: "botellas", nombre: "Botella Transparente DTF", precio: 7500, imagen: "../imagenes/botellaTransparente.webp" },

  { id: 13, categoria: "cuadros", nombre: "Cuadros personalizados", precio: 35000, imagen: "../imagenes/cuadros.webp" },
];

productos.forEach(prod => {
  const contenedor = document.querySelector(`#${prod.categoria} .productos`);
  if (contenedor) {
    let card = document.createElement("div");

    card.innerHTML = `
      <div class="card-producto">
        <div class="imagen-tamanop"><img src="${prod.imagen}" alt="${prod.nombre}"></div>
        <h3>${prod.nombre} - $${prod.precio}</h3>
        <button class="btn-agregar-carrito" data-id=${prod.id}>Agregar al carrito</button>
      </div>
    `;
    contenedor.appendChild(card);
  }
});

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const botonesAgregar = document.querySelectorAll(".btn-agregar-carrito");
botonesAgregar.forEach(boton => {
  boton.addEventListener("click", (e) => {
    const idProducto = parseInt(boton.getAttribute("data-id"));
    const productoAgregado = productos.find(prod => prod.id === idProducto);
    carrito.push(productoAgregado);
    /* console.log(carrito); */
    localStorage.setItem('carrito', JSON.stringify(carrito));


    alert(`Se agregó al carrito: ${productoAgregado.nombre}`);
  });
});
console.log("Carrito actual:", carrito);




const contenedor = document.getElementById("carrito-prod");
const carritoFooter = document.getElementById("carrito-footer");
const totalSpan = document.getElementById("carrito-total");

function llenarCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p class='text-center'>El carrito está vacío.</p>";
    return;
  }
  carrito.forEach(prod => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");

    div.innerHTML = `
            <div class="carrito-item d-flex align-items-center mb-3 p-2 shadow-sm rounded">
                <img src="${prod.imagen}" alt="${prod.nombre}"">
                <div>
                    <p class="mb-1 fw-bold">${prod.nombre}</p>
                    <p class="mb-0">$${prod.precio}</p>
                </div>
            </div>
        `;

    contenedor.appendChild(div);

  });
  carritoFooter.classList.remove("d-none");
  let totalCarrito = carrito.reduce((acc, p) => acc + p.precio, 0)
  totalSpan.textContent = "$" + totalCarrito;
}


document.getElementById("btnVaciar").addEventListener("click", () => {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  totalCarrito = 0;
  totalSpan.textContent = "$" + totalCarrito;
  llenarCarrito();
});

llenarCarrito();



