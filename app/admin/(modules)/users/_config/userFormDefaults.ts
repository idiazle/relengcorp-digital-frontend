import type { User } from '../_models/user.models'

export const emptyUserForm: User = {
  code: '',
  dui: '',
  name: '',
  last_name: '',
  short_name: '',
  email: '',
  phone: '',
  username: '',
  password: '',
  position: '',
  groups: []
}
