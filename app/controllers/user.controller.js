const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto-js');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');


const register = asyncHandler(async(req, res) => {
    const { name, email, password, address, phone } = req.body;
    console.log(req.body);
    if(!(email || name || password || address || phone)){
        return res.status(400).json({
            status: false,
            message: 'Thiếu thông tin'
        });
    }
    const user = await User.findOne({email});
    if(user) {
        return res.status(400).json({
            success: false,
            message: "Email đã đăng ký"
        })
    }else{
        const newUser = await User.create(req.body);
        return res.status(200).json({
            success: true,
            message: newUser ? "Đăng ký tài khoản thành công" : "Đăng ký tài khoản thất bại"
        })
    }

})
const login= asyncHandler(async(req, res) =>{
    const {email, password} = req.body;
    if(!email || !password )
    return res.status(400).json({
        success: false,
        message: 'Missing inputs'
    })
   const response = await User.findOne({email});
   if(response && await response.isCorrectPassword(password)){
    const {password, refreshToken ,...userData}  = response.toObject(); 
    const accessToken = generateAccessToken(response._id);
    const newRefreshToken = generateRefreshToken(response._id);
    await User.findByIdAndUpdate(response._id, { newRefreshToken}, {new: true});
    res.cookie('reFreshToken', newRefreshToken, {httpOnly: true, maxAge: 7*24*60*60*1000});

    return res.status(200).json({
        success: userData ? true : false,
        message: userData ? 'Đăng nhập thành công' : 'Tài khoản hoặc mật khẩu không chính xác',
        accessToken,
        userData
       })
   }else{
      throw new Error('Lỗi!'); 
   }
       
});

const getCurrent= asyncHandler(async(req, res) =>{
    const {_id} = req.user;
    const user = await User.findById(_id)
    return res.status(200).json({
        success: true,
        data: user ? user : 'Người dùng không tồn tại'
    })
       
});
module.exports = {
   register,
   login,
   getCurrent
}  
  