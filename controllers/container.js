const fs = require('fs')

// File persistence export class
module.exports = class Container {
    // Constructor
    constructor (filename) {
        this.filename = '.data/' + filename
    }

    // Save data to file
    async save (data) {
        try {
            let items = await this.getAll()
                .then (objs => { return objs })
                .catch (err => { return err })
            if (items.length > 0) {
                data.id = items.reduce((max, obj) => { return obj.id > max ? obj.id : max }, 0) + 1
            } else {
                data.id = 1
            }
            items.push(data)
            await fs.promises.writeFile(this.filename, JSON.stringify(items))
            return data.id
        } catch (error) {
            console.log(error)
        }
    }

    // Get all data from file, if no data or file return empty array
    async getAll () {
        try {
            const data = await fs.promises.readFile(this.filename, 'utf8')
            if (data) {
                return JSON.parse(data)
            } else {
                return []
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                return []
            } else {
                console.log(error)
            }
        }
    }

    // Get by id
    async getById (id) {
        try {
            const item = await this.getAll()
                .then (data => { return data.filter(obj => obj.id === id) })
            if (item.length > 0) {
                return item[0]
            } else {
                return { error: 'data not found' }
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Update by id
    async updateById (id, item) {
        item.id = id
        try {
            const result = await this.getAll()
                .then (data => { 
                    const idx = data.findIndex(obj => obj.id === item.id)
                    if (idx !== -1) {
                        data[idx] = item
                        fs.promises.writeFile(this.filename, JSON.stringify(data))
                        return { success: 'data updated' }
                    } else {
                        return { error: 'data not found' }
                    }
                })
            return result
        } catch (error) {
            console.log(error)
        }
    }

    // Delete by id
    async deleteById (id) {
        try {
            const result = await this.getAll()
                .then (data => {
                    const len = data.length
                    const flt = data.filter(obj => obj.id !== id)
                    if (len > flt.length) {
                        fs.promises.writeFile(this.filename, JSON.stringify(flt))
                        return { success: 'data deleted' }
                    } else {
                        return { error: 'data not found' }
                    }
                })
            return result
        } catch (error) {
            console.log(error)
        }
    }

    // Erase all data
    async deleteAll () {
        try {
            await fs.promises.writeFile(this.filename, '[]')
        } catch (error) {
            console.log(error)
        }
    }
}