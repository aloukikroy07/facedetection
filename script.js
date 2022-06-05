const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(GetBrightness)

// function startVideo() {
//   // navigator.getUserMedia(
//   //   { video: {} },
//   //   stream => video.srcObject = stream,
//   //   err => console.error(err)
//   // )

//   navigator.getUserMedia = navigator.getUserMedia ||
//                          navigator.webkitGetUserMedia ||
//                          navigator.mozGetUserMedia;

//   if (navigator.getUserMedia) {
//     navigator.getUserMedia({ audio: false, video: {} },
//         function(stream) {
//           var video = document.querySelector('video');
//           video.srcObject = stream;
//           video.onloadedmetadata = function(e) {
//             video.play();
//           };
//         },
//         function(err) {
//           console.log("The following error occurred: " + err.name);
//         }
//     );
//   } else {
//     console.log("getUserMedia not supported");
//   }
// }

video.addEventListener('play', () => {
  
  const canvas = faceapi.createCanvasFromMedia(video)
  var canvasctx = canvas.getContext('2d')
  const area = document.getElementById('container')
  area.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()   
    const count = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
    if(count.length>1){
      alert("There are multiple faces in the frame. Please keep only one face.");
    }  
    else{
        if(document.getElementById('avg-brightness').textContent<60){
          button.disabled = true
          document.getElementById('label').value="Low light"
          document.getElementById('label').style.color='red'
          document.getElementById('label').style.fontWeight='bold'
        }

        else{
          document.getElementById('label').value="Light is ok"
          document.getElementById('label').style.color='green'
          document.getElementById('label').style.fontWeight='bold'
          const resizedDetections = faceapi.resizeResults(detections, displaySize)
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
          //faceapi.draw.drawDetections(canvas, resizedDetections)
          //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
          //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

          // console.log(resizedDetections[0].detection._box._height)
          // console.log(resizedDetections[0].detection._box._width)
          // console.log(resizedDetections[0].detection._box._x)
          // console.log(resizedDetections[0].detection._box._y) 

          const frame_height = resizedDetections[0].detection._box._height
          const frame_width = resizedDetections[0].detection._box._width
          const frame_x = resizedDetections[0].detection._box._x
          const frame_y = resizedDetections[0].detection._box._y

          const button = document.getElementById('button')

          if (((frame_height>=160 && frame_height<=270) && (frame_width>=180 && frame_width<=270)) &&
          ((frame_x>=100 && frame_x<=195) && (frame_y>=80 && frame_y<=190)))
          {
            //alert("Perfect")
            button.disabled = false
            button.onclick = function(){
              CaptureImage();
            };
          }

          else{
            button.disabled = true
          }
      }
      
      
      // const landmarks = await faceapi.detectFaceLandmarks(video)
      // const mouth = landmarks.getMouth()
      // const nose = landmarks.getNose()
      // const leftEye = landmarks.getLeftEye()
      // console.log(mouth[0]._x, mouth[0]._y)
      // console.log(nose[0]._x, nose[0]._y)    
      // console.log(leftEye[0]._x, leftEye[0]._y)
      // if((((mouth[0]._x<=330) && (mouth[0]._x>=280)) && ((mouth[0]._y<=310) && (mouth[0]._y>=260))) &&
      // (((nose[0]._x<=320) && (nose[0]._x>=270)) && ((nose[0]._y<=220) && (nose[0]._y>=160))) &&
      // (((leftEye[0]._x<=270) && (leftEye[0]._x>=210)) && ((leftEye[0]._y<=240) && (leftEye[0]._y>=180))))
      
      // (((mouth[1]._x<=400) && (mouth[1]._x>=300)) && ((mouth[1]._y<=300) && (mouth[1]._y>=200))) &&
      // (((mouth[2]._x<=400) && (mouth[2]._x>=300)) && ((mouth[2]._y<=300) && (mouth[2]._y>=200))) &&
      // (((mouth[3]._x<=400) && (mouth[3]._x>=300)) && ((mouth[3]._y<=300) && (mouth[3]._y>=200))) &&
      // (((mouth[4]._x<=400) && (mouth[4]._x>=300)) && ((mouth[4]._y<=300) && (mouth[4]._y>=200))) &&
      // (((mouth[5]._x<=400) && (mouth[5]._x>=300)) && ((mouth[5]._y<=300) && (mouth[5]._y>=200))))
      // {
      //     alert("Click for perfect photo");        
      // }
      // else{
      //     alert("Image not ready");
      // }
      
    }    
  }, 100)
})

function CaptureImage(){
  document.querySelectorAll("#screenshot img")
  .forEach(img => img.remove());

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')
  
  canvas.width = 306;
  canvas.height = 392;

  ctx.drawImage(video, 169, 47, 306, 392, 0, 0, 306, 392);

  // const img = document.createElement("img");
  // img.src = canvas.toDataURL('image/png');

  // document.getElementById('screenshot').appendChild(img)

  removebackground(canvas, ctx)
}

function GetBrightness(){
  var w=500;
  var h=375;
  var imageCanvas = document.createElement( 'canvas' );
  var imagectx = imageCanvas.getContext('2d');
  var thresholdCanvas = document.getElementById( 'threshold-canvas' );
  var thresholdctx = thresholdCanvas.getContext('2d');
  var t3Canvas = document.getElementById( 't3-canvas' );
  var t3ctx = t3Canvas.getContext('2d');
  var brightnessCanvas = document.getElementById( 'brightness-canvas' );
  var brightnessctx = brightnessCanvas.getContext('2d');
  var rangeBrightness = document.getElementById( 'range-brightness' );
  var rangeThreshold = document.getElementById( 'range-threshold' );
  var thPercent = 0;
  var overPercent = 0;
  var underPercent = 0;
  // var video = document.createElement('video');
  // video.autoplay='autoplay';
  // video.width=w;
  // video.height=h;
  // var constraints =  {'video':true};
  // if(navigator.webkitGetUserMedia){
  // constraints =  {
  //       video: {
  //         mandatory: {
  //           maxWidth: w,
  //           maxHeight: h
  //         }
  //       }
  //     };
  // }
  // navigator.getUserMedia  = navigator.getUserMedia ||
  //   navigator.webkitGetUserMedia ||
  //   navigator.mozGetUserMedia ||
  //   navigator.msGetUserMedia;

  navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

  window.requestAnimFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame;

  init = function(){
    imageCanvas.height = video.videoHeight;
    imageCanvas.width = video.videoWidth;
    thresholdCanvas.height = imageCanvas.height/2;
    thresholdCanvas.width = imageCanvas.width/2;
    brightnessCanvas.height = imageCanvas.height/3;
    brightnessCanvas.width = imageCanvas.width/2;
    t3Canvas.height = imageCanvas.height/2;
    t3Canvas.width = imageCanvas.width/2;
    update();
  }
  brightness = function(pixels, adjustment) {
    var d = pixels.data;
    for (var i=0; i<d.length; i+=4) {
      d[i] += adjustment;
      d[i+1] += adjustment;
      d[i+2] += adjustment;
    }
    return pixels;
  };
  threshold = function(imgData, threshold) {
    thPercent=1;
    var d = imgData.data;
    for (var i=0; i<d.length; i+=4) {
      var v = (0.2126*d[i] + 0.7152*d[i+1] + 0.0722*d[i+2] >= threshold) ? 255 : 0;
      d[i] = d[i+1] = d[i+2] = v;
      if(v===255){
        thPercent++;
      }
    }
    thPercent=thPercent/(d.length/4);
    return imgData;
  };

  threshold3 = function(imgData, threshold,floor,ceil) {
    underPercent=1;
    overpercent=1;
    var d = imgData.data, f,b,c,v;
    for (var i=0; i<d.length; i+=4) {
      b = 0.2126*d[i] + 0.7152*d[i+1] + 0.0722*d[i+2];
      if (b >= ceil){
        d[i] = 255;
        d[i+1] = 255;
        d[i+2] = 0;
        overPercent++;
      } else if(b <= floor){
        d[i] = 255;
        d[i+1] = 0;
        d[i+2] = 0;
        underPercent++;
      } else {
        v = (b >= threshold) ? 255 : 0
        d[i] = v;
        d[i+1] = v;
        d[i+2] = v;
      }
    }
    overPercent=overPercent/(d.length/4);
    underPercent=underPercent/(d.length/4);

    return imgData;
  };

  average = function(imgData) {
    var d = imgData.data;
    var rgb ={r:0,g:0,b:0};
    for (var i=0; i<d.length; i+=4) {
      rgb.r += d[i];
      rgb.g += d[i+1];
      rgb.b += d[i+2];
    }

    rgb.r = ~~(rgb.r/(d.length/4));
    rgb.g = ~~(rgb.g/(d.length/4));
    rgb.b = ~~(rgb.b/(d.length/4));

    return rgb;
  };

  update = function(){
    var alpha,data;
    imagectx.drawImage(video, 0, 0,video.videoWidth, video.videoHeight, 0,0,imageCanvas.width,imageCanvas.height);

    if(rangeBrightness.value < 50){
      alpha = 0-((1-(rangeBrightness.value/50))*255);
    } else {
      alpha = ((rangeBrightness.value-50)/50)*255;
    }

    pixThreshold = rangeThreshold.value;

    data = brightness(imagectx.getImageData(0,0,imageCanvas.width,imageCanvas.height), alpha);
    imagectx.putImageData(data,0,0);
    
    
    thresholdctx.drawImage(imageCanvas, 0, 0,imageCanvas.width, imageCanvas.height, 0,0,thresholdCanvas.width,thresholdCanvas.height);
    data = threshold(thresholdctx.getImageData(0,0,thresholdCanvas.width,thresholdCanvas.height),pixThreshold);
    thresholdctx.putImageData(data,0,0);
    document.getElementById( 'samples' ).innerHTML = Math.round(thPercent*100*100)/100+'%';
    
    t3ctx.drawImage(imageCanvas, 0, 0,imageCanvas.width, imageCanvas.height, 0,0,t3Canvas.width,t3Canvas.height);
    data = threshold3(t3ctx.getImageData(0,0,t3Canvas.width,t3Canvas.height),pixThreshold, 55,200);
    t3ctx.putImageData(data,0,0);
    document.getElementById( 'samples-under' ).innerHTML = Math.round(underPercent*100*100)/100+'%';
    document.getElementById( 'samples-over' ).innerHTML = Math.round(overPercent*100*100)/100+'%';

    data = average(imagectx.getImageData(0,0,imageCanvas.width,imageCanvas.height));
    
    document.getElementById( 'avg-brightness' ).innerHTML = Math.round(((0.2126*data.r + 0.7152*data.g + 0.0722*data.b)/255)*100*100)/100;
    brightnessctx.fillStyle = 'rgb('+data.r+','+data.g+','+data.b+')';
    brightnessctx.fillRect(0,0,brightnessCanvas.width,brightnessCanvas.height);
    window.requestAnimationFrame(update);
  }

  error = function(e){
    console.log('Snap!', e);
    alert('No camera or getUserMedia() not available')
  }
  
  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      //constraints,
      { audio: false, video: {} },
      function(stream) {
      var video = document.querySelector('video');
      video.srcObject=stream;      
      // onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
      vidReady = setInterval(function(){
        if(video.videoHeight !== 0){
          clearInterval(vidReady);
          init();
        }
      },100)
    }, error);
  } else {
    error('No getUserMedia')
  }

  // if (navigator.getUserMedia) {
  //   navigator.getUserMedia({ audio: false, video: {} },
  //       function(stream) {
  //         var video = document.querySelector('video');
  //         video.srcObject = stream;
  //         video.onloadedmetadata = function(e) {
  //           video.play();
  //         };
  //       },
  //       function(err) {
  //         console.log("The following error occurred: " + err.name);
  //       }
  //   );
  // } else {
  //   console.log("getUserMedia not supported");
  // }
}

/**
 * Remove background an image
 */
async function removebackground(canvas, ctx) {
  const net = await bodyPix.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 2
  });
  
  // Segmentation
  const { data:map } = await net.segmentPerson(canvas, {
    internalResolution: 'high',
  });
  
  
   // Extracting image data
  const { data:imgData } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Creating new image data
  const newImg = ctx.createImageData(canvas.width, canvas.height);
  const newImgData = newImg.data;
  
  for(let i=0; i<map.length; i++) {
    //The data array stores four values for each pixel
    const [r, g, b, a] = [imgData[i*4], imgData[i*4+1], imgData[i*4+2], imgData[i*4+3]];
    [
      newImgData[i*4],
      newImgData[i*4+1],
      newImgData[i*4+2],
      newImgData[i*4+3]
    ] = !map[i] ? [255, 255, 255, 0] : [r, g, b, a];
  }
  
  
  // Draw the new image back to canvas
  ctx.putImageData(newImg, 0, 0);

  const img = document.createElement("img");
  img.src = canvas.toDataURL('image/png');

  document.getElementById('screenshot').appendChild(img)
}