module.exports  = {
    signOptions: {
        issuer:  "SumukShashidhar",
        expiresIn:  "24h",
        algorithm:  "RS512"
    },
    verifyOptions: {
        issuer:  "SumukShashidhar",
        expiresIn:  "24h",
        algorithm:  ["RS512"],
       }
}