const http = require('http')
const fs = require('fs')
const {nuevoUsuario, guardarUsuario} = require("./usuarios")
const {v4:uuidv4} = require("uuid")
const url = require('url')

http.createServer( (req,res) => {
    if(req.url == '/' && req.method == 'GET'){
        res.setHeader("content-type", "text/html")
        res.end(fs.readFileSync("index.html","utf8"))
    }
    if(req.url.startsWith("/roommate") && req.method == "POST"){
        nuevoUsuario().then(async (usuario)=>{
            guardarUsuario(usuario)
            res.end(JSON.stringify(usuario))
            console.log('Usuario ingresado');

        }).catch(e=>{
            res.statusCode = 500
            res.end()
            console.log("Error en el registro de roommate" ,e)
        })

    }
    if(req.url.startsWith("/roommate") && req.method == "GET"){
        res.setHeader("content-type", "application/json")
        res.end(fs.readFileSync("roommates.json", "utf8"))
    }
    if(req.url.startsWith("/gastos") && req.method == "GET"){
        res.setHeader("content-type", "application/json")
        res.end(fs.readFileSync("gastos.json", "utf8"))
    }
    if(req.url.startsWith('/gasto') && req.method == 'POST'){
        let body;

        req.on('data',(payload) => {
            body = JSON.parse(payload);
        });

        req.on('end',() => {
            gasto = {
                id: uuidv4(),
                roommate: body.roommate,
                descripcion: body.descripcion,
                monto: body.monto
            };
            const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"))
            gastosJSON.gastos.push(gasto);
            fs.writeFileSync('gastos.json',JSON.stringify(gastosJSON));
            res.end();
            console.log('Gasto ingresado');
        })
    }
    if(req.url.startsWith("/gasto") && req.method == "PUT"){
        let body;
        const { id } = url.parse(req.url,true).query;

        req.on('data',(payload) => {
            body = JSON.parse(payload);
            body.id = id;
        });
        req.on('end', () => {
            const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"))
            const gastos = gastosJSON.gastos.map((gasto) => {
                if ( gasto.id == body.id){
                    return body;
                }
                return gasto;
            });

            fs.writeFileSync('gastos.json',JSON.stringify({gastos}));
            res.end()
            console.log('Gasto editado');
        })
    }
    if(req.url.startsWith('/gasto') && req.method == 'DELETE') {

        const { id } = url.parse(req.url,true).query;

        const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"))
        const gastos = gastosJSON.gastos.filter((gasto) => gasto.id !== id);

        fs.writeFileSync('gastos.json',JSON.stringify({gastos}));
        res.end();
        console.log('Gasto eliminado');
    }


}).listen(3000, console.log("http://localhost:3000"))