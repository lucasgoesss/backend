/**
 * Middleware que verifica se o usuário é administrador.
 * Se for administrador, prossegue para a próxima função.
 * Caso contrário, retorna um erro de autorização.
 */
module.exports = function ensureAdmin(req, res, next) {
    const { is_admin } = req.user;

    if (!is_admin) {
        return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
    }

    return next();
};
