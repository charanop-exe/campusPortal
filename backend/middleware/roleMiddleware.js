// ============================================================
// Role-Based Authorization Middleware
// Usage: authorize('admin', 'faculty')
// ============================================================

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access forbidden. Insufficient privileges.' });
        }

        next();
    };
};

export default authorize;
