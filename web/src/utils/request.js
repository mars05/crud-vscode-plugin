import axios from 'axios'
import { ElMessage } from 'element-plus'

// create an axios instance
const service = axios.create({
  baseURL: 'https://api-gateway.crud-hub.top/', // url = base url + request url
  // baseURL: 'http://localhost:8080/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

service.interceptors.request.use(config => {
  // do something before request is sent
  return config
}, error => {
  // do something with request error
  console.log(error) // for debug
  return Promise.reject(error)
}
)

// response interceptor
service.interceptors.response.use(response => {
  let res = response.data
  const headers = response.headers


  // if the custom code is not 20000, it is judged as an error.
  if (res.code !== '0') {
    ElMessage({
      message: res.message || 'Error',
      type: 'error',
    })
    return Promise.reject(new Error(res.message || 'Error'))
  } else {
    return res
  }
},
  error => {
    console.log('err' + error) // for debug
    ElMessage({
      message: error.message,
      type: 'error',
      // duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
