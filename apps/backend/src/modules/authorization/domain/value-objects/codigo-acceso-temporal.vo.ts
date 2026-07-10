import * as bcrypt from 'bcrypt';

// Alfabeto sin caracteres ambiguos (0/O, 1/I/l)
const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const LONGITUD_CODIGO = 6;
const SALT_ROUNDS = 10;

/**
 * Value Object que encapsula el código alfanumérico de un PaseAccesoRapido.
 * El código en claro nunca se persiste — solo su hash bcrypt.
 */
export class CodigoAccesoTemporal {
  private constructor(public readonly hash: string) {}

  static async generar(): Promise<{ codigoPlano: string; codigoHash: string }> {
    let codigoPlano = '';
    for (let i = 0; i < LONGITUD_CODIGO; i++) {
      codigoPlano += ALFABETO.charAt(Math.floor(Math.random() * ALFABETO.length));
    }
    const codigoHash = await bcrypt.hash(codigoPlano, SALT_ROUNDS);
    return { codigoPlano, codigoHash };
  }

  static desdeHash(hash: string): CodigoAccesoTemporal {
    return new CodigoAccesoTemporal(hash);
  }

  async validar(codigoPlano: string): Promise<boolean> {
    return bcrypt.compare(codigoPlano.toUpperCase().trim(), this.hash);
  }
}
