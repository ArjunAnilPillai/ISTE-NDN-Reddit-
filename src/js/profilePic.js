function viewProfile(){
                setCookie("prof_usr",getCookie("username"));
                window.location.href = "profile.html"
            }
if(getCookie("username") === ""){
                window.location.href = "login.html";
            }
            var face = new Face({host: "localhost"});
            function onTimeout(self,interest){
                console.log("NDN-JS: TIMEOUT for " + interest.getName());
            }
            function onPicUploadData(self,interest,data){
                var res=data.getContent().toString();
                if(res !== 'ACK'){
                    console.log(res);
                    window.location.href = "profile.html"
                }
                
            }


            function uploadPic(){
                var pimageVal = document.getElementById('pimage').files[0];

                
                var reader = new FileReader();
                reader.onloadend = function() {
                    var pic= {img:reader.result,username:getCookie("username")};
                    var content = JSON.stringify(pic);
                    var packets = Math.ceil(content.length/5000);
                    let today = new Date().toISOString().slice(0, 10);
                    var i;
                    for(i = 0; i < packets; i++){
                        interest = new Interest(new Name("/reddit/uploadProfPic").append(getCookie("username")).append(today).append(i.toString()));
                        interest.setMustBeFresh(true);
                        if(i == packets-1){
                            interest.setParameters(new Blob(content.slice(i*5000)));
                        }else{
                            interest.setParameters(new Blob(content.slice(i*5000,((i+1)*5000))));
                        }
                        face.expressInterest(interest,function(interest,data){
                            onPicUploadData(self,interest,data);
                        },function(interest){
                            onTimeout(self,interest);
                        });
                        
                    }

                }
                reader.readAsDataURL(pimageVal);
            }
            window.onload = function(){
                var usr = document.getElementById("usr");
                usr.innerHTML = getCookie("username");
            }
