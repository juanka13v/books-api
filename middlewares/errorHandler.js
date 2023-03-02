const errorHandler = (err, req, res, next) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    // Enviar el mensaje de error personalizado al cliente
    res.status(err.statusCode).json({ message: err.message || 'Error' });


  };

  module.exports = errorHandler