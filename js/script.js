const url = "../js/productos.json";
let productos = [];

let carrito = JSON.parse(localStorage.getItem("carrito")) || {};

function CargarProductos() {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      productos = data;
      data.forEach(prod => {
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
    });
}

function AgregarCarrito() {
  document.addEventListener("click", e => {
    if (!e.target.classList.contains("btn-agregar-carrito")) return;

    const id = e.target.dataset.id;
    const producto = productos.find(p => p.id == id);

    if (!carrito[id]) {
      carrito[id] = {
        producto,
        cantidad: 1
      };
    } else {
      carrito[id].cantidad++;
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    LlenarCarrito();

    Toastify({
      text: `${producto.nombre} agregado`,
      duration: 2000,
      style: {
        background: "linear-gradient(to right, #8a228a, #8c4c96)"
      }
    }).showToast();
  });
}

function LlenarCarrito() {
  const contenedor = document.getElementById("carrito-prod");
  const carritoFooter = document.getElementById("carrito-footer");
  const totalSpan = document.getElementById("carrito-total");

  if (!contenedor) return;
  contenedor.innerHTML = "";

  const items = Object.values(carrito);

  if (items.length === 0) {
    contenedor.innerHTML = "<p class='text-center'>El carrito está vacío.</p>";
    totalSpan.textContent = "$0";
    carritoFooter.classList.add("d-none");
    return;
  }

  let total = 0;

  items.forEach(({ producto, cantidad }) => {
    total += producto.precio * cantidad;

    const div = document.createElement("div");
    div.classList.add("item-carrito");

    div.innerHTML = `
      <div class="carrito-item d-flex align-items-center mb-3 p-2">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="ms-3">
          <p class="fw-bold mb-1">${producto.nombre} x${cantidad}</p>
          <p class="mb-0">$${producto.precio} c/u - <strong>$${producto.precio * cantidad}</strong></p>
          <button class="btn btn-sm btn-outline-secondary menos m-2" data-id="${producto.id}">−</button>
          <button class="btn btn-sm btn-outline-secondary mas m-2" data-id="${producto.id}">+</button>
          <button class="btn btn-sm btn-outline-danger eliminar m-2" data-id="${producto.id}">✕</button>
        </div>
      </div>
    `;

    contenedor.appendChild(div);
  });

  carritoFooter.classList.remove("d-none");
  totalSpan.textContent = "$" + total;
}

document.addEventListener("click", e => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("mas")) {
    carrito[id].cantidad++;
  }

  if (e.target.classList.contains("menos")) {
    carrito[id].cantidad--;
    if (carrito[id].cantidad <= 0) delete carrito[id];
  }

  if (e.target.classList.contains("eliminar")) {
    delete carrito[id];
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  LlenarCarrito();
});

const btnVaciar = document.getElementById("btnVaciar");
btnVaciar?.addEventListener("click", () => {
  carrito = {};
  localStorage.setItem("carrito", JSON.stringify(carrito));
  LlenarCarrito();

  Toastify({
    text: "Carrito vaciado",
    duration: 2000,
    style: {
      background: "linear-gradient(to right, #8a228a, #8c4c96)"
    }
  }).showToast();
});
const btnFinalizar = document.getElementById("btnFinalizar");
const Finalizar = document.getElementById("Finalizar");

btnFinalizar?.addEventListener("click", () => {
  if (Object.keys(carrito).length === 0) {
    Swal.fire("Carrito vacío", "Agregá productos antes de comprar", "warning");
    return;
  }

  Swal.fire({
    title: "Finalizar compra",
    html: `
      <input id="nombre" class="swal2-input" placeholder="Nombre">
      <input id="email" class="swal2-input" placeholder="Email">
      <input id="direccion" class="swal2-input" placeholder="Dirección">
    `,
    confirmButtonText: "Confirmar compra",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const nombre = document.getElementById("nombre").value;
      const email = document.getElementById("email").value;
      const direccion = document.getElementById("direccion").value;

      if (!nombre || !email || !direccion) {
        Swal.showValidationMessage("Completá todos los campos");
        return false;
      }

      return { nombre, email, direccion };
    }
  }).then(result => {
    if (result.isConfirmed) {
      finalizarCompra(result.value);
    }
  });
});

function finalizarCompra(datos) {
  carrito = {};
  localStorage.removeItem("carrito");
  LlenarCarrito();

  Swal.fire({
    icon: "success",
    title: "¡Compra realizada!",
    html: `
      Gracias <strong>${datos.nombre}</strong><br>
      Te enviamos el comprobante a <strong>${datos.email}</strong>
    `
  });
}

function Init() {
  CargarProductos().then(() => {
    AgregarCarrito();
    LlenarCarrito();
  });
}


Init();
