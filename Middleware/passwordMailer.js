const resetPasswordMail=async(name,email,token)=>{
    try{
        const transPorter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            requireTLS:true,
            auth:{
                user:"bivasdas005@gmail.com",
                pass:"gwfniqmpthmrngmh"
            }
        });
  
        const mailOption={
            from:"No-replyBivaddas@gmail.com",
            to:req.body.email,
            subject:"for reset password",
            html:'<p> Hi..'+name+',</p> plz copy the link and <a href="http://localhost:2656/reset-password?token='+token+'">reset your password</a> '
        }
  
        transPorter.sendMail(mailOption,function(err,info){
            if(err){
                console.log(err);
            } else{
                console.log("mail send",info.response);
            }
        })
  
    } catch(error){
        res.status(400).send({success:false,msg:error.message})
    }
  };
  