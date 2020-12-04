var jwt = require('jsonwebtoken')
var Users = require("../modules/users")
 function ipVertify(req){
     return new Promise((resolve,reject)=>{
        try {
            token = jwt.decode(req)
           Users.findOne({where:{email:token.user.email}}).then(result=>{
            if(result&&result.dataValues.last_ip===token.user.last_ip)
                resolve(true)
            else 
                resolve(false)
           })
            
         } catch (error) {
            resolve(false)
         }
     })
     
        
    
}

module.exports = ipVertify