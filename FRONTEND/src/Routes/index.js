import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { commonRoutes, privateRoutes, publicRoutes, defaultRoute } from './allRoutes';
import AuthProtected from './AuthProtected';
import PublicRoute from './publicRoute';

const Index = () => {
    return (
        <Routes>
            {/* Common Routes (accessible to everyone) */}
            {commonRoutes.map((route, idx) => (
                <Route
                    key={idx}
                    path={route.path}
                    element={route.component}
                    exact={true}
                />
            ))}

            {/* Public Routes (only for non-logged-in users) */}
            <Route element={<PublicRoute />}>
                {publicRoutes.map((route, idx) => (
                    <Route
                        key={idx}
                        path={route.path}
                        element={route.component}
                        exact={true}
                    />
                ))}
            </Route>

            {/* Private Routes (only for logged-in users) */}
            <Route element={<AuthProtected />}>
                {privateRoutes.map((route, idx) => (
                    <Route
                        key={idx}
                        path={route.path}
                        element={route.component}
                        exact={true}
                    />
                ))}
            </Route>

            {/* Default Route (catch-all) */}
            <Route
                path={defaultRoute.path}
                element={defaultRoute.component}
            />
        </Routes>
    );
};

export default Index;