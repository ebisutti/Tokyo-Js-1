
var catalogo = Array.isArray(window.catalogo) ? window.catalogo : []; 
var carrito = cargarCarrito();

var KEY_CARRITO = "tokyo_cart_v1";

var carrito = cargarCarrito();

function cargarCarrito() {
  var raw = localStorage.getItem(KEY_CARRITO);
  return raw ? JSON.parse(raw) : [];
}

function guardarCarrito() {
  localStorage.setItem(KEY_CARRITO, JSON.stringify(carrito));
}


function formatPrecio(n) {
  try {
    return Number(n).toLocaleString("es-AR");
  } catch (e) {
    return n;
  }
}


function resumenCarrito() {
  var mapa = {};
  for (var i = 0; i < carrito.length; i++) {
    var p = carrito[i];
    if (!mapa[p.id]) {
      mapa[p.id] = { id: p.id, nombre: p.nombre, precio: p.precio, qty: 0 };
    }
    mapa[p.id].qty = mapa[p.id].qty + 1;
  }
  var lista = [];
  for (var k in mapa) {
    if (Object.prototype.hasOwnProperty.call(mapa, k)) {
      lista.push(mapa[k]);
    }
  }
  return lista;
}

function totalCarritoCalc() {
  var resumen = resumenCarrito();
  var total = 0;
  for (var i = 0; i < resumen.length; i++) {
    total = total + (resumen[i].precio * resumen[i].qty);
  }
  return total;
}

function agregarUnaUnidadPorId(id) {

  var prod = catalogo.find(function(x) { return x.id === id; });
  if (!prod) return;
  carrito.push(prod);
  guardarCarrito();
  actualizarResumenCarrito();
}

function quitarUnaUnidadPorId(id) {
  
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id === id) {
      carrito.splice(i, 1);
      break;
    }
  }
  guardarCarrito();
  actualizarResumenCarrito();
}

function eliminarProductoPorId(id) {
 
  carrito = carrito.filter(function(p) { return p.id !== id; });
  guardarCarrito();
  actualizarResumenCarrito();
}


function actualizarResumenCarrito() {
  var total = totalCarritoCalc();
  var resumen = resumenCarrito();

 
  var qtyTotal = 0;
  for (var i = 0; i < resumen.length; i++) {
    qtyTotal = qtyTotal + resumen[i].qty;
  }

  var textoItems = qtyTotal === 1 ? "1 ítem" : (qtyTotal + " ítems");
  var totalTexto = formatPrecio(total);

  var elTotalCarrito = document.getElementById("totalCarrito");
  if (elTotalCarrito) {
    elTotalCarrito.textContent = "Carrito: " + textoItems + " — Total $ " + totalTexto;
  }

  var elBadgeCarrito = document.getElementById("badgeCarrito");
  if (elBadgeCarrito) {
    elBadgeCarrito.textContent = String(qtyTotal);
  }
}


function verCarrito() {
  var resumen = resumenCarrito();
  if (resumen.length === 0) {
    if (window.Swal) Swal.fire("Carrito", "No tenés ítems en el carrito.", "info");
    else alert("No tenés ítems en el carrito.");
    return;
  }

  var total = totalCarritoCalc();

  var lista = "<ul style=\"text-align:left; padding-left:18px; list-style:disc;\">";
  for (var i = 0; i < resumen.length; i++) {
    var item = resumen[i];
    var subtotal = item.precio * item.qty;

    lista += "<li style=\"margin-bottom:10px;\">" +
             item.nombre +
             " — $ " + formatPrecio(item.precio) +
             " <span style=\"margin-left:8px; color:#6b7280;\">(Subtotal: $ " + formatPrecio(subtotal) + ")</span>" +
             " <span style=\"margin-left:8px;\">Cantidad: " +
             "<button class=\"btn-dec\" data-id=\"" + item.id + "\" style=\"margin:0 6px; padding:2px 8px; border:1px solid #e5e7eb; border-radius:6px; background:#fff; cursor:pointer;\">–</button>" +
             "<b>" + item.qty + "</b>" +
             "<button class=\"btn-inc\" data-id=\"" + item.id + "\" style=\"margin:0 6px; padding:2px 8px; border:1px solid #e5e7eb; border-radius:6px; background:#fff; cursor:pointer;\">+</button>" +
             "</span>" +
             " <button class=\"btn-del\" data-id=\"" + item.id + "\" style=\"margin-left:10px; padding:2px 8px; font-size:12px; border:1px solid #e5e7eb; border-radius:6px; background:#fff; cursor:pointer;\">Eliminar</button>" +
             "</li>";
  }
  lista += "</ul>";

  
  if (!window.Swal) {
    alert("Carrito:\n\n" + resumen.map(function(r){ return r.nombre + " x" + r.qty + " — $ " + (r.precio * r.qty); }).join("\n") + "\n\nTotal: $ " + total);
    return;
  }

  Swal.fire({
    title: "Tu carrito",
    html: lista + "<hr><b>Total: $ " + formatPrecio(total) + "</b>",
    icon: "info",
    showCancelButton: true,
    cancelButtonText: "Cerrar",
    showDenyButton: true,
    denyButtonText: "Vaciar todo",
    didOpen: function() {
      var cont = Swal.getHtmlContainer();

      var incs = cont.querySelectorAll(".btn-inc");
      incs.forEach(function(btn) {
        btn.addEventListener("click", function() {
          var id = Number(btn.getAttribute("data-id"));
          agregarUnaUnidadPorId(id);
          verCarrito(); // refrescar modal
        });
      });

      var decs = cont.querySelectorAll(".btn-dec");
      decs.forEach(function(btn) {
        btn.addEventListener("click", function() {
          var id = Number(btn.getAttribute("data-id"));
          quitarUnaUnidadPorId(id);
          if (carrito.length > 0) verCarrito();
          else Swal.close();
        });
      });

      var dels = cont.querySelectorAll(".btn-del");
      dels.forEach(function(btn) {
        btn.addEventListener("click", function() {
          var id = Number(btn.getAttribute("data-id"));
          eliminarProductoPorId(id);
          if (carrito.length > 0) verCarrito();
          else Swal.close();
        });
      });
    }
  }).then(function(r) {
    if (r && r.isDenied) {
      carrito = [];
      guardarCarrito();
      actualizarResumenCarrito();
      Swal.fire("Listo", "Carrito vaciado.", "success");
    }
  });
}

// --- Render de la tabla del carrito (Carrito.html) ---
function renderCarritoTabla() {
  var tbody = document.getElementById("cartTableBody");
  if (!tbody) return; // si no existe, no estamos en Carrito.html

  var resumen = resumenCarrito();      // usa tu helper existente
  var total = totalCarritoCalc();      // usa tu helper existente

  tbody.innerHTML = "";

  if (resumen.length === 0) {
    var trEmpty = document.createElement("tr");
    trEmpty.innerHTML = '<td colspan="4" class="text-center text-muted py-4">Tu carrito está vacío</td>';
    tbody.appendChild(trEmpty);
  } else {
    for (var i = 0; i < resumen.length; i++) {
      var it = resumen[i];
      var subtotal = it.precio * it.qty;

      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td>' + it.nombre + '</td>' +
        '<td class="text-end">$ ' + formatPrecio(it.precio) + '</td>' +
        '<td class="text-center">' + it.qty + '</td>' +
        '<td class="text-end fw-semibold">$ ' + formatPrecio(subtotal) + '</td>';
      tbody.appendChild(tr);
    }
  }

  // Actualiza totales (soporta #cartTotal y, si existe por error de tipeo, #cardTotal)
  var elCartTotal = document.getElementById("cartTotal");
  if (elCartTotal) elCartTotal.textContent = "$ " + formatPrecio(total);

  var elCardTotal = document.getElementById("cardTotal");
  if (elCardTotal) elCardTotal.textContent = "$ " + formatPrecio(total);
}



document.addEventListener("DOMContentLoaded", function () {
  // Botón del navbar: Ver carrito
  var elBtnVerCarrito = document.getElementById("btnVerCarrito");
 
  if (elBtnVerCarrito && elBtnVerCarrito.tagName !== "A" && typeof verCarrito === "function") {
    elBtnVerCarrito.addEventListener("click", verCarrito);
  }

 
  var grid = document.getElementById("grid");
  if (grid) {
    grid.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button[data-id]");
      if (!btn) return;

      var id = Number(btn.getAttribute("data-id"));

      
      var nombre = btn.getAttribute("data-nombre");
      var precioAttr = btn.getAttribute("data-precio");

      if (nombre && precioAttr !== null) {
        var precio = Number(precioAttr);
        if (isNaN(id) || !nombre || isNaN(precio)) {
          console.warn("Datos inválidos en botón:", btn);
          alert("No se pudo agregar este producto. Revisá los datos.");
          return;
        }
        carrito.push({ id: id, nombre: nombre, precio: precio });
        guardarCarrito();
        actualizarResumenCarrito();
      } else {
       
        if (!isNaN(id) && typeof agregarUnaUnidadPorId === "function") {
          agregarUnaUnidadPorId(id);
        } else {
          console.warn("No hay data-* ni catálogo para id:", id);
          alert("No se pudo agregar este producto.");
          return;
        }
      }

      if (window.Swal) {
        Swal.fire({
          toast: true,
          position: "top",
          timer: 900,
          showConfirmButton: false,
          icon: "success",
          title: "Agregado al carrito"
        });
      } else {
        console.log("Agregado al carrito (id):", id);
      }
    });
  }


  if (typeof actualizarResumenCarrito === "function") {
    actualizarResumenCarrito();
  }
  renderCarritoTabla();
    
  var btnVaciar = document.getElementById("btnVaciarCarritoPage");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", function () {
      
      if (window.Swal) {
        Swal.fire({
          title: "¿Vaciar carrito?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, vaciar",
          cancelButtonText: "Cancelar"
        }).then(function(r){
          if (r.isConfirmed) {
            carrito = [];
            guardarCarrito();
            actualizarResumenCarrito();
            renderCarritoTabla(); 
            Swal.fire("Listo", "Carrito vaciado.", "success");
          }
        });
        return;
      }

      
      if (confirm("¿Vaciar carrito?")) {
        carrito = [];
        guardarCarrito();
        actualizarResumenCarrito();
        renderCarritoTabla();
        alert("Carrito vaciado.");
      }
    });
  }

});
