//* RUTAS DE USUARIO / AUTH
//* HOST + /api/auth

const {Router} = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { createUser, loginUsuario, revalidarTocket } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();


router.post('/login', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({min: 6}) ,
        validarCampos
    ],
    loginUsuario
)

router.post(
    '/new', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({min: 6}),
        validarCampos
    ] ,
    createUser
)

router.get('/renew', 
    [validarJWT],
    revalidarTocket
)

module.exports = router