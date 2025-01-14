import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema(
   {
     name: {
       type: String,
       required: [true, 'Name is required'],
       trim: true,
       minlength: [3, 'Name must be at least 3 characters'],
     },
     email: {
       type: String,
       required: [true, 'Email is required'],
       unique: true,
       trim: true,
       lowercase: true,
       validate: {
         validator: function (v) {
           return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
         },
         message: props => `${props.value} is not a valid email address!`,
       },
     },
     password: {
       type: String,
       required: [true, 'Password is required'],
       minlength: [6, 'Password must be at least 6 characters'],
     },
     role: {
       type: String,
       enum: ['user', 'admin', 'librarian'],
       default: 'user',
     },
     address: {
        type : String,
        required : true
     },
     phoneNumber: {
       type: String,
       validate: {
         validator: function (v) {
           return /^\+?[1-9]\d{1,14}$/.test(v);
         },
         message: props => `${props.value} is not a valid phone number!`,
       },
     },
     borrowedBooks: [
       {
         bookId: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Book',
         },
         borrowedDate: { type: Date, default: Date.now },
         dueDate: { type: Date, required: true },
         returned: { type: Boolean, default: false },
       },
     ],
   },
   {
     timestamps: true, 
   }
 );

UserSchema.pre('save',async function(next){
     if(!this.isModified(this.password)) return
     this.password = await bcrypt.hash(this.password,10)
     next()
})

UserSchema.methods.comparePassword = async function (password){
   const isPaaswordCorrect = await bcrypt.compare(password , this.password)
   return isPaaswordCorrect
}

UserSchema.methods.generateAccessTolen = function (){
    return jwt.sign(
        {
           _id : this._id,
           name : this.name ,
           email : this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn : process.env.ACCESS_TOKEN_EXPIRY 
        }
    )
}

UserSchema.methods.generateRefreshToken = function () {
   return jwt.sign(
        {
          _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
   )
}


export const User = mongoose.model('User',UserSchema)