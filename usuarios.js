const axios = require("axios")
const fs = require("fs")

const nuevoUsuario = async () =>{
    try{
        const {data} = await axios.get("https://randomuser.me/api")
        const usuario = data.results[0]
        const user = {
            nombre: `${usuario.name.title} ${usuario.name.first} ${usuario.name.last}`,
            debe: '',
            recibe: '',
        }
        return user
    } catch(e) {
        throw e
    }
}

const guardarUsuario = (usuario) =>{
    const usuariosJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"))
    usuariosJSON.roommates.push(usuario)
    fs.writeFileSync("roommates.json", JSON.stringify(usuariosJSON))
}


module.exports = {nuevoUsuario, guardarUsuario}