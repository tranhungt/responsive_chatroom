function ChatClient(){
    if (window.WebSocket){
        transport = ChatClient.WebSocket

    } else {
        var transport = ChatClient.LongPoll
    }

    transport.setup.call(this)
    this.subscribe = transport.subscribe
    this.publish = transport.publish

}

ChatClient.LongPoll = {
    subscribe: function(callback) {
        var longPoll = function(){
            $.ajax({
                method: 'GET',
                url: '/messages', 
                success: function(data){
                    callback(data)
                },
                complete: function(){
                    longPoll()
                },
                timeout: 30000
            })
        }
        longPoll()
    },
    publish: function(data) {
        $.post('/messages', data)
    }
}

ChatClient.WebSocket = {
    setup: function(){
        this.socket = new WebSocket('ws://localhost:3000')
    },
    subscribe: function(callback){
        this.socket.onmessage = function(event){
            callback(JSON.parse(event.data))
        }
    },
    publish: function(data){
        this.socket.send(JSON.stringify(data))
    }
}