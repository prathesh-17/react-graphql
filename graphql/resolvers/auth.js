
const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

module.exports={

    createUser:(args)=>{
        return User.findOne({email:args.userInput.email})
        .then(user=>{
            if(user){
                throw new Error('User already exist')
            }
            return bcrypt.hash(args.userInput.password,12)
        })
        .then(hashedPassword=>{
           return User({email:args.userInput.email,password:hashedPassword}).save()
        })
        .then(res=>{
            return {...res._doc,_id:res.id,password:null}
        })
        .catch(err=>{
            throw err;
        })
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
          throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
          throw new Error('Password is incorrect!');
        }
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          'somesecretkeyy',
          {
            expiresIn: '1h'
          }
        );
        return { userId: user.id, token: token, tokenExpiration: 1 };
    }
}
