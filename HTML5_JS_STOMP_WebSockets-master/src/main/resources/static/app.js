
var app = (function () {
    var canal=null;
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    var stompClient = null;

    var addPointToCanvas = function (point) {
        //console.log(point);      
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };


    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };
    var connectAndSubscribe = function (id) {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);

        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint.'+id, function (eventbody) {
                var npoint = JSON.parse(eventbody.body);
                //var npoint2 = new Point(npoint.data.x,npoint.data.y)
                //console.log(npoint2+"------------------")
                //alert("Si funciono!!");
                addPointToCanvas(npoint);

            });
        });

    };



    return {

        init: function () {
            var can = document.getElementById("canvas");
            //console.log(canal);
            app.disconnect();
            
           /* if(canal!=""){
                app.disconnect();
                canal = id;
                connectAndSubscribe(id);
            }
            else{
                canal=id;
                connectAndSubscribe(id);
            }    */
            id=$('#numero').val();
            connectAndSubscribe(id);
            
            can.addEventListener("click", function (evt) {
                var coord = getMousePosition(evt);
                let px = coord.x;
                let py = coord.y;
                var point = new Point(px, py);
                app.publishPoint(px,py,id);
            })
            //websocket connection
            
        },

        publishPoint: function (px, py,id) {
            var pt = new Point(px, py);
            console.info("publishing point at " + pt);
            //addPointToCanvas(pt);

            //publicar el evento
            stompClient.send("/topic/newpoint."+id, {}, JSON.stringify(pt));

        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            //setConnected(false);
            console.log("Disconnected");
        }
    };

})();