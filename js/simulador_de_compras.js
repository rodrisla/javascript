/* simulador_de_compras.js */
let carrito = [];

const inputNombre = document.getElementById("nombreProducto");
const inputPrecio = document.getElementById("precioProducto");
const listaCarrito = document.getElementById("listaCarrito");
const btnAgregar = document.getElementById("btnAgregar");
const btnCalcular = document.getElementById("btnCalcular");
const resultadoTotal = document.getElementById("resultadoTotal");

/* Función para agregar productos */
function agregarProducto() {
    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value);

    if (!nombre || isNaN(precio) || precio <= 0) {
        alert("Por favor, ingresá un nombre y un precio válido.");
        return;
    }

    carrito.push({ nombre, precio });
    mostrarCarrito();

    inputNombre.value = "";
    inputPrecio.value = "";
    inputNombre.focus();
}

/* Función para mostrar el carrito en la lista */
function mostrarCarrito() {
    listaCarrito.innerHTML = "";
    carrito.forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "bg-secondary", "text-light", "border-0", "mb-1");
        li.innerHTML = `
      ${index + 1}. ${item.nombre}
      <span>$${item.precio.toFixed(2)}</span>
    `;
        listaCarrito.appendChild(li);
    });
}

/* Función para calcular el total */
function calcularTotal() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agregá productos antes de calcular.");
        return;
    }

    let total = carrito.reduce((acc, item) => acc + item.precio, 0);
    let descuento = 0;

    if (total >= 20000) {
        descuento = total * 0.1;
        total -= descuento;
    }

    let mensaje = `Total de productos: ${carrito.length}\n`;
    mensaje += descuento > 0
        ? `Descuento aplicado: $${descuento.toFixed(2)}\n`
        : "No se aplicó descuento.\n";
    mensaje += `Total final: $${total.toFixed(2)}`;

    resultadoTotal.textContent = `💵 ${mensaje.replace(/\n/g, " | ")}`;
    console.log("Resumen de compra:", mensaje);
}

btnAgregar.addEventListener("click", agregarProducto);
btnCalcular.addEventListener("click", calcularTotal);
