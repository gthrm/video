var video = document.getElementById("vid"),
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    localMediaStream = null,
    onCameraFail = function (e) {
        console.log('Camera did not work.', e); // Исключение на случай, если камера не работает
    };
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia({ video: true }, function (stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
}, onCameraFail);

cameraInterval = setInterval(function(){ snapshot();}, 1);
function snapshot(){
       if(localMediaStream){
              ctx.drawImage(video, 0, 0);
        }
}

var isBroadcasting = false,
	broadcastingTimer;
function sendSnapshot(){
	if(localMediaStream && !isBroadcasting){
		isBroadcasting = true;
                $.post("/",
			{
				p: "new",
				text: ctx.canvas.toDataURL("image/webp", quality) // quality - качество изображения(float)
			},
			function(result){
				console.log(result); // На случай, если что-то пойдёт не так
				isBroadcasting = false;
			}
		);
	}
}

function startBroadcasting(){
	broadcastingTimer = setInterval(sendSnapshot, 1);
}
function stopBroadcasting(){
	clearInterval(broadcastingTimer);
}