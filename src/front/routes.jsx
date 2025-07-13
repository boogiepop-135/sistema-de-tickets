// Import necessary components and functions from react-router-dom.
// Force rebuild - 12 julio 2025

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import Login from "./pages/Login";
import CreateTicket from "./pages/CreateTicket";
import AdminTickets from "./pages/AdminTickets";
import AdminUsers from "./pages/AdminUsers";
import { useAuth } from "./hooks/useAuth";

function WithAuth({ component: Component }) {
  const { user } = useAuth();
  return <Component user={user} />;
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-ticket" element={<WithAuth component={CreateTicket} />} />
      <Route path="/admin-tickets" element={<WithAuth component={AdminTickets} />} />
      <Route path="/admin-users" element={<WithAuth component={AdminUsers} />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);