const { response } = require("express");
const Event = require('../models/Event')

const getEvents = async(req, res = response) =>{

    const events = await Event.find().populate('user', 'name password',)
    
    res.json({
        ok: true,
        msg: 'Get events success',
        events
    })

}

const createEvent = async(req, res = response) =>{

    const event = new Event(req.body)

    try {
        
        event.user = req.uid;

        const eventSaved = await event.save();

        res.json({
            ok: true,
            msg: 'create event success',
            event: eventSaved
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
}

const updateEvent = async (req, res = response) =>{

    try {
        
        const eventId = req.params.id;
        const uid = req.uid;

        const event = await Event.findById(eventId)

        if(!event){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            })
        }

        if(event.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos de editar este evento'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }
        
        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true })
    
        res.json({
            ok: true,
            msg: 'update event success',
            evento: eventUpdated
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const deleteEvent = async(req, res = response) =>{

    try {
        
        const eventId = req.params.id;
        const uid = req.uid;

        const event = await Event.findById(eventId)

        if(!event){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            })
        }

        if(event.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos de eliminar este evento'
            })
        }

        const eventDeleted = await Event.findByIdAndDelete( eventId )


        res.status(500).json({
            ok: true,
            msg: 'Event was deleted success',
            event: eventDeleted
        })


    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}