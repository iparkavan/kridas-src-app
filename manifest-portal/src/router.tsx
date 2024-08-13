import { createBrowserRouter } from 'react-router-dom';
import { routes } from './constants/routes';
import { AuthLayout } from './features/authentication/components/layout/auth-layout';
import { AuthIndex } from './pages/auth-index';
import { VerifyEmail } from './pages/verify-email';
import { RootLayout } from './features/dashboard/components/layout/root-layout';
import { Credentials } from './pages/credentials';
import { Webhooks } from './pages/webhooks';
import { Activity } from './pages/activity';
import { ProtectedRoutes } from './components/router/protected-routes';
import { ForgotPassword } from './pages/forgot-password';
import SettingsLayout from './features/dashboard/components/layout/settings-layout';
import { Team } from './pages/team';
import { Profile } from './pages/profile';
import { Security } from './pages/security';
import { Admin } from './pages/admin';
import { BubbleError } from './components/error/bubble-error';
import { Invitation } from './pages/invitation';

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <BubbleError />,
    children: [
      {
        path: routes.index,
        element: <AuthIndex />,
      },
      {
        path: routes.forgotPassword,
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: routes.verifyEmail,
    element: <VerifyEmail />,
    errorElement: <BubbleError />,
  },
  {
    path: routes.invitation,
    element: <Invitation />,
  },
  {
    element: <ProtectedRoutes />,
    errorElement: <BubbleError />,
    children: [
      {
        // Contains the environment state
        element: <RootLayout />,
        children: [
          {
            path: routes.credentials,
            element: <Credentials />,
          },
          {
            path: routes.webhooks,
            element: <Webhooks />,
          },
          {
            path: routes.activity,
            element: <Activity />,
          },
          {
            path: routes.admin,
            element: <Admin />,
          },
          {
            element: <SettingsLayout />,
            children: [
              {
                path: routes.settingsTeam,
                element: <Team />,
              },
              {
                path: routes.settingsProfile,
                element: <Profile />,
              },
              {
                path: routes.settingsSecurity,
                element: <Security />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export { router };
