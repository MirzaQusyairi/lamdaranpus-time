import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import { Spinner } from 'flowbite-react';

function ProtectedRoute({ path, ...props }) {
  async function getUserSession() {
    try {
      const { data: session, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        return null;
      }

      return session;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const [session, setSession] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      const session = await getUserSession();
      setSession(session);

    }
    fetchSession();
  }, []);

  if (session === null) {
    return <div className='flex justify-center'>
      <Spinner size='xl'/>
    </div>;
  } else if (session.session !== null) {
    return <Outlet />;
  } else {
    return <Navigate to="/welcome" />;
  }
}

export default ProtectedRoute;
