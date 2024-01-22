export interface Symptoms {
  id: string
  user_id_reported: string
  times_in_bathroom: string
  time_with_symptoms: string
  blood_in_feces: boolean
  geolocation: {
    latitude: number
    longitude: number
  }
}
