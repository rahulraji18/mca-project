export async function checkAuth() {
    try {
      if (typeof window !== 'undefined') {
        const authToken = localStorage.getItem('token');
        return authToken !== null;
      }
      return false;
    } catch (error) {
      return false; 
    }
  }
  