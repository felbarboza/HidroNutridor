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
    getEmployees() {
        return apiClient.get('/employees')
    },
    getReadings() {
        return apiClient.get('/readings')
    },
    getSensorData(greenHouseId, token) {
      return apiClient.get(`/sensor_data?estufa_id=${greenHouseId}`, {headers: {'Authorization':`Bearer ${token}`}})
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
    login(credentials) {
      return apiClient.post('/session', credentials)
    }
  }