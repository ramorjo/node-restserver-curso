const express = require('express');
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//==============================
// Mostrar todas las categorias
//==============================
app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find()
        .populate('usuario', 'nombre email')
        .sort({ 'descripcion': 1 })
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, conteo) => {

                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });

            });

        })

});

//==============================
// Mostrar una categoria por ID
//==============================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El iD no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });

});

//==============================
// Crear nueva categoria
//==============================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            usuario: categoriaDB
        });

    });


});

//==============================
// Actualizar la descripcion de la categoria
//==============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//==============================
// Eliminar la descripcion de la categoria
//==============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    //solo un admin debe borrar la categoria
    //Categoria.findByIdRemove --> borrar fisicamente
    //colocar los servicios en postMan
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            res.json({
                ok: true,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: categoriaBorrada
        });

    });


});

module.exports = app;