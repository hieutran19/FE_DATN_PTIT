import { nanoid } from 'nanoid'

export const ID_DEFAULT_LENGTH = 5

export const generateKey = (length = ID_DEFAULT_LENGTH) => nanoid(length)
