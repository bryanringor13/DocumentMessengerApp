/* eslint-disable no-undef */
// Development API config
// let serverIp = 'http://api-ddstr.veridata-dev.com'
// let serverIp = "https://reqres.in/api"

// Select API ENV. from .env file

let apiHost = process.env.DEV_HOST  // host url value from .env file

let serverIp = `${apiHost}/dds`

export const socketIOVNI = apiHost

export const uriImage = apiHost

//* For VNI DEV and INT Uat *//

// let serverIp = `${apiHost}/api/dds`

// export const socketIOVNI = apiHost

// export const uriImage = serverIp 

// let port = '3000'

let path = ''
// export const version = '1.2.1'      //Int Uat
export const version = '1.4.1'

// Production API config
// if (process.env.NODE_ENV === 'production') {
//     // port = '80';
//     serverIp = 'http://api-ddstr.veridata-dev.com'
//     path = ''
// } else if (process.env.NODE_ENV === 'development') {
//     // port = '80';
//     serverIp = 'http://api-ddstr.veridata-dev.com'
//     path = ''
// }

// export const apiBaseURL = `${serverIp}:${port + path}`;

export const apiBaseURL = `${serverIp}${path}`

export const IDLE_TIMER_MINS = 30