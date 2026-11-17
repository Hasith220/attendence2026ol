/* Rear-camera capture; QR recognition stays on the teacher's device. */
window.AttendanceCamera=class {
 constructor(video,onCode,onStatus){this.video=video;this.onCode=onCode;this.onStatus=onStatus;this.canvas=document.createElement('canvas');this.context=this.canvas.getContext('2d',{willReadFrequently:true});this.generation=0;this.stream=null;this.running=false;this.pending=false;this.lastTick=0;}
 async start(){this.stop();const gen=this.generation;if(typeof jsQR!=='function')throw Error('QR reader did not load. Refresh the direct scanner page.');if(!this.context)throw Error('Camera preview is unavailable. Use Take QR photo or Choose QR image.');if(!navigator.mediaDevices?.getUserMedia)throw Error('Camera access needs HTTPS and a supported browser. Open the direct scanner in Chrome.');let stream;try{stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}}});if(gen!==this.generation){stream.getTracks().forEach(t=>t.stop());return;}this.stream=stream;this.video.srcObject=stream;await this.video.play();if(gen!==this.generation)return;this.running=true;this.onStatus('Camera ready. Hold one student QR card inside the view.');this.frame=requestAnimationFrame(t=>this.tick(t));}catch(e){if(gen===this.generation)this.stop();throw e;}}
 async tick(t){if(!this.running)return;if(!this.pending&&t-this.lastTick>=180&&this.video.readyState>=2){this.lastTick=t;try{const width=Math.min(960,this.video.videoWidth),height=Math.round(this.video.videoHeight*width/this.video.videoWidth);if(width&&height){this.canvas.width=width;this.canvas.height=height;this.context.drawImage(this.video,0,0,width,height);const image=this.context.getImageData(0,0,width,height),code=jsQR(image.data,width,height,{inversionAttempts:'attemptBoth'});if(code?.data){this.pending=true;try{await this.onCode(code.data);}finally{this.pending=false;}}}}catch(e){this.onStatus('Unable to read this frame. Keep the QR steady and well lit.');}}if(this.running)this.frame=requestAnimationFrame(n=>this.tick(n));}
 stop(){this.generation++;this.running=false;if(this.frame)cancelAnimationFrame(this.frame);this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;if(this.video)this.video.srcObject=null;}
};

// File capture works without requesting a live camera stream. Images stay on this device.
window.AttendanceCamera.readPhoto=async function(file){
 if(!file)throw Error('Choose a QR photo first.');if(file.size>20*1024*1024)throw Error('Choose an image smaller than 20 MB.');if(file.type&&!file.type.startsWith('image/'))throw Error('Choose a JPG or PNG QR photo.');
 if(typeof jsQR!=='function')throw Error('QR reader did not load. Refresh this page.');
 let image,url;
 try{if(typeof createImageBitmap==='function'){try{image=await createImageBitmap(file);}catch{}}
  if(!image){url=URL.createObjectURL(file);image=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Unable to open this image. Use a JPG or PNG QR photo.'));img.src=url;});}
  const width=image.width||image.naturalWidth,height=image.height||image.naturalHeight;if(!width||!height)throw Error('This image is empty.');
  const canvas=document.createElement('canvas'),context=canvas.getContext('2d',{willReadFrequently:true});if(!context)throw Error('Unable to read images in this browser. Open the scanner in Chrome.');
  for(const limit of [1600,900]){const scale=Math.min(1,limit/Math.max(width,height));canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));context.drawImage(image,0,0,canvas.width,canvas.height);const pixels=context.getImageData(0,0,canvas.width,canvas.height),qr=jsQR(pixels.data,canvas.width,canvas.height,{inversionAttempts:'attemptBoth'});if(qr?.data)return qr.data;}
  throw Error('No readable QR found. Take a close, clear photo of one QR card with all four corners visible.');
 }finally{image?.close?.();if(url)URL.revokeObjectURL(url);}
};
