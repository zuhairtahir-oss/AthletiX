import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import LivePage from "../pages/LivePage";
import PlayersPage from "../pages/PlayersPage";
import PlayerDetailPage from "../pages/PlayerDetailPage";
import TeamsPage from "../pages/TeamsPage";
import TeamDetailPage from "../pages/TeamDetailPage";
import ComparePage from "../pages/ComparePage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "live", element: <LivePage /> },
      { path: "players", element: <PlayersPage /> },
      { path: "players/:league/:id", element: <PlayerDetailPage /> },
      { path: "teams", element: <TeamsPage /> },
      { path: "teams/:league/:id", element: <TeamDetailPage /> },
      { path: "compare", element: <ComparePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
