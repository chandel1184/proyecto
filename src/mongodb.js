const mongoose = require("mongoose")
    //aqui se conectara ala base de datos de mongo a la colecion.
mongoose.connect("mongodb://localhost:27017/Usuarios")
    .then(() => {
        console.log('CONECTADO A MONGODB');
    })
    .catch((e) => {
        console.log('FALLO A CONECTAR CON MONGODB');
    })

const logInSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    })
    //Aqui se creara la base de datos donde se almacenara los usuarios y contrasena
const collection4 = new mongoose.model('collection4', logInSchema)

module.exports = collection4