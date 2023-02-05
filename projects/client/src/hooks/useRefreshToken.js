import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get('/refresh', {
      withCredentials: true,
    });
    setAuth((prev) => {
      // console.log(JSON.stringify(prev));
      // console.log(response.data.accessToken);
      return {
        ...prev,
        accessToken: response.data.accessToken,
        email: response.data.email,
        isTenant: response.data.isTenant,
        name: response.data.name,
        userId: response.data.userId,
        userPhoto: response.data.userPhoto,
        tenantId: response.data.tenantId,
        createdAt : response.data.createdAt
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
