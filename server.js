const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

const projectRoutes = require("./routes/projects")
app.use("/api/projects", projectRoutes)

const PORT = 4000
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`)
})

