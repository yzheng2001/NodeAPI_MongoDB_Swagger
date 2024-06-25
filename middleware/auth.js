//const jwtDecode = require('jwt-decode');
//import { jwtDecode } from "jwt-decode";
const { jwtDecode }= require('jwt-decode');
// const AppConstants = require("../Common/AppConstants");
// const CommonUtility = require("../Common/CommonUtility");
// const jwt = require('express-jwt');
// const jwksRsa = require('jwks-rsa');
// const env = process.env["Environment"];
// const axios = require('axios');

const authUserEmail = process.env.Email
console.log(authUserEmail);

const Auth = {
    Auth_User: async (req, res, next) => {
        try {
            token = req.headers.authorization.split(' ')[1];
            let decoded = await jwtDecode(token);
            if (decoded) {
                console.log(decoded);email
                // check wherther use has access to requested demo and data entity
                var email = decoded.mail != null ? decoded.mail : decoded.email;
                
                const authUserEmail = process.env.Email
                console.log(authUserEmail);

                // requestURI = "Users/Get_Accessible_Entities?logged_In_User_Mail_Id=" + email + "&demo_number=" + demo + "&phase=" + Phase + "&dataentity=" + DataEntity + "&httpmethod=" + req.method;
                if (email==authUserEmail){//(await Valid_User(requestURI)) {
                    next();
                } else {
                    res.status(401).send("unauthorized");//res.send(401, await CommonUtility.Construct_Res_Obj(false, "Unauthorized"));
                }
            } else {
                //res.send(401, await CommonUtility.Construct_Res_Obj(false, "Unauthorized"));
                res.status(401).send("unauthorized");
            }
        } catch (err) {
            //CommonUtility.LogTosplunk("error", err, "Auth", "Authorise_User");
            //res.send(401, await CommonUtility.Construct_Res_Obj(false, "Unauthorized"));
            res.status(401).send("unauthorized");
        }
    },
    // Authorise_User: async (Phase, DataEntity, demo, req, res, next) => {
    //     try {
    //         let decoded = await jwtDecode(req.headers.authorization);
    //         if (decoded) {
    //             // check wherther use has access to requested demo and data entity
    //             var email = decoded.mail != null ? decoded.mail : decoded.email;
    //             let requestURI = "Users/Get_Accessible_Entities?logged_In_User_Mail_Id=" + email + "&demo_number=" + demo + "&phase=" + Phase + "&dataentity=" + DataEntity + "&httpmethod=" + req.method;
    //             if (await Valid_User(requestURI)) {
    //                 next();
    //             } else {
    //                 res.send(401, await CommonUtility.Construct_Res_Obj(false, "Unauthorized"));
    //             }
    //         } else {
    //             res.send(401, await CommonUtility.Construct_Res_Obj(false, "Unauthorized"));
    //         }
    //     } catch (err) {
    //         CommonUtility.LogTosplunk("error", err, "Auth", "Authorise_User");
    //         res.send(401, await CommonUtility.Construct_Res_Obj(false, "Unauthorized"));
    //     }
    // },
    // DecodeToken: async (token) => {
    //     return JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
    // },
    // Authenticate_User: async (req, res, next) => {
    //     try {
    //         checkJwt();
    //         let resObj = await PingSSOValidation(req);
    //         if (resObj.status && resObj.status.success && resObj.data.isAuthenticated) {
    //             res.locals.user = resObj.data.employeeID;
    //             next();
    //         } else {
    //             res.send(401,await CommonUtility.Construct_Res_Obj(false, "Unauthorized"));
    //         }
    //     }
    //     catch (err) {
    //         CommonUtility.LogTosplunk("error", err, "Auth", "Authenticate_User");
    //         res.send(401,await CommonUtility.Construct_Res_Obj(false, "Unauthorized"));
    //     }
    // }
}

// const PingSSOValidation = async function (req) {
//     let res = {};
//     try {
//         let config = {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         }
//         await axios.post(AppConstants.API[env].Almanac_Security + "Auth/SSO_User_Details", JSON.stringify(req.headers.authorization), config)
//             .then(response => {
//                 res = response.data
//             })
//             .catch(err => {
//                 throw err;
//             });
//     }
//     catch (err) {
//         throw err;
//     }
//     return res;
// }

// const checkJwt = async function () {
//     jwt({
//         secret: jwksRsa.expressJwtSecret({
//             jwksUri: AppConstants.API[env].JwksUri // JWKS URI Can Be Obtained From Well Known Endpoint
//         }),
//         //issuer: ['http://localhost:8080/auth/realms/SSO'], // Optional - Issuer Of Token. In Case You Want To Verify The Issuer
//         algorithms: ['RS256']
//     });
// };

// const Valid_User = async function (requestURI) {
//     let is_Valid_User = false;
//     try {
//         await axios.get(AppConstants.API[env].Almanac_Security + requestURI)
//             .then(response => {
//                 if (response.data.status.success && response.data.accessible_Entities) {
//                     is_Valid_User = true;
//                 }
//             })
//             .catch(err => {
//                 is_Valid_User = false;
//             });
//     } catch (err) {
//         throw err;
//     }
//     return is_Valid_User;
//}
module.exports = Auth