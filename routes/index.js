var express = require('express');
var router = express.Router();

module.exports = function(messageBus){

    setInterval(function(){
        console.log(messageBus.listeners('message').length)
        console.log(messageBus._events)
    }, 1000)

    /* GET home page. */
    router.get('/', function(req, res) {
      res.render('index', { title: 'Awesome Chatroom' });
    });

    router.get('/messages', function(req, res){
        var addMessageListener = function(res){
            messageBus.once('message', function(data){
                res.json(data)
            })
        }
        addMessageListener(res)
    })

    router.post('/messages', function(req, res){
        console.log('body', req.body)
        console.log(messageBus)
        console.log('Emitting Message')
        messageBus.emit('message', req.body)
        console.log(messageBus)
        res.status(200).end()
    })

    return router;
}
