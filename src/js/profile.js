            function newProfilePic(){
                window.location.href = "profilePic.html";
            }
            var face = new Face({host: "localhost"});
            if(getCookie("username") === ""){
                window.location.href = "login.html";
            }
            window.addEventListener('load',getProfile());

            function onTimeout(self,interest){
                console.log("NDN-JS: TIMEOUT for " + interest.getName());
            }
            
            function onProfileData(self,interest,data){
                var pkts=  parseInt(data.getContent().toString());
                var i;
                var res = "";
                function onIndividualPacket(self,interest,data){
                    var result = data.getContent().toString();
                    res += result;
                    
                    if(res.charAt(res.length-1) === "}".charAt(0)){
                        res = JSON.parse(res);

                        var container1=document.getElementById("profile");
                        var div=document.createElement("div");
                        div.setAttribute('class','d-flex flex-row card');
                        div.setAttribute('style',"width: 80rem;");
                        var h1 = document.createElement("h1");
                        var button = document.createElement("a");
                        button.textContent = "Change Profile Picture";
                        button.setAttribute('class','active button m-auto');
                        function changePic(){
                            window.location.href = "profilePic.html";
                        }
                        button.onclick = changePic;
                        h1.innerHTML = res.username;
                        //div.appendChild(h2);
                        var img=document.createElement("img");
                        img.setAttribute('src',res.pic);
                        img.setAttribute('class','profile-pic');
                        img.setAttribute('width',200);
                        img.setAttribute('height',200);
                        //div.appendChild(img);
                        var p=document.createElement("p");
                        p.innerHTML=res.email;
                        //div.appendChild(p);
                        var div3 = document.createElement("div");
                        div3.setAttribute('class', 'd-flex flex-column p-2');
                        div3.appendChild(img);
                        if(getCookie("prof_usr") === getCookie("username")){
                            div3.appendChild(button);
                        }
                        
                        var div2 = document.createElement("div");
                        div2.setAttribute('style','margin:20px;');
                        div2.appendChild(h1);
                        div2.appendChild(p);
                        div.appendChild(div3);
                        div.appendChild(div2);
                        container1.appendChild(div);  
                    }
                }
                
                for(i=0;i<pkts;i++){
                    interest = new Interest(new Name("/reddit/getProfilePackets").append(i.toString()));
                    interest.setMustBeFresh(true);
                    face.expressInterest(interest,function(interest,data){
                        onIndividualPacket(self,interest,data);
                    },function(interest){
                        onTimeout(self,interest);
                    });
                }  
            }


            function onUserPostData(self,interest,data){
                console.log(data.getContent().toString());
                if(data.getContent().toString() === "No Posts"){
                    var container=document.getElementById("posts");
                    var div=document.createElement("div");
                    div.setAttribute('class',"card border-dark");
                    div.setAttribute('style',"width: 80rem;");
                    div.innerHTML += "<h3 class='p-2 text-center'>No Posts</h3>";
                    container.appendChild(div);
                    return;
                }
                var pkts=  JSON.parse(data.getContent().toString());
                var i;
                var res = "";
                function onIndividualPacket(self,interest,data){
                    var result = data.getContent().toString();
                    res += result;
                    
                    if(res.charAt(res.length-1) === "]".charAt(0)){
                        res = JSON.parse(res);

                        var container=document.getElementById("posts");
                        console.log(res.length);
                        
                        for (var i = 0; i < res.length; i++) {
                            var current= res[i];
                            var div=document.createElement("div");
                            div.setAttribute('class',"card border-dark");
                            div.setAttribute('style',"width: 80rem;");
                            div.innerHTML += '<h5 class="card-header">Posted by '+ current.username + '</h5>'+
                            '<div class="card-body">'+
                            '<h3 class="card-title">' + current.text + '</h3>'+
                            '</div>'+
                            '<hr style="margin: 0 0 20 0;">'+
                            '<img class="card-img-bottom" height="100%" width="80%" style="padding-left: 10%; padding-right: 10%; padding-bottom" src='+ current.img+' alt="Post Image">';
                    
                            
                            var likeBtn = document.createElement("button");
                            
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
                                h4.style.color = 'blue';
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
                                this.h4.style.color = 'blue';
                                this.likeBtn.disabled = true;
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
                            /*var current= res[i];
                            var div=document.createElement("div");
                            var h2 = document.createElement("h2");

                            h2.innerHTML = res[i].username;
                            div.appendChild(h2);
                            var img=document.createElement("img");
                            img.setAttribute('src',res[i].img);
                            img.setAttribute('width',200);
                            img.setAttribute('height',200);
                            div.appendChild(img);
                            var p=document.createElement("p");
                            p.innerHTML=res[i].text;
                            div.appendChild(p);
                            var likeBtn = document.createElement("button");
                            likeBtn.textContent = res[i].like.length.toString();
                            
                            if(res[i].like.includes(getCookie("username"))){
                                likeBtn.disabled = true;
                                likeBtn.style.color = "blue";
                            }
                            function onLikeResponse(self,interest,data){
                                var result = data.getContent().toString();
                                console.log(result);
                                if( result === "Liked"){
                                    console.log(result);
                                    likeBtn.textContent = (parseInt(likeBtn.textContent.toString(),10)+1).toString();
                                    likeBtn.disabled = true;
                                }
                            }
                            function likeClick() {
                                console.log('here');
                                var likes = parseInt(this.current.like.length.toString(),10);
                                interest = new Interest(new Name("/reddit/like").append(this.current.text).append(getCookie("username")));
                                interest.setMustBeFresh(true);
                                console.log(likes);
                                face.expressInterest(interest,function(interest,data){
                                    onLikeResponse(self,interest,data);
                                },function(interest){
                                    onTimeout(self,interest);
                                });
                            }
                            likeBtn.onclick = likeClick.bind({current:res[i]});
                            
                            //
                            div.appendChild(likeBtn);
                            container.appendChild(div);*/

                        }
                    }
                }
                for(i=0;i<pkts;i++){
                    interest = new Interest(new Name("/reddit/getUserPostsPackets").append(i.toString()));
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
            }


            function getProfile(){
                interest = new Interest(new Name("/reddit/getProfile").append(getCookie("prof_usr")));
                interest.setMustBeFresh(true);
                face.expressInterest(interest,function(interest,data){
                    onProfileData(self,interest,data);
                },function(interest){
                    onTimeout(self,interest);
                });



                interest = new Interest(new Name("/reddit/getUserPosts").append(getCookie("prof_usr")));
                interest.setMustBeFresh(true);
                face.expressInterest(interest,function(interest,data){
                    onUserPostData(self,interest,data);
                },function(interest){
                    onTimeout(self,interest);
                });
            }