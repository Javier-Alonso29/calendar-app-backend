const { response } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { generateJWT } = require('../helpers/jwt')

const createUser = async(req, res = response) => {

    const {email, password} = req.body

    try {

        let usuario = await User.findOne({ email })

        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            })
        }

        usuario = new User(req.body);

        //* encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //* Generate JWT
        const token = await generateJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            msg: 'El usuario se registro exitosamente',
            uid: usuario._id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Datos invalidos'
        })
    }

}

const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body

    try {
        const usuario = await User.findOne({ email })

        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Email incorrecto'
            })
        }

        //* Confirmar contraseñas
        const validPassword = bcrypt.compareSync(password, usuario.password)

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto',
            })
        }

        //* Gernar el JWT
        const token = await generateJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            msg: 'Login',
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Datos invalidos'
        })
    }
}

const revalidarTocket = async(req, res = response) => {

    const {uid, name} = req

    //* Generate un nuevo tocket y retornarlo en la peticion
    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    loginUsuario,
    revalidarTocket
}