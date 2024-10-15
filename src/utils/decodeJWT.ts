import { jwtDecode } from 'jwt-decode';
export interface DecodedJWT {
  data: {
    _id: string
    email: string
    role: string
  },
  exp: number
  iat: number
}


const decodeJWT = (token: string | null): DecodedJWT | null => {
    if (token) {
      try {
        const decoded: DecodedJWT = jwtDecode(token);
        return decoded
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return null
      }
    } else {
      return null
    }
};

export default decodeJWT
