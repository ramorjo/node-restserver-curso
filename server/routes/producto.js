const express = require('express');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Producto = require('../models/producto');

// ==============================================
// Obtener los productos
//===============================================
app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });


        })

});

// ==============================================
// Obtener un productos por ID
//===============================================
app.get('/productos/:id', (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El iD no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });


        });

});


// ==============================================
// Buscar productos por medio de expresión regular
//===============================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('catregoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos

            });


        })


});


// ==============================================
// Crear un nuevo productos
//===============================================
app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria

    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

// ==============================================
// Actualizar un productos
//===============================================
app.put('/productos/:id', (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });


});

// ==============================================
// Borrar un productos
//===============================================
app.delete('/productos/:id', (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let id = req.params.id;

    Producto.findByIdAndRemove(id, (err, productoBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBorrada) {
            res.json({
                ok: true,
                err: {
                    message: 'producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrada
        });

    });

});

module.exports = app;