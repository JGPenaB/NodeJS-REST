const express = require('express');
const app = express();

/**
 * Cargando servicios
 */
app.get('/', (req, res) => res.json({content : 'Probando'}))

module.exports = app;