const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const app = express();

app.use(express.json());

function firmaHash(data) {
  // Crea un objeto de hash SHA-256
  const hash = crypto.createHash('sha256');

  // Actualiza el objeto de hash con los datos que deseas firmar
  hash.update(data);

  // Genera la firma hash en formato hexadecimal
  const firmaHash = hash.digest('hex');

  return firmaHash;
}

app.post('/webhook', (req, res) => {
  // Obtén la respuesta recibida a través del webhook
  const respuesta = req.body;

        let p_cust_id_cliente = 916473;
        let p_key             = '751cc1e3ffe39102ec612c41878e527721b900ec';

        let x_ref_payco      = respuesta.x_ref_payco;
        let x_transaction_id = respuesta.x_transaction_id;
        let x_amount         = respuesta.x_amount;
        let x_currency_code  = respuesta.x_currency_code;
        let x_signature      = respuesta.x_signature;



        let signature = firmaHash(`${p_cust_id_cliente}^${p_key}^${x_ref_payco}^${x_transaction_id}^${x_amount}^${x_currency_code}`);
        console.log(signature);
        // obtener invoice y valor en el sistema del comercio
        let numOrder = 'rezXxhxj4jQBaxbaq'; // Este valor es un ejemplo se debe reemplazar con el número de orden que tiene registrado en su sistema
        let valueOrder = 119000;  // Este valor es un ejemplo se debe reemplazar con el valor esperado de acuerdo al número de orden del sistema del comercio

        let x_response     = respuesta.x_response;
        let x_motivo       = respuesta.x_response_reason_text;
        let x_id_invoice   = respuesta.x_id_invoice;
        let x_autorizacion = respuesta.x_approval_code;
    // se valida que el número de orden y el valor coincidan con los valores recibidos
    if (x_id_invoice === numOrder && x_amount === valueOrder) {
    //Validamos la firma
        if (x_signature == signature) {
            /*Si la firma esta bien podemos verificar los estado de la transacción*/
            let x_cod_response = respuesta.x_cod_response;
            switch (x_cod_response) {
                case 1:
                    console.log("transacción aceptada");
                    //echo "transacción aceptada";
                    break;
                case 2:
                    console.log("transacción rechazada");
                    //echo "transacción rechazada";
                    break;
                case 3:
                    console.log("transacción pendiente");
                    //echo "transacción pendiente";
                    break;
                case 4:
                    console.log("transacción fallida");
                    //echo "transacción fallida";
                    break;
                }
        } else {
                res.send("Firma no válida");
                console.log("Firma no válida");
        }
    } else {
        res.send("número de orden o valor pagado no coinciden");
        console.log("número de orden o valor pagado no coinciden");
    }

  // Convierte la respuesta a formato JSON
  const respuestaJSON = JSON.stringify(respuesta);

  // Guarda la respuesta en un archivo log.json
  fs.appendFile('log.json', respuestaJSON + '\n', (err) => {
    if (err) {
      console.error('Error al guardar el registro:', err);
    } else {
      console.log('Registro guardado correctamente');
    }
  });

  res.send('Solicitud recibida con éxito');
});

app.listen(3000, () => {
  console.log('Servidor webhook escuchando en el puerto 3000');
});