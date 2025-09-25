const express = require("express")
const multer = require("multer")
const path = require("path")

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    },
})

const upload = multer({ storage })

let projects = []

router.post("/", upload.single("image"), (req, res) => {
    const { title, description } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : null

    const newProject = {
        id: projects.length + 1,
        title,
        description,
        image,
    }

    projects.push(newProject)
    res.json(newProject)
})

router.get("/", (req, res) => {
    res.json(projects)
})

router.delete("/:id", (req, res) => {
    const { id } = req.params
    const projectIndex = projects.findIndex(p => p.id === parseInt(id))

    if(projectIndex === -1) {
        return res.status(404).json({ error: "Projeto não encontrado." })
    }
    const removedProject = projects.splice(projectIndex, 1)
    res.json({ message: "Projeto removido com sucesso.", removed: removedProject[0] })
})

router.put("/:id", upload.single("image"), (req, res) => {
    const { id } = req.params
    const { title, description } = req.body
    const projectIndex = projects.findIndex(p => p.id === parseInt(id))

    if(projectIndex === -1) {
        return res.status(404).json({ error: "Projeto não encontrado." })
    }

    projects[projectIndex].title = title || projects[projectIndex].title
    projects[projectIndex].description = description || projects[projectIndex].description

    if(req.file) {
        projects[projectIndex].image = `/uploads/${req.file.filename}`
    }

    res.json({ message: "Projeto atualizado com sucesso.", updated: projects[projectIndex] })
})

module.exports = router