import Boom from '@hapi/boom';

export default (): Error => {
  throw Boom.tooManyRequests(
    'Has excedido el límite de solicitudes por minuto, espera unos momentos para intentarlo',
  );
};
