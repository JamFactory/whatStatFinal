var crypto=require('crypto');
module.exports={
  server :{
      port:3001
  },
  session:{
      secret:crypto.randomBytes(20).toString('hex')
  }
};
