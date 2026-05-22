import { render, screen } from '@testing-library/react';
import { EmptyState } from '../components/EmptyState';

describe('EmptyState', () => {
  it('muestra el mensaje principal "No se encontraron resultados"', () => {
    render(<EmptyState searchTerm="asdfghjkl" />);
    expect(screen.getByText('No se encontraron resultados')).toBeInTheDocument();
  });

  it('muestra el término de búsqueda en el mensaje secundario', () => {
    render(<EmptyState searchTerm="Messi" />);
    expect(
      screen.getByText(/coincida con "Messi"/i)
    ).toBeInTheDocument();
  });

  it('muestra el ícono de búsqueda vacía (SVG)', () => {
    const { container } = render(<EmptyState searchTerm="test" />);
    // El ícono de MUI se renderiza como un SVG
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
