/* Simulador de compras */
/* Array para guardar los productos */
let carrito = [];

/* Función para ingreso de datos */
function agregar_productos() {
  const cantidad = parseInt(prompt("¿Cuantos productos vas a comprar?"));

  for (let i = 0; i < cantidad; i++) {
    let nombre = prompt(`Ingresa el nombre del producto ${i + 1}:`);
    let precio = parseFloat(prompt(`Ingresa el precio de ${nombre}:`));

    carrito.push({ nombre, precio });
  }

  console.log("Productos ingresados: ", carrito);
  return carrito;
}

/* Función de procesamiento de datos*/
function calcular_total(lista_productos) {
  let total = 0;

  for (let producto of lista_productos) {
    total += producto.precio;
  }

  let descuento = 0;
  if (total >= 20000) {
    descuento = total * 0.1;
    total -= descuento;
    console.log(`Descuento aplicado: $${descuento.toFixed(2)}`);
  } else {
    console.log("No se aplicó descuento.");
  }

  return total;
}

/* Función de salida de datos */
function mostrar_resultado(total) {
  let mensaje = "Resumen de tu compra:\n";
  carrito.forEach((item, index) => {
    mensaje += `${index + 1}. ${item.nombre} - $${item.precio}\n`;
  });
  mensaje += `\nTotal final: $${total.toFixed(2)}`;

  alert(mensaje);
  console.log("Compra finalizada. Total a pagar: $" + total.toFixed(2));
}

/* --- Ejecución del simulador --- */
alert("¡Bienvenido al simulador de compras de Mil Detalles!");
agregar_productos();
const total_compra = calcular_total(carrito);
mostrar_resultado(total_compra);
