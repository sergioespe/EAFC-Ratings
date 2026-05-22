# EAFC Ratings

Aplicación web para explorar las valoraciones de jugadores de EA FC 25. Permite listar, buscar y consultar el detalle de cada jugador con scroll infinito y persistencia de caché en local storage.

🚀 **[Ver demo en producción](https://eafc-ratings.vercel.app/)**

---

## Ejecutar en local

### Requisitos previos

- **Node.js** v18 o superior
- **npm** v9 o superior

### Instalación y arranque

```bash
# 1. Clona el repositorio
git clone https://github.com/sergioespe/EAFC-Ratings.git
cd EAFC-Ratings

# 2. Instala las dependencias
npm install

# 3. Arranca el servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

> La primera carga puede tardar ~1 segundo mientras Vite procesa el JSON de jugadores. Las recargas posteriores son instantáneas gracias a la persistencia en localStorage.

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo (Vite, puerto 5173)
npm run build    # Build de producción en /dist
npm run preview  # Previsualiza el build de producción localmente
npm run lint     # ESLint sobre todo el proyecto
npm test         # Tests unitarios con Jest
```

---

## Tecnologías principales

| Tecnología | Versión | Rol |
|---|---|---|
| React | 19 | UI library |
| TypeScript | 6 | Tipado estático |
| Vite | 8 | Bundler y dev server |
| Material UI (MUI) | 9 | Sistema de componentes |
| TanStack Query | 5 | Gestión de estado asíncrono y caché |
| React Router | 7 | Navegación SPA |
| Jest + Testing Library | 29 / 16 | Tests unitarios |

---

## Estructura del proyecto

```
src/
├── __mocks__/              # Mocks para Jest
│   ├── fileMock.cjs        # Stub de imágenes/SVG
│   └── listadoJugadores.cjs# Dataset reducido (2 jugadores) para tests
├── __tests__/              # Tests unitarios
│   ├── EmptyState.test.tsx
│   ├── PlayerCard.test.tsx
│   └── playerService.test.ts
├── api/
│   ├── playerService.ts    # Capa de datos: filtrado y paginación
│   └── queryClient.ts      # Configuración global de TanStack Query
├── components/
│   ├── EmptyState.tsx      # Estado vacío para búsquedas sin resultados
│   ├── PlayerCard.tsx      # Tarjeta de jugador con enlace al detalle
│   └── PlayerSkeleton.tsx  # Skeleton de carga
├── hooks/
│   └── usePlayers.ts       # Hook de infinite scroll + búsqueda
├── pages/
│   ├── Home.tsx            # Listado principal con búsqueda
│   └── PlayerDetail.tsx    # Detalle de jugador
├── types/
│   └── player.ts           # Interfaces TypeScript del dominio
├── data/
│   └── listadoJugadores.json # Fuente de datos local
├── App.tsx                 # Router raíz
├── main.tsx                # Entry point, inicializa QueryClient
└── setupTests.ts           # Setup global de Jest
```

---

## Decisiones de arquitectura

### 1. Datos locales en lugar de API remota

Los datos de jugadores se sirven desde un archivo JSON local (`src/data/listadoJugadores.json`). La función `fetchPlayers` simula el comportamiento de una API real con un delay de 800 ms para que el comportamiento en desarrollo sea idéntico al que tendría con un endpoint HTTP real.

**Por qué:** Permite desarrollar y testear sin depender de una API externa ni gestionar CORS, claves de autenticación ni disponibilidad del servidor.

---

### 2. TanStack Query como capa de estado asíncrono

`useInfiniteQuery` gestiona todo el ciclo de vida de los datos: carga, paginación, error y caché. No se usa ningún estado global (Redux, Zustand, Context) para los datos de jugadores.

```
usePlayers(searchTerm)
  └── useInfiniteQuery
        ├── queryKey: ['players', searchTerm]   ← clave compuesta
        ├── queryFn: fetchPlayers               ← capa de datos
        └── getNextPageParam: lastPage.nextCursor
```

**Por qué:** TanStack Query elimina el boilerplate de loading/error/data y proporciona deduplicación de peticiones, revalidación y caché out-of-the-box. No hay necesidad de un store global para este caso de uso.

---

### 3. Búsqueda integrada en la queryKey

El término de búsqueda forma parte de la `queryKey`: `['players', searchTerm]`. Esto hace que cada término de búsqueda distinto tenga su propia entrada en el caché.

```ts
// usePlayers.ts
queryKey: ['players', searchTerm]
```

```ts
// playerService.ts — filtra ANTES de paginar
const [_key, searchTerm] = queryKey;
if (searchTerm) {
  allPlayers = allPlayers.filter(player => ...)
}
```

**Por qué:** Filtrar en cliente sólo sobre los items ya cargados no funciona con scroll infinito (sólo buscaría en la primera página). Al incluir el término en la `queryKey`, TanStack Query lanza una nueva consulta y filtra sobre el dataset completo. Además, si el usuario vuelve a escribir el mismo término, el resultado viene del caché sin delay.

---

### 4. `useDeferredValue` para evitar búsquedas por cada tecla

```ts
const [searchTerm, setSearchTerm] = useState('');
const deferredSearchTerm = useDeferredValue(searchTerm);

const { data } = usePlayers(deferredSearchTerm);
```

React actualiza `searchTerm` (y el input visible) de forma inmediata con cada tecla, pero `deferredSearchTerm` —y por tanto la consulta a TanStack Query— sólo se actualiza cuando el hilo principal está libre, evitando bloqueos visuales.

**Por qué:** Alternativa a debounce sin necesidad de librerías externas. Es un patrón de concurrencia nativo de React 18+ que no introduce timeouts artificiales.

---

### 5. Persistencia en localStorage

El caché de TanStack Query se persiste automáticamente en `localStorage` mediante `@tanstack/react-query-persist-client`:

```ts
// queryClient.ts
gcTime: 1000 * 60 * 60 * 24  // 24 horas en caché
staleTime: 1000 * 60 * 5     // refresca si han pasado 5 minutos
```

**Por qué:** El dataset pesa varios MB. Persistirlo evita tener que releer y procesar el JSON en cada recarga de página, mejorando significativamente el tiempo de carga percibido.

---

### 6. Scroll infinito con Intersection Observer

El scroll infinito se implementa con `react-intersection-observer`. Un elemento centinela invisible al final del listado dispara `fetchNextPage()` cuando entra en el viewport:

```tsx
const { ref, inView } = useInView();

useEffect(() => {
  if (inView && hasNextPage) fetchNextPage();
}, [inView, hasNextPage, fetchNextPage]);

// ...
<Box ref={ref} sx={{ height: 20, mt: 4 }} />
```

**Por qué:** Es la implementación más ligera y declarativa del patrón. No requiere listeners de scroll manuales ni cálculos de posición.

---

### 7. Navegación con `CardActionArea` + `RouterLink`

`PlayerCard` renderiza el área clickable como un enlace nativo (`<a>`) usando la composición de MUI con React Router:

```tsx
<CardActionArea component={RouterLink} to={`/player/${player.id}`}>
```

**Por qué:** El patrón `onClick + navigate()` no genera un `<a>` real, por lo que el usuario no puede abrir el detalle en una nueva pestaña (Ctrl+Click / middle click). Usando `component={RouterLink}`, MUI renderiza un `<a>` real con el href correcto manteniendo la navegación SPA.

---

### 8. Resolución del detalle del jugador sin segunda llamada a la API

`PlayerDetail` reutiliza el caché de `usePlayers()` (sin término de búsqueda) para encontrar el jugador por ID, sin hacer una petición adicional:

```ts
const player = data?.pages.flatMap(p => p.items).find(p => p.id.toString() === id);
```

**Por qué:** Los datos del jugador ya están en caché si el usuario viene del listado. No tiene sentido añadir un endpoint `/player/:id` para un dataset local.

---

## Decisiones de diseño de componentes

### Componentes declarados fuera del render

`StatBar` (en `PlayerDetail`) se declara a nivel de módulo, fuera del componente padre. Declarar componentes dentro del cuerpo de otro componente hace que React los cree desde cero en cada render, reseteando su estado.

### Estado de UI explícito

`Home` maneja cuatro estados de UI claramente diferenciados:
- `status === 'pending'` → Skeletons de carga
- `status === 'error'` → Alert de error
- `isEmpty === true` → `EmptyState` con el término buscado
- `!isEmpty && status === 'success'` → Grid de tarjetas

---

## Tests

Los tests usan **Jest** con **React Testing Library** y **jsdom** como entorno de DOM.

### Estrategia de mocking

El JSON de jugadores se reemplaza en tests por un dataset de 2 jugadores (`src/__mocks__/listadoJugadores.cjs`) mediante `moduleNameMapper` en la config de Jest. Esto hace los tests rápidos, predecibles y sin dependencias de datos reales.

### Cobertura

| Archivo | Tests | Qué verifica |
|---|---|---|
| `EmptyState.test.tsx` | 3 | Texto principal, término de búsqueda en mensaje, icono SVG |
| `PlayerCard.test.tsx` | 6 | commonName vs firstName+lastName, liga, OVR, posición, href del enlace |
| `playerService.test.ts` | 6 | Sin filtro, nextCursor null, filtro commonName, filtro lastName, sin resultados, paginación |

### Ejecutar los tests

```bash
npm test
```