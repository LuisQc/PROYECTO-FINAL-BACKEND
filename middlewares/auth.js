// Admin boolean
let admin = true

// Check if user is admin
const isAuthenticated = (req, res, next) => {
    if (admin) {
        return next();
    } else {
        const response = {
            error: -1,
            descripcion: `${req.path} ${req.method} no está autorizado`
        }
        res.status(401).json(response)
    }
}

// Export auth
module.exports = {
    isAuthenticated: isAuthenticated
}