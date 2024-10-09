import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #tasks = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
        .then((data) => {
            this.#tasks = JSON.parse(data);
        }).catch(() => {
            this.#persist()
        }) 
    }

    async #persist() {
        console.log('Data being persisted:', this.#tasks);
        await fs.writeFile(databasePath, JSON.stringify(this.#tasks))
    }

    select(table) {
        const data =  this.#tasks[table] ?? []

        return data
    }

    insert (table, data) {
        if (Array.isArray(this.#tasks[table])) {
            this.#tasks[table].push(data)
        } else {
            this.#tasks[table] = [data]
        }

        this.#persist()

        return data
    }

    delete(table, id) {
        const index = this.#tasks[table].findIndex(index => index.id === id)

        if (index !== -1) {
            this.#tasks[table].splice(index, 1)
            this.#persist()
        }
    }

    update(table, id, data) {
        const index = this.#tasks[table].findIndex(index => index.id === id)

        this.#tasks[table][index] = {
            ...this.#tasks[table][index],
            ...data
        }

        this.#persist()
    }

    patch(table, id, isCompleted, update) {
        const index = this.#tasks[table].findIndex(task => task.id === id)

        if (index !== -1) {
            this.#tasks[table][index].completed_at = isCompleted;
            this.#tasks[table][index].update_at = update;
            this.#persist()
        }

        return this.#tasks[table][index]
    }
}