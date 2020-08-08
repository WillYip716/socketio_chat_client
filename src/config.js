import pkg from '../package.json';

export default{
    development:{
        endpoint: pkg.proxy
    },
    production:{
        endpoint: "http://10.0.2.15:4000/"
    }
}