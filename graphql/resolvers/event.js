const Event = require('../../models/event')
const User = require('../../models/user')
const {transformEvent}=require('./merge')

module.exports={
    events:()=>{
        return Event.find()
            .then((events)=>{return events.map(event=>{
                   return transformEvent(event)
                })
            })
            .catch(err=>{console.log(err)})
    },
    createEvent:(args,req)=>{
        if(!req.isAuth){
            throw new Error('You are not Authorized')
        }
        // const event={
        //     _id:Math.random(),
        //     title:args.eventInput.title,
        //     description:args.eventInput.description,
        //     price: +args.eventInput.price,
        //     date:new Date()
        // }
        const event = new Event({
            title:args.eventInput.title,
            description:args.eventInput.description,
            price: +args.eventInput.price,
            date:new Date(),
            creator:'5ef4200429f44b601c7d9ad4'
        })
        let createdEvent;
        return event.save()
            .then(res=>{
                createdEvent=transformEvent(res)
                return User.findById('5ef4200429f44b601c7d9ad4')
            })
            .then(user=>{
                if(!user){
                    throw new Error('No such User')
                }
                user.createdEvents.push(event)
                return user.save()
            })
            .then(res=>{
                return createdEvent
            })
            .catch(err=>{
                console.log(err)
            })

    }
}
