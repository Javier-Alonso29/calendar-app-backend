const { Router } = require("express");
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/events");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require('../middlewares/validar-campos')
const { check } = require('express-validator');
const { isDate } = require("../helpers/isDate");
const router = Router();

const middlewares = [validarJWT, validarCampos]


//* Get events
router.get('/', [...middlewares], getEvents)

//* Create events 
router.post('/', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio debe de ser obligatoria').custom(isDate),
    check('end', 'Fecha finalizacion debe de ser obligatoria').custom(isDate),
    ...middlewares
], createEvent)

//* Update event
router.put('/:id',  [check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio debe de ser obligatoria').custom(isDate),
    check('end', 'Fecha finalizacion debe de ser obligatoria').custom(isDate),
    ...middlewares
], updateEvent)

//* Delete event
router.delete('/:id',  [...middlewares], deleteEvent)


module.exports = router;