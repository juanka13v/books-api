const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: cloudinary.cloud_name,
  api_key: cloudinary.api_key,
  api_secret: cloudinary.api_secret,
});

// Función para subir el archivo JSON y las imágenes a Cloudinary
async function subirArchivoYImagenes(uri, data, cloudinary) {
  try {
    // Conexión a la base de datos de MongoDB con Mongoose
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conexión exitosa a la base de datos de MongoDB");

    // Parsear el archivo JSON con los datos a subir
    const datos = JSON.parse(data);

    // Subir las imágenes a Cloudinary y obtener las URLs de las imágenes subidas
    const urls = await Promise.all(
      datos.map(async (dato) => {
        if (dato.imagen) {
          const result = await cloudinary.uploader.upload(dato.imagen, {
            folder: "carpeta_de_imagenes",
          });
          return result.secure_url;
        } else {
          return null;
        }
      })
    );

    // Reemplazar las propiedades 'imagen' por las URLs de las imágenes subidas
    datos.forEach((dato, index) => {
      if (dato.imagen) {
        dato.imagen = urls[index];
      }
    });

    // Crear los objetos en la base de datos de MongoDB
    const objetos = await Modelo.create(datos);
    console.log("Los objetos han sido creados en la base de datos de MongoDB");
  } catch (error) {
    console.error(error);
  } finally {
    // Desconexión de la base de datos de MongoDB
    await mongoose.disconnect();
    console.log("Desconexión exitosa de la base de datos de MongoDB");
  }
}
