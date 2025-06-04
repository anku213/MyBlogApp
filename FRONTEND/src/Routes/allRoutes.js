import Index from "../Pages/Authentication/Index";
import BlogDetail from "../Pages/Blogs/BlogDetail";
import MyBlogs from "../Pages/Blogs/MyBlogs";
import Category from "../Pages/Categories/Category";
import Dashboard from "../Pages/Dashboard/Dashboard";
import CategoryQuestions from "../Pages/StudyMaterial/CategoryQuestions";
import StudyMaterial from "../Pages/StudyMaterial/StudyMaterial";
import MyProfile from "../Pages/User/MyProfile";

const commonRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/blog/:id", component: <BlogDetail /> },
];

const privateRoutes = [
  { path: "/categories", component: <Category /> },
  { path: "/my-blogs", component: <MyBlogs /> },
  { path: "/myprofile", component: <MyProfile /> },
  { path: "/study-material", component: <StudyMaterial /> },
  { path: "/study-material/:categoryId", component: <CategoryQuestions /> },
];

const publicRoutes = [
  { path: "/login", component: <Index /> },
  { path: "/register", component: <Index /> },
];

const defaultRoute = { path: "/*", component: <Dashboard /> };

export { commonRoutes, privateRoutes, publicRoutes, defaultRoute };
