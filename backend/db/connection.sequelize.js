
module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "admin",
    DB: "uprecruit",
    dialect: "postgres",
    port: 5432,
    native: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

/*
module.exports = {
    HOST: "ec2-3-223-242-224.compute-1.amazonaws.com",
    USER: "ecfzernjtccmrt",
    PASSWORD: "febcbf3fd7ecfc243445dd035105851049eadd53b0200f6028cbaf3fe7f41f33",
    DB: "d6r969eemq5eh3",
    dialect: "postgres",
    port: 5432,
    native: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};*/