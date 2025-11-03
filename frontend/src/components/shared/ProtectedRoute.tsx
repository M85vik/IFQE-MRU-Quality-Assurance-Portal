// import React from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import useAuthStore from '../../store/authStore';

// const ProtectedRoute = ({ allowedRoles }) => {
//   const { userInfo } = useAuthStore();
//   const location = useLocation();
  
//   // This is a common pattern to handle the initial state hydration from localStorage.
//   // The store might not have the user info on the very first render cycle.
//   // We can add a check for this, but the primary logic should be simpler.

//   // Let's debug first by simplifying the logic.
//   // The issue might be in how the state is initialized.

//   // Let's add a state to check if the store has been hydrated
//   const [isHydrated, setIsHydrated] = React.useState(false);
  
//   React.useEffect(() => {
//     // This effect will run once after the component mounts and the store has had a chance to hydrate from localStorage
//     setIsHydrated(true);
//   }, []);

//   if (!isHydrated) {
//       // While waiting for the store to hydrate, render nothing or a spinner
//       return null;
//   }
  
//   // --- Main Logic ---
//   // 1. Is the user logged in?
//   if (!userInfo) {
//     // If not, redirect to the login page.
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // 2. User is logged in. Do they have the required role?
//   const isAuthorized = allowedRoles.includes(userInfo.role);
//   if (!isAuthorized) {
//     // If they are logged in but don't have the right role, send them to the unauthorized page.
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // 3. User is logged in and authorized. Render the content.
//   return <Outlet />;
// };

// // --- Let's try an even simpler version without the hydration state first.
// // The problem is almost certainly the routing structure in App.jsx.

// const SimpleProtectedRoute = ({ allowedRoles }) => {
//     const { userInfo } = useAuthStore.getState(); // Read state directly for immediate check
//     const location = useLocation();

//     if (!userInfo) {
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }

//     if (!allowedRoles.includes(userInfo.role)) {
//         return <Navigate to="/unauthorized" replace />;
//     }

//     return <Outlet />;
// }

// // Sticking to the previous `ProtectedRoute` as the use of `useAuthStore.getState()` can be problematic.
// // The real issue is the routing structure.
// export default ProtectedRoute;


import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const PrivateRoute = () => {
  const { userInfo } = useAuthStore();
  const location = useLocation();

  if (!userInfo) {
    // If user is not logged in, redirect them to the login page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in, render the child routes (which includes the MainLayout).
  return <Outlet />;
};

export default PrivateRoute;