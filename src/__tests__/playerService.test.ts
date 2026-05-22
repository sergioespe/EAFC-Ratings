// fetchPlayers usa el JSON mockeado en src/__mocks__/listadoJugadores.cjs
// (2 jugadores: Messi y C. Ronaldo)
import { fetchPlayers } from '../api/playerService';

// fetchPlayers llama a setTimeout(800ms) — lo eliminamos en tests
jest.useFakeTimers();

describe('fetchPlayers', () => {
  // Helper que lanza el fetch y avanza el timer de 800ms
  const callFetch = async (
    pageParam = 0,
    searchTerm = ''
  ) => {
    const promise = fetchPlayers({ pageParam, queryKey: ['players', searchTerm] } as Parameters<typeof fetchPlayers>[0]);
    jest.runAllTimers();
    return promise;
  };

  it('devuelve los 2 jugadores del mock sin filtro', async () => {
    const result = await callFetch();
    expect(result.items).toHaveLength(2);
  });

  it('devuelve nextCursor null cuando no hay más páginas', async () => {
    const result = await callFetch();
    expect(result.nextCursor).toBeNull();
  });

  it('filtra por commonName de forma case-insensitive', async () => {
    const result = await callFetch(0, 'messi');
    expect(result.items).toHaveLength(1);
    expect(result.items[0].commonName).toBe('Messi');
  });

  it('filtra por lastName', async () => {
    const result = await callFetch(0, 'ronaldo');
    expect(result.items).toHaveLength(1);
    expect(result.items[0].lastName).toBe('Ronaldo');
  });

  it('devuelve array vacío si no hay coincidencias', async () => {
    const result = await callFetch(0, 'asdfghjkl');
    expect(result.items).toHaveLength(0);
    expect(result.nextCursor).toBeNull();
  });

  it('pagina correctamente: pageParam 1 devuelve vacío (sólo 2 jugadores en el mock)', async () => {
    const result = await callFetch(1);
    expect(result.items).toHaveLength(0);
    expect(result.nextCursor).toBeNull();
  });
});
