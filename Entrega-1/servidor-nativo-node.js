
import http from "http"

const servidor = http.createServer()

const PORT = 5000

servidor.on("request", (req, res) => {
    console.log("solicitud recibida")
    res.end("Hola, este es mi primer servidor con Node.js")
})

    servidor.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})



