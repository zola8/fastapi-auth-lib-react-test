type StatusType = 'success' | 'error' | ''

export interface StatusState {
  type: StatusType
  message: string
}


export interface UserProfile {
  user_id: string
  email: string
  username: string
  status: string
  roles: string[]
  created_at: string
  updated_at: string
}
