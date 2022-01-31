module.exports  = {
    signOptions: {
        issuer:  "Quant",
        expiresIn:  "24h",
        algorithm:  "RS512"
    },
    verifyOptions: {
        issuer:  "Quant",
        expiresIn:  "24h",
        algorithm:  ["RS512"],
       }
}
