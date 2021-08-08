import axios from 'axios'

// const apiClient = axios.create({
//     baseURL: 'https://my-json-server.typicode.com/arthur-see/Hidronutridor',
//     withCredentials: false,
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json'
//     }
//   })

const apiClient = axios.create({
    baseURL: 'http://localhost:3333',
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // Authorization:
      // 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjcyNjY5MDEsImV4cCI6MTYyNzM1MzMwMSwic3ViIjoiMDQ3NTNjZjEtMGQzOC00ODViLWE4ZTItMDkxNTllNGNkOGFiIn0.P5qF-cZA_FnPXdOHIjuAr2N3yZEiuj4Zfw1q9fep-l8'
    }
  })
  
  export default {
    deleteGreenhouse(greenHouseId, token) {
      return apiClient.delete(`/greenhouse?estufa_id=${greenHouseId}`, {headers: {'Authorization':`Bearer ${token}`}})
    },
    deleteActivationTime(activationTimeId, token) {
      return apiClient.delete(`/activation_time?id=${activationTimeId}`, {headers: {'Authorization':`Bearer ${token}`}})
    },
    getReadings() {
        return apiClient.get('/readings')
    },
    getSensorData(greenHouseId, numberOfReadings, token) {
      if(!numberOfReadings){
        return apiClient.get(`/sensor_data?estufa_id=${greenHouseId}`, {headers: {'Authorization':`Bearer ${token}`}})
      }
      return apiClient.get(`/sensor_data?estufa_id=${greenHouseId}&number_of_readings=${numberOfReadings}`, {headers: {'Authorization':`Bearer ${token}`}})
    },
    getActivationTimes(greenHouseId, token) {
      return apiClient.get(`/activation_time?estufa_id=${greenHouseId}`, {headers: {'Authorization':`Bearer ${token}`}})
    },
    getGreenHouse(token) {
      return apiClient.get('/greenhouse', {headers: {'Authorization':`Bearer ${token}`}})
    },
    setUserData(credentials) {
      return apiClient.post('/users', credentials)
    },
    setGreenHouse(name, token) {
      return apiClient.post('/greenhouse', name, {headers: {'Authorization':`Bearer ${token}`}})
    },
    setHighPHCalibration(greenHouseId, value, token) {
      const json = JSON.stringify({estufa_id:greenHouseId,
                                   ph:value})
      return apiClient.post('/ph_calibration_high', json, {headers: {'Authorization':`Bearer ${token}`}})
    },
    setLowPHCalibration(greenHouseId, value, token) {
      const json = JSON.stringify({estufa_id:greenHouseId,
                                   ph:value})
      return apiClient.post('/ph_calibration_low', json, {headers: {'Authorization':`Bearer ${token}`}})
    },
    setConductivityCalibration(greenHouseId, value, token) {
      const json = JSON.stringify({estufa_id:greenHouseId,
                                   conductivity:value})
      return apiClient.post('/conductivity_calibration', json, {headers: {'Authorization':`Bearer ${token}`}})
    },
    setActivationTime(greenHouseId, hourTimeOn, minuteTimeOn, hourTimeOff, minuteTimeOff, token) {
      const json = JSON.stringify({estufa_id:greenHouseId,
                                   hour_time_on:hourTimeOn,
                                   minute_time_on:minuteTimeOn,
                                   hour_time_off:hourTimeOff,
                                   minute_time_off:minuteTimeOff})
      // return apiClient.post(`/activation_time?estufa_id=${greenHouseId}&hour_time_on=${hourTimeOn}&minute_time_on=${minuteTimeOn}&hour_time_off=${hourTimeOff}&minute_time_off=${minuteTimeOff}`, {headers: {'Authorization':`Bearer ${token}`}})
      return apiClient.post('/activation_time', json, {headers: {'Authorization':`Bearer ${token}`}})
    },
    login(credentials) {
      return apiClient.post('/session', credentials)
    }
  }