const express = require("express")
const path = require("path")
const app = express()
const collection4 = require("./mongodb")
const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../HBS')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))

//ruta para ir ala pagina de registro
app.get('/registrar', (req, res) => {
        res.render('registrar')
    })
    //ruta para ir ala pagina de inicio "login"
app.get('/', (req, res) => {
    res.render('login')
})

app.post('/registrar', async(req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    }

    try {
        const existingUser = await collection4.findOne({ name: req.body.name })
        if (existingUser) {
            res.send("ESTA CUENTA YA EXISTE EN LA BASE DE DATOS")
        } else {
            await collection4.insertMany([data])
            res.status(201).render("perfiles", {
                naming: req.body.name
            })
        }
    } catch (error) {
        res.send("ERROR AL GUARDAR LOS DATOS DEL USUARIO")
    }
})



app.post('/login', async(req, res) => {
        try {
            const user = await collection4.findOne({ name: req.body.name })
            if (user && user.password === req.body.password) {
                res.status(201).render("perfiles", { naming: req.body.name }) //*`${req.body.password}+${req.body.name}` })
            } else {
                res.send("NOMBRE DE USUARIO INCORRECTO O CONTRASENA")
            }
        } catch (error) {
            res.send("ERROR AL INENTAR INICIAR SESION")
        }
    })
    // Nueva ruta para eliminar el perfil
app.post('/delete', async(req, res) => {
    try {
        const user = await collection4.findOneAndDelete({ name: req.body.name });
        if (user) {
            res.send("exitosamente se borro el usuario");
        } else {
            res.send("USUARIO NO ENCONTRADO");
        }
    } catch (error) {
        res.send("Error deleting profile");
    }
});

//Ruta para enviarme ala pagina de editar perfil
app.get('/edit/:name', async(req, res) => {
    try {
        const user = await collection4.findOne({ name: req.params.name });
        if (user) {
            res.render('editPerfil', { user });
        } else {
            res.send('USUARIO NO ENCONTRADO');
        }
    } catch (error) {
        res.send('ERROR AL QUERER OBTENER LOS DATOS DEL USUARIO');
    }
});

app.post('/edit/:name', async(req, res) => {
    try {
        const updatedData = {};
        if (req.body.newName) {
            updatedData.name = req.body.newName;
        }
        if (req.body.newPassword) {
            updatedData.password = req.body.newPassword;
        }

        await collection4.findOneAndUpdate({ name: req.params.name }, { $set: updatedData });
        res.send('PERFIL ACTUALIZADO CON EXITO');
    } catch (error) {
        res.send('ERROR AL QUERER ACTUALIZAR PERFIL');
    }
});

// esta ruta es para que me muestre la lista de usuarios ya creados
app.get('/usuarios', async(req, res) => {
    try {
        const usuarios = await collection4.find({});
        res.render('usuarios', { usuarios });
    } catch (error) {
        res.send('ERROR AL OBTENER LISTA DE USUARIOS');
    }
});



app.listen(port, () => {
    console.log('puerto conectado');
})

console.log('chu papi muneno')