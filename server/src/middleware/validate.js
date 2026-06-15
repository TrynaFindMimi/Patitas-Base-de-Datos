import { validationResult } from 'express-validator';

export const validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const msgs = errores.array().map(e => e.msg).join(', ');
    return res.status(422).json({ error: msgs });
  }
  next();
};