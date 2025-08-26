const NEGOCIO = "Tokyo Photolab";  

    // Pregunta inicial al usuario
    let esComunidad = confirm("¿Ya sos parte de la comunidad de " + NEGOCIO + "?");

    let nombreUsuario = "Visitante";
    let esInvitado = true;

     if (esComunidad) {
        let nombre = prompt("¡Genial! Ingresá tu nombre:");
        if (nombre !== "") {
        alert("¡Bienvenid@ de nuevo, " + nombre + "! Gracias por seguir siendo parte de " + NEGOCIO + " 📸");
        console.log("Miembro:", nombre);
        }
        else {
        alert("Ingresaste sin nombre, pero igual sos parte de la comunidad de " + NEGOCIO);
        console.log("Miembro sin nombre");
      }
    }
    else {
        alert("¡Bienvenid@ a " + NEGOCIO + "! Gracias por visitarnos ✨");
        console.log("Visitante nuevo");
        }

  // Menú de categorías (array)
  const categorias = [
    "Cámaras analógicas",
    "Rollos 35mm",
    "Revelado",
    "Escaneo",
    "Impresiones",
    "Ver todo"
  ];

  function menuCategorias() {
      while (true) {
        let texto = "¿Qué te interesa ver?\n";
        for (let i = 0; i < categorias.length; i++) {
          texto += (i + 1) + ") " + categorias[i] + "\n";
        }
        texto += "0) Salir";

        const entrada = prompt(texto);

        if (entrada === null) {
          alert("Operación cancelada.");
          return null;
        }
        if (entrada === "0") {
          return 0;
        }

        
        let opcionValida = false;
        let posicion = -1;

        for (let j = 0; j < categorias.length; j++) {
          const numeroComoTexto = "" + (j + 1);
          if (entrada === numeroComoTexto) {
            opcionValida = true;
            posicion = j;
            break;
          }
        }

        if (opcionValida) {
          return posicion + 1; 
        }

        alert("Opción inválida. Escribí un número del 0 al " + categorias.length + ".");
      }
    }

    const seleccionNumerica = menuCategorias();

    if (seleccionNumerica !== null) {
      if (seleccionNumerica === 0) {
        alert("Gracias por visitar " + NEGOCIO + ".");
        console.log("El usuario eligió salir del menú.");
      } else {
        const seleccion = categorias[seleccionNumerica - 1];
        alert("Elegiste: " + seleccion);
        console.log("Categoría elegida:", seleccion);
      }
    }