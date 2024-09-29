
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { checkAuth } from './auth'; 

const getDisplayName = (WrappedComponent) =>

  WrappedComponent.displayName || WrappedComponent.name || 'Component'
  
const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      async function fetchAuthStatus() {
        try {
          const isAuthenticated = await checkAuth();
          setIsAuthenticated(isAuthenticated);
        } catch (error) {
          // Handle any errors gracefully
          setIsAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      }

      fetchAuthStatus();
    }, []);

    if (isLoading) {
      // Display a loading indicator or message while checking authentication
      return <div></div>;
    }

    if (!isAuthenticated) {
      // Redirect to the login page or show an unauthorized message
      router.push('/');
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Assign the display name for debugging purposes
  WithAuth.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

  return WithAuth;
};

export default withAuth;

