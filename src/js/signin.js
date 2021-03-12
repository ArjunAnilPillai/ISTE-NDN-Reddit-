var face = new Face({host: "localhost"});

             


            function onTimeout(self,interest){
                console.log("NDN-JS: TIMEOUT for " + interest.getName());
            }

            function onRegisterData(self,interest,data){
                var res = data.getContent().toString();
                console.log(res);
                if(res === "Registered Successfully"){
                    console.log("Register Success");
                    document.getElementById('success').innerHTML = "Successfully Registered<br/>";
                }else{
                    document.getElementById('error').innerHTML = res + "<br/>";
                }
            }

            function register(){
                var emailVal = document.getElementById('email').value;
                var passwordVal = document.getElementById('password').value;
                var usernameVal = document.getElementById('user').value;
                var password2Val = document.getElementById('repeat_password').value;
                let errors=[];
                if (!emailVal || !usernameVal || !passwordVal || !password2Val) {
                    errors.push({msg:'Please fill all required fields'});
                }

                if (passwordVal !== password2Val) {
                    errors.push({msg:'Passwords do not match'});
                }

                if (passwordVal.length <6) {
                    errors.push({ msg: 'Password should be atleast 6 characters in length' });
                }
                console.log(errors);
                if(errors.length>0){
                  for(let i=0;i<errors.length;i++){
                    document.getElementById('error').innerHTML=`${errors[i].msg}<br/>`;
                  }
                }
                else{
                  document.getElementById('error').innerHTML="";
                  var user = {email:emailVal,username:usernameVal,password:passwordVal};
                  interest = new Interest(new Name("/reddit/register").append(user.username));
                  interest.setMustBeFresh(true);
                  interest.setParameters(new Blob(JSON.stringify(user)));
                  face.expressInterest(interest,function(interest,data){
                      onRegisterData(self,interest,data);
                  },function(interest){
                      onTimeout(self,interest);
                  });
                }
                
            }