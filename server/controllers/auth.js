import User from '../models/user'
import jwt, { JsonWebTokenError } from "jsonwebtoken"

export const register = async (req, res) => {
    //console.log(req.body);
    const {name, email, password} = req.body;
    //validation
    if(!name) return res.status(400).send('Name is required')
    if(!email) return res.status(400).send('Email is required')
    if(!password || password.length < 6)
        return res
            .status(400)
            .send("Password is required and should be min 6 characters long")

    let userExist = await User.findOne({email}).exec()
    if(userExist) return res.status(400).send('Email is already used')
    //register
    const user = new User(req.body)
    try {
        await user.save()
        console.log("USER CREATED", user)
        return res.json( { ok: true } )

    } catch (err) {
        console.log('CREATE USER FAILED', err)
        return res.status(400).send('Error. Try again.' )
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email}).exec();
        if(!user) return res.status(400).send("User not found");

        //compare password
        user.comparePassword(password, (err, match) => {
            console.log("COMPARE PASSWORD IN LOGIN ERR", err)
            if(!match || err) return res.status(400).send("Wrong password");
            //("GENERATE A TOKEN THEN SEND AS RESPONSE TO CLIENT")
            let token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
                expiresIn: '365d'
            })
            res.json({ token, user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updateAt: user.updateAt
            } });
        })
    } catch (err) {
        console.log('LOGIN ERROR', err)
        return res.status(400).send('Signin failed' )
    }
}