console.log('SOY EL INDEX QUE SE ESTA EJECUTANDO');

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


// Para leer datos del formulario
app.use(express.urlencoded({ extended: true }));

// Servir archivos desde la carpeta public
app.use(express.static('public'));

// Ruta que recibe el formulario
app.post('/enviar', (req, res) => {
  const { nombre, vehiculo } = req.body;
  const ruta = path.join(__dirname, 'public', 'data.json');

  let datos = [];
  if (fs.existsSync(ruta)) {
    datos = JSON.parse(fs.readFileSync(ruta, 'utf8'));
  }

  const existe = datos.some(
    d => d.nombre === nombre && d.vehiculo === vehiculo
  );

  if (existe) {
    return res.send(`
      <h2 style="color:red">⚠️ Registro duplicado</h2>
      <a href="/">Volver</a>
    `);
  }

  datos.push({ nombre, vehiculo });
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));
  return res.redirect('/lista');
  
});




  app.get('/datos', (req, res) => {
  const ruta = path.join(__dirname, 'public', 'data.json');

  if (!fs.existsSync(ruta)) {
    return res.json([]);
  }

  const registros = JSON.parse(fs.readFileSync(ruta, 'utf8'));

  const sinDuplicados = registros.filter(
    (item, index, self) =>
      index === self.findIndex(
        r => r.nombre === item.nombre && r.vehiculo === item.vehiculo
      )
  );

  res.json(sinDuplicados);
});


  



// Página para mostrar la lista de nombres y vehículos

app.get('/lista', (req, res) => {

 res.sendFile(path.join(__dirname, 'public', 'lista.html'));
 });



  


  app.get('/test', (req, res) => {
  res.send('FUNCIONA');
});
  
  
    
    
  


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
