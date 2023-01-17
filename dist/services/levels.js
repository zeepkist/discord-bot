import { api } from './api.js'

export const getLevels = async ({
  Id,
  Author,
  Name,
  Uid,
  WorkshopId,
  Limit,
  Offset
} = {}) => {
  const query = {
    Id,
    Author,
    Name,
    Uid,
    WorkshopId,
    Limit,
    Offset
  }
  const response = await api.get('levels', { params: query })
  if (response.status === 200) return response.data
  else {
    throw response.data.error
  }
}
