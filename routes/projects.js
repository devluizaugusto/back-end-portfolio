const express = require("express")
const multer = require("multer")
const path = require("path")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
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

router.post("/", upload.single("image"), async (req, res) => {

    try {
        const { title, description } = req.body
        const image = req.file ? `/uploads/${req.file.filename}` : null

        const newProject = await prisma.portfolio.create({
            data: { title, description, image }
        })

        res.json(newProject)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erro ao criar projeto" })
    }
})

router.get("/", async (req, res) => {
    try {
        const projects = await prisma.portfolio.findMany({
            orderBy: { createdAt: "desc" }
        })
        res.json(projects)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erro ao buscar projetos" })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        await prisma.portfolio.delete({
            where: { id }
        })
        res.json({ message: "Projeto removido com sucesso." })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erro ao remover projeto" })
    }
})

router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params
        const { title, description } = req.body
        const image = req.file ? `/uploads/${req.file.filename}` : undefined

        const updatedProject = await prisma.portfolio.update({
            where: { id },
            data: {
                title,
                description,
                ...(image && { image })
            }
        })
        res.json(updatedProject)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erro ao editar projeto" })
    }
})

module.exports = router