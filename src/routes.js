import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { RoutePath } from './utils/regex.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: RoutePath('/tasks'),
        handler: (req, res) => {
            const tasks = database.select('tasks')
            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: RoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            const newTask = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                update_at: new Date(),
            }
            
            database.insert('tasks', newTask)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'DELETE',
        path: RoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const task = database.select('tasks').find(task => task.id === id)

            if(task) {
                database.delete('tasks', id)
                return res.writeHead(204).end()
            }

            return res.writeHead(404).end()
        }
    },
    {
        method: 'PUT',
        path: RoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            database.update('tasks', id, {
                ...(title && { title }),
                ...(description && { description }),
                update_at: new Date()
            }) 

            return res.writeHead(200).end()
        }
    },
    {
        method: 'PATCH',
        path: RoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const task = database.select('tasks').find(task => task.id === id)

            const isCompleted = !task.completed_at;
            const updateAt = new Date()

            database.patch('tasks', id, isCompleted, updateAt);

            return res.writeHead(200).end()
        }
    }
]