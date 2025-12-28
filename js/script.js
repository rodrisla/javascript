const url = "../js/productos.json";//url del archivo JSON, para simular una API
let productos = [];//array vacio para cargar los productos

let carrito = JSON.parse(localStorage.getItem("carrito")) || {};//objeto carrito, si hay algo en localStorage lo carga, sino lo inicializa vacio

function CargarProductos() {
  return fetch(url) //llama a la URL del JSON
    .then(response => response.json())
    .then(data => {
      productos = data;//asigna los datos al array productos
      data.forEach(prod => {
        const contenedor = document.querySelector(`#${prod.categoria} .productos`);//selecciona el contenedor segun la categoria del producto
        if (contenedor) {
          let card = document.createElement("div");//crea un div para la tarjeta del producto

          card.innerHTML = `
      <div class="card-producto">
        <div class="imagen-tamanop"><img src="${prod.imagen}" alt="${prod.nombre}"></div>
        <h3>${prod.nombre} - $${prod.precio}</h3>
        <button class="btn-agregar-carrito" data-id=${prod.id}>Agregar al carrito</button>
      </div>
    `;
          contenedor.appendChild(card);//agrega la tarjeta al contenedor del producto
        }
      });
    });
}

function AgregarCarrito() {
  document.addEventListener("click", e => {//escucha los clicks en todo el documento
    if (!e.target.classList.contains("btn-agregar-carrito")) return;//si el click no es en un boton de agregar al carrito, no hace nada

    const id = e.target.dataset.id;//obtiene el id del producto desde el data-id del boton
    const producto = productos.find(p => p.id == id);//busca el producto en el array productos

    if (!carrito[id]) {//si el producto no esta en el carrito, lo agrega con cantidad 1
      carrito[id] = {
        producto,
        cantidad: 1
      };
    } else {//si ya esta en el carrito, aumenta la cantidad
      carrito[id].cantidad++;
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));//guarda el carrito en localStorage
    LlenarCarrito();

    Toastify({//muestra una notificacion de que el producto fue agregado
      text: `${producto.nombre} agregado`,
      duration: 2000,
      style: {
        background: "linear-gradient(to right, #8a228a, #8c4c96)"
      }
    }).showToast();
  });
}

function LlenarCarrito() {//funcion para llenar el carrito en el DOM
  const contenedor = document.getElementById("carrito-prod");
  const carritoFooter = document.getElementById("carrito-footer");
  const totalSpan = document.getElementById("carrito-total");

  if (!contenedor) return;
  contenedor.innerHTML = "";

  const items = Object.values(carrito);//convierte el objeto carrito en un array de items

  if (items.length === 0) {
    contenedor.innerHTML = "<p class='text-center'>El carrito está vacío.</p>";
    totalSpan.textContent = "$0";
    carritoFooter.classList.add("d-none");//oculta el footer del carrito si esta vacio
    return;
  }

  let total = 0;

  items.forEach(({ producto, cantidad }) => {//itera sobre cada item del carrito
    total += producto.precio * cantidad;

    const div = document.createElement("div");
    div.classList.add("item-carrito");
    // crea el HTML del item del carrito
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

    contenedor.appendChild(div);//agrega el item al contenedor del carrito
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

const btnVaciar = document.getElementById("btnVaciar");//boton para vaciar el carrito
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

btnFinalizar?.addEventListener("click", () => {//boton para finalizar la compra
  if (Object.keys(carrito).length === 0) {
    Swal.fire("Carrito vacío", "Agregá productos antes de comprar", "warning");//mensaje de alerta si el carrito esta vacio
    return;
  }

  Swal.fire({//mensaje para completar los datos de compra
    title: "Finalizar compra",
    html: `
      <input id="nombre" class="swal2-input" placeholder="Nombre">
      <input id="email" class="swal2-input" placeholder="Email">
      <input id="direccion" class="swal2-input" placeholder="Dirección">
    `,
    confirmButtonText: "Confirmar compra",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    preConfirm: () => {//valida que se completen todos los campos
      const nombre = document.getElementById("nombre").value;
      const email = document.getElementById("email").value;
      const direccion = document.getElementById("direccion").value;

      if (!nombre || !email || !direccion) {//si algun campo esta vacio, muestra un mensaje de validacion
        Swal.showValidationMessage("Completá todos los campos");
        return false;
      }

      return { nombre, email, direccion };//retorna los datos ingresados
    }
  }).then(result => {
    if (result.isConfirmed) {//si se confirma la compra, llama a la funcion finalizarCompra con los datos ingresados
      finalizarCompra(result.value);
    }
  });
});

function finalizarCompra(datos) {//funcion para finalizar la compra
  carrito = {};
  localStorage.removeItem("carrito");
  LlenarCarrito();

  Swal.fire({//muestra un mensaje de exito al finalizar la compra
    icon: "success",
    title: "¡Compra realizada!",
    html: `
      Gracias <strong>${datos.nombre}</strong><br>
      Te enviamos el comprobante a <strong>${datos.email}</strong>
    `
  });
}

function Init() {//funcion de inicializacion
  CargarProductos().then(() => {//carga los productos y luego inicializa el carrito
    AgregarCarrito();
    LlenarCarrito();
  });
}


Init();
