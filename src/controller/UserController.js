const {User} = require("../models/User");
const {registerValidation, loginValidation} = require("../auth/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createNewUser = async (req, res) => {
    // Validate user
    const{ error } = registerValidation(req.body);
     if(error) return res.status(400).send(error.details[0].message)

    // Kiểm tra email có tồn tại hay không
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send("Email đã tồn tại")

    // Mã hóa password
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt)

    const newCustomer = new User();
    newCustomer.name = req.body.name
    newCustomer.email = req.body.email
    newCustomer.password = hashPass
    try{
        const User = await newCustomer.save()
        res.send(User);
    }catch(err){
        res.status(400).send(err);
    }
}

const login = async (req, res) => {
    
    // Validate user
    const{ error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    
    // Kiểm tra email
    const userLogin = await User.findOne({email: req.body.email});
    if(!userLogin) return res.status(400).send("Không tìm thấy email")
    
    // Kiểm tra password
    const passLogin = await bcrypt.compare(req.body.password, userLogin.password);
    if(!passLogin) return res.status(400).send("Mật khẩu không hợp lệ")
    
    // Ký và tạo token
    const token = jwt.sign({_id: userLogin._id}, process.env.SECRET_TOKEN)
    res.header("auth-token", token).send(token);
}

module.exports = {
    createNewUser,
    login
  };