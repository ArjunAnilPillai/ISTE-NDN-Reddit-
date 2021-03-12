var face = new Face({host: "localhost"});

            function onTimeout(self,interest){
                console.log("NDN-JS: TIMEOUT for " + interest.getName());
            }
             
            function onLoginData(self,interest,data){
                var res = data.getContent().toString();
                console.log(res);
                if(res === "Authenticated"){
                    console.log("Login Success");
                    console.log(document.getElementById('user').value);
                    setCookie("username",document.getElementById('user').value.toString(),1);
                    console.log(getCookie("username"));
                    window.location.href = "home.html"
                }else{
                    console.log("Login Failed");
                    document.getElementById('error').innerHTML = res + "<br/>"
                }   
            }

            function login(){
                var userVal = document.getElementById('user').value;
                var passwordVal = document.getElementById('password').value;
                var user = {username:userVal,password:passwordVal};
                interest = new Interest(new Name("/reddit/login").append(user.username));
                interest.setMustBeFresh(true);
                interest.setParameters(new Blob(JSON.stringify(user)));
                face.expressInterest(interest,function(interest,data){
                    onLoginData(self,interest,data);
                },function(interest){
                    onTimeout(self,interest);
                });
            }