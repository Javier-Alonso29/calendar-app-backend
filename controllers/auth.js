const { response } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { generateJWT } = require('../helpers/jwt')

const createUser = async(req, res = response) => {

    const {email, password} = req.body

    try {

        let user = await User.findOne({ email })

        if(user){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            })
        }

        user = new User(req.body);

        //* encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //* Generate JWT
        const token = await generateJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            msg: 'El usuario se registro exitosamente',
            uid: user._id,
            name: user.name,
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
        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({
                ok: false,
                msg: 'Email incorrecto'
            })
        }

        //* Confirmar contraseñas
        const validPassword = bcrypt.compareSync(password, user.password)

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto',
            })
        }

        //* Gernar el JWT
        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            msg: 'Login',
            uid: user.id,
            name: user.name,
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