            function viewProfile(){
                setCookie("prof_usr",getCookie("username"));
                window.location.href = "profile.html"
            }
            function logout(){
                setCookie("username","");
                console.log(getCookie("username"));
                window.location.href = "login.html"
            }
            function viewUserProfile(username){
                setCookie("prof_usr",username);
                window.location.href = "profile.html"
            }
            
            var face = new Face({host: "localhost"});

            //console.log(getCookie("username"));
            if(getCookie("username") === ""){
                window.location.href = "login.html";
            }
            window.addEventListener('load',getPost());

            function onTimeout(self,interest){
                console.log("NDN-JS: TIMEOUT for " + interest.getName());
            }
            
            function onPostData(self,interest,data){
                if(data.getContent().toString() === "No Posts"){
                    var container=document.getElementById("display");
                    var div=document.createElement("div");
                    div.setAttribute('class',"card border-dark");
                    div.setAttribute('style',"width: 80rem;");
                    div.innerHTML += "<h3 class='p-2 text-center'>No Posts</h3>";
                    container.appendChild(div);
                    return;
                }
                var pkts=  JSON.parse(data.getContent().toString());
                console.log("In onPostData");
                var i;
                var res = "";
                function onIndividualPacket(self,interest,data){
                    var result = data.getContent().toString();
                    res += result;
                    
                    if(res.charAt(res.length-1) === "]".charAt(0)){
                        res = JSON.parse(res);

                        var container=document.getElementById("display");
                        if(res.length === 0){
                            var div=document.createElement("div");
                            div.setAttribute('class',"card border-dark");
                            div.setAttribute('style',"width: 80rem;");
                            div.innerHTML += "<h3> No Posts to Show</h3>";
                            container.appendChild(div);
                        }
                
                        for (var i = 0; i < res.length; i++) {
                            var current= res[i];
                            var div=document.createElement("div");
                            div.setAttribute('class',"card border-dark");
                            div.setAttribute('style',"width: 80rem;");
                            div.innerHTML += '<h5 class="card-header">Posted by <a onclick=viewUserProfile("'+ current.username + '")>'+current.username+'</a></h5>'+
                            '<div class="card-body">'+
                            '<h3 class="card-title">' + current.text + '</h3>'+
                            '</div>'+
                            '<hr style="margin: 0 0 20 0;">'+
                            '<img class="card-img-bottom" height="100%" width="80%" style="padding-left: 10%; padding-right: 10%; padding-bottom" src='+ current.img+' alt="Post Image">';
                    
                            
                            var likeBtn = document.createElement("button");
                            likeBtn.setAttribute('style', "color:black; border: none; background-color: transparent;");
                            likeBtn.innerHTML += '<i class="fa fa-arrow-up" aria-hidden="true"></i>';
                            
                            var div1 = document.createElement("div");
                            div1.setAttribute('class','card-footer d-flex flex-row');
                            var h4 = document.createElement("h4");
                            h4.setAttribute('class','p-2');
                            h4.setAttribute('id','likecount'+i.toString());
                            h4.textContent = current.like.length.toString();
                            likeBtn.textContent = 'Like';
                            console.log(likeBtn);
                            if(res[i].like.includes(getCookie("username"))){
                                likeBtn.disabled = true;
                                h4.style.color = 'green';
                                likeBtn.style.color = 'green';
                            }
                            
                            function onLikeResponse(self,interest,data){
                                console.log('here');
                                var result = data.getContent().toString();
                                console.log(result);
                                if( result === "Liked"){
                                    console.log(result);
                                    
                                }
                            }
                            function likeClick() {
                                console.log('here');
                                var likes = parseInt(this.current.like.length.toString,10);
                                interest = new Interest(new Name("/reddit/like").append(this.current.text).append(getCookie("username")));
                                interest.setMustBeFresh(true);
                                console.log(likes);
                                this.h4.textContent = (parseInt(this.h4.innerHTML.toString(),10)+1).toString();
                                this.likeBtn.disabled = true;
                                this.h4.style.color = 'blue';
                                this.likeBtn.style.color = 'green';
                                face.expressInterest(interest,function(interest,data){
                                    onLikeResponse(self,interest,data);
                                },function(interest){
                                    onTimeout(self,interest);
                                });
                            }
                        
                            likeBtn.onclick = likeClick.bind({current:res[i],likeBtn:likeBtn,h4:h4});
                            
                            div1.appendChild(likeBtn);
                            div1.appendChild(h4);
                            div.appendChild(div1);
                            container.appendChild(div);

                        }
                    }
                }
                for(i=0;i<pkts;i++){
                    interest = new Interest(new Name("/reddit/getPosts").append(i.toString()));
                    interest.setMustBeFresh(true);
                    face.expressInterest(interest,function(interest,data){
                        onIndividualPacket(self,interest,data);
                    },function(interest){
                        onTimeout(self,interest);
                    });
                }   
            }
            window.onload = function(){
                var usr = document.getElementById("usr");
                usr.innerHTML = getCookie("username");
                function onUserList(self,interest,data){

                    var res = JSON.parse(data.getContent().toString());
                    autocomplete(document.getElementById("txt-search"),res["users"]);
                }
                interest = new Interest(new Name("/reddit/getUserList"));
                interest.setMustBeFresh(true);
                face.expressInterest(interest,function(interest,data){
                    onUserList(self,interest,data);
                },function(interest){
                    onTimeout(self,interest);
                });
                //autocomplete(document.getElementById("txt-search"),["aniruddh","meghna","mansi"]);
            }

            function getPost(){
                
                interest = new Interest(new Name("/reddit/post"));
                interest.setMustBeFresh(true);
                face.expressInterest(interest,function(interest,data){
                    onPostData(self,interest,data);
                },function(interest){
                    onTimeout(self,interest);
                });
            }
             
