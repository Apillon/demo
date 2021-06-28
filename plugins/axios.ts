import * as qs from 'qs'

export default function ({ $axios }: any) {
  $axios.onRequest((request: any) => {
    request.paramsSerializer = (params: any) => qs.stringify(params)
    return request
  })

  // $axios.onResponse((_response) => {
  //   // console.log('response from ' + response.request.url);
  // })

  $axios.onError((error: any) => {
    if (error.response) {
      return Promise.reject(error.response)
    }
    return Promise.reject(error)
  })
}
