import { User } from "../models/user.model.js";

export const register = async(req,res)=>{
    try{
        const{fullName,email,phoneNumber,password,role}=req.body;
        if(!fullName || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message:"something is missing",
                success:false

            });
        };
        const User = await User.findOne({email});
        if(User){
            return res.status(400).json({
                message:"User already exist with this email.",
                success: false,

            })
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        });
    
        return res.status(200).json({
            message:"Account created successfully",
            success: true,
        });
        } catch(error) {
            console.log(error);
            return res.status(500).json({
                message: "An error occurred while creating the account",
                success: false,
            });
        }
    };
        export const login = async (req,res)=> {
            try{
                const {email,password,role} = req.body;
                if(!email || !password || !role){
                    return res.status(400).json({
                        message:"something is a missing",
                        success: false,
                    });
                };
                const user= await User.findOne({ email });
                if(!user){
                    return res.status(400).json({
                        message:"Incorrect email or password",
                        success:false,
                    })
                }; 
            const  isPasswordMatch = await bcrypt.compare(password, user.password);
            if(!isPasswordMatch) {
                return res.status(400).json({
                    message:"Incorrect email or Password",
                    success:false,
                })
            };
            if(role !== user.role){
                return res.status(400).json({
                 message : "Account doesnot exist with current role",
                 success: false,


                });
            }
            const tokenData = {
                userId : user_id,
            };
            const token = await jwt.sign(tokenData, process.env.SECRET_KEY,{ expiresIn:'1d',});
            user = {
                _id: user._id,
                fullName : user.fullName,
                email: user.email,
                phoneNumber:user.phoneNumber,
                role:user.role,
                profile:user.profile
            };
            return res
            .status(200).cookie("token", token, {maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly:true,sameSite:'strict',

            }).json({
                message:'Welcome back $(User.fullname)',
                success: true,
            });



        }catch(error){
            console.log(error);
            return res.status(500).json({
                message: "An error occurred during login",
                success: false,
            });
        }
    };
        
    
    export const logout = async (req,res)=> {
        try{
            return res
            .status(200).cookie("token", " ", {maxAge: 0})
            .json({

            
            message:"logged out successfully",
            success:true,
        });
    }catch (error){
        console.log(error);

    }
};
export const updateProfile = async (req, res)=> {
    try{
        const {fullName,email,phoneNumber,bio,skills}=req.body;
        const file = req.file;
        if(!fullName || !email || !phoneNumber || !password || !bio || !skills) {
            return res.status(400).json({
                message:"something is missing",
                success:false,

            });

        };
const skillArray = skills.split(",");
const userId = req.userId;
let user = await User.findById(userId);
if(!user){
    return res.status(400).json({
        message: "user not found",
        success:false,
    });
}
user.fullName= fullName;
user.email=email;
user.phoneNumber = phoneNumber;
user.profile.skills=skillArray;
await user.save();
user ={

    _id: user._id,
                fullName : user.fullName,
                email: user.email,
                phoneNumber:user.phoneNumber,
                role:user.role,
                profile:user.profile
            }
        
        return res.status(200).json({

        
            message: "Profile updated successfully",
            success : true,
        })
    }catch (error){
        console.log(error);
    }
    }
    


    

